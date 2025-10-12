import { PrismaAdapter } from "@auth/prisma-adapter";
import type { UserRole } from "@prisma/client";
import { Routes } from "~/constants/routes";
import { env } from "~/env";
import { db } from "~/server/db";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider, { type DiscordProfile } from "next-auth/providers/discord";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: MyUser;
    }

    // Only wanted properties from schema.prisma User model
    interface MyUser {
        discord_id: string;
        name: string;
        image: string;
        role: UserRole;
    }
}

// Custom adapter, because i dont want email verification
const prismaAdapter = PrismaAdapter(db);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
prismaAdapter.createUser = (data: MyUser) => {
    console.log("Creating user with data:", data);
    return db.user.create({
        data: {
            id: data.discord_id, // ensures the ID is the same as the discord ID
            name: data.name,
            image: data.image,
            role: data.role,
        },
    });
};

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
    providers: [
        DiscordProvider({
            authorization: "https://discord.com/oauth2/authorize?scope=identify+guilds+guilds.members.read",
            profile: (profile: DiscordProfile) => {
                return {
                    discord_id: profile.id,
                    name: profile.global_name ?? profile.username,
                    image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
                    role: "User" as UserRole,
                };
            },
        }),
        /**
         * ...add more providers here.
         *
         * Most other providers require a bit more work than the Discord provider. For example, the
         * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
         * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
         *
         * @see https://next-auth.js.org/providers/github
         */
    ],
    adapter: prismaAdapter,
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                discord_id: user.discord_id,
            },
        }),
        async signIn({ profile: _profile, account, user: _user }) {
            // Only check Discord provider
            if (account?.provider !== "discord") {
                return true;
            }

            // Ensure we have a valid access token
            if (!account?.access_token) {
                console.error("No access token available for Discord provider");
                return false;
            }

            try {
                const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
                    headers: {
                        Authorization: `Bearer ${account.access_token}`,
                    },
                });

                if (!response.ok) {
                    console.error("Failed to fetch Discord guilds:", response.statusText);
                    return false;
                }

                const guilds = (await response.json()) as { id: string; name: string }[];
                const userGuildIds = guilds.map((guild) => guild.id);

                // First check if user is in the bypass list
                const bypassEntry = await db.bypassList.findFirst({
                    where: {
                        discordId: account?.providerAccountId,
                    },
                });

                if (bypassEntry) {
                    return true;
                }

                // Then check if user is in the main guild
                if (userGuildIds.includes(env.MAIN_GUILD_ID)) {
                    return true;
                }

                return false;
            } catch (error) {
                console.error("Error fetching Discord guilds during user allowed checking:", error);
                return false;
            }
        },
    },
    // pages: {
    //     error: Routes.HOME,
    // },
} satisfies NextAuthConfig;
