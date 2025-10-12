/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env";

import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
    experimental: {
        optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
    },
    sassOptions: {
        implementation: "sass-embedded",
        additionalData: `@use "${path.join(process.cwd(), "_mantine").replace(/\\/g, "/")}" as mantine;`,
        silenceDeprecations: ["legacy-js-api"],
    },
    images: {
        domains: ["flwn.dev", "files.flwn.dev", "i.flwn.dev", "cdn.discordapp.com", "cdn.cloudflare.steamstatic.com"],
    },
    // redirects: async () => [
    //     {
    //         source: "/discord",
    //         destination: "https://discord.gg/dnuQCb3JvR",
    //         permanent: false,
    //     },
    // ],
};

export default nextConfig;
