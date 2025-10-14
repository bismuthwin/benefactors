"use client";

import { Center, Container, Divider, Flex, Group, SimpleGrid, Text } from "@mantine/core";
import { DiscordLoginOverlay, LeaderboardCard, LoadOverlay, useChips, useObjects } from "~/modules";
import type { LeaderboardPosition } from "~/types/LeaderboardPosition";
import { useSession } from "next-auth/react";

import styles from "./page.module.scss";

export default function LeaderboardPage() {
    const { data: session, status } = useSession({ required: false });

    const { data: chips, isLoading } = useChips();
    const { data: objects, isLoading: objectsLoading } = useObjects();

    if (isLoading || objectsLoading || status === "loading") return <LoadOverlay visible />;

    if (session == null) return <DiscordLoginOverlay />;

    const leaderboardPositions: LeaderboardPosition[] = [];

    // Get total of chips by users
    chips?.forEach((chip) => {
        // skip if chip is included in an unlisted object
        if (objects?.find((o) => o.chips.some((c) => c.id === chip.id) && !o.unlisted) == null) return;

        const chipAmount = Number(chip.czk_amount);

        if (leaderboardPositions.some((pos) => pos.user.id === chip.chippedInByUser.id)) {
            const pos = leaderboardPositions.find((p) => p.user.id === chip.chippedInByUser.id);
            if (pos) {
                pos.totalCzkAmount += chipAmount;
            }
        } else {
            leaderboardPositions.push({
                user: chip.chippedInByUser,
                totalCzkAmount: chipAmount,
            });
        }
    });

    const total_verified_chips = objects
        ?.filter((o) => !o.unlisted)
        .reduce((acc, obj) => {
            const verified_chips = obj.chips
                ?.filter((c) => c.verified)
                .reduce((chipAcc, chip) => chipAcc + Number(chip.czk_amount), 0);
            return acc + (verified_chips ?? 0);
        }, 0);

    return (
        <Flex direction={"column"} w={"100%"} h={"100%"} gap={"xs"} align={"center"} style={{ flexGrow: 1 }} p={"lg"}>
            <Container w={"100%"}>
                <Flex direction={"column"} gap={"xs"} w={"100%"}>
                    <Flex direction={"column"} align={"center"} justify={"center"} mb={"sm"}>
                        <Text className={styles.title}>The Leaderboard</Text>
                        <Group>
                            <Text className={styles.totalFlavortext}>Total raised:</Text>
                            <Text className={styles.total}>{total_verified_chips} CZK</Text>
                        </Group>
                    </Flex>
                    {chips?.length == 0 ? (
                        <Center>
                            <Text>No chips.... haha fhuu</Text>
                        </Center>
                    ) : (
                        <SimpleGrid cols={1} verticalSpacing="xs">
                            {leaderboardPositions
                                ?.sort((a, b) => b.totalCzkAmount - a.totalCzkAmount)
                                .map((pos, index) => (
                                    <LeaderboardCard key={index} leaderPos={pos} position={index} />
                                ))}
                        </SimpleGrid>
                    )}
                    <Divider />
                </Flex>
            </Container>
        </Flex>
    );
}
