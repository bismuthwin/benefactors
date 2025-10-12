"use client";

import { use } from "react";
import { Container, Divider, Flex, Image, Progress, Text } from "@mantine/core";
import { ChipCard, DiscordLoginOverlay, LoadOverlay, useObject } from "~/modules";
import { useSession } from "next-auth/react";

import styles from "./page.module.scss";

export default function ObjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { data: session, status } = useSession({ required: false });
    const { id } = use(params);

    const { data: object, isLoading } = useObject({ id });

    if (isLoading || status === "loading") return <LoadOverlay visible />;

    if (session == null) return <DiscordLoginOverlay />;

    if (object == null) return <Text>Object not found</Text>;

    const total_chipped_in = object.chips
        .filter((x) => x.verified)
        .reduce((acc, chip) => acc + Number(chip.czk_amount), 0);

    return (
        <Flex direction={"column"} w={"100%"} h={"100%"} gap={"xs"} align={"center"} style={{ flexGrow: 1 }} p={"lg"}>
            <Container w={"100%"}>
                <Flex direction={"column"} gap={"xs"} w={"100%"}>
                    <Flex direction={"column"} gap={"xs"} w={"100%"} className={styles.header}>
                        <Progress.Root h={"xl"}>
                            <Progress.Section
                                value={(total_chipped_in / object.total_price) * 100}
                                color="green"
                                animated={total_chipped_in < object.total_price}
                            >
                                <Progress.Label>
                                    <Text c="white" fw={700} fz="sm" className={styles.progressLabel}>
                                        {total_chipped_in.toFixed(2)} CZK
                                    </Text>
                                </Progress.Label>
                            </Progress.Section>
                            <Progress.Section
                                value={((object.total_price - total_chipped_in) / object.total_price) * 100}
                                color="black"
                            >
                                <Progress.Label>
                                    <Text c="red" fw={700} fz="sm" className={styles.progressLabel}>
                                        {(object.total_price - total_chipped_in).toFixed(2)} CZK left
                                    </Text>
                                </Progress.Label>
                            </Progress.Section>
                        </Progress.Root>
                        <div className={styles.imageHeader}>
                            <Text className={styles.name}>{object.name}</Text>
                            {object.imageUrl && (
                                <Image
                                    className={styles.image}
                                    src={object.imageUrl}
                                    width={1024}
                                    height={1024}
                                    alt={object.name}
                                />
                            )}
                        </div>

                        <Text mb={"xl"}>{object.description}</Text>

                        <Divider />
                        <Text ml={"auto"} mr={0} opacity={0.25} size="sm">
                            Created on: {new Date(object.createdAt).toLocaleDateString()}
                        </Text>
                    </Flex>

                    <Divider />
                    {object.chips
                        ?.sort((a, b) => (b.czk_amount === a.czk_amount ? 0 : b.czk_amount - a.czk_amount))
                        ?.sort((a, b) => (b.verified === a.verified ? 0 : b.verified ? 1 : -1))
                        ?.map((chip, index) => (
                            <ChipCard key={index} chip={chip} />
                        ))}
                    {object.chips.length === 0 && (
                        <div className={styles.noChips}>
                            <Text>No chips in yet :v</Text>
                        </div>
                    )}
                    <Divider />
                    <Flex w={"100%"} align={"end"} direction={"column"}>
                        <Text>Total price: {object.total_price} CZK</Text>
                        <Text style={{ marginLeft: 16 }}>Total chipped in: {total_chipped_in.toFixed(2)} CZK</Text>
                    </Flex>
                </Flex>
            </Container>
        </Flex>
    );
}
