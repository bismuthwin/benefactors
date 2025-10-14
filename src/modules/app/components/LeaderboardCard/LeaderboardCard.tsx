"use client";

import { Text } from "@mantine/core";
import { PunchableAvatar } from "~/modules/users/components/PunchableAvatar";
import type { LeaderboardPosition } from "~/types/LeaderboardPosition";
import { useSession } from "next-auth/react";

import styles from "./LeaderboardCard.module.scss";

interface LeaderboardCardProps {
    leaderPos: LeaderboardPosition;
    position: number;
}

export function LeaderboardCard({ leaderPos, position }: LeaderboardCardProps) {
    const { data: session } = useSession({ required: false });
    const isAdmin = session?.user.role === "Admin";
    const isGreen = Number(leaderPos.totalCzkAmount) > 500;

    return (
        <>
            <div
                className={styles.chip}
                data-placement={position}
                data-amount={leaderPos.totalCzkAmount}
                data-green-amount={isGreen ? "true" : "false"}
            >
                <PunchableAvatar
                    src={leaderPos.user.image ?? ""}
                    particles={isAdmin}
                    soundUrl={isAdmin ? "/sfx/punch.mp3" : undefined}
                    scalar={2}
                />
                <Text className={styles.name}>{leaderPos.user.name}</Text>
                <Text className={styles.price_czk}>{Number(leaderPos.totalCzkAmount).toFixed(2)} CZK</Text>
            </div>
        </>
    );
}
