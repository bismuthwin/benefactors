"use client";

import { Container, Divider, Flex, SimpleGrid, Text, Title } from "@mantine/core";
import { DiscordLoginOverlay, LoadOverlay, ObjectCard, useObjects } from "~/modules";
import { useSession } from "next-auth/react";

export default function ObjectsPage() {
    const { data: session, status } = useSession({ required: false });

    const { data: objects, isLoading } = useObjects();

    if (isLoading || status === "loading") return <LoadOverlay visible />;

    if (session == null) return <DiscordLoginOverlay />;

    return (
        <Flex direction={"column"} w={"100%"} h={"100%"} gap={"xs"} align={"center"} style={{ flexGrow: 1 }} p={"lg"}>
            <Container w={"100%"}>
                <Flex direction={"column"} gap={"xs"} w={"100%"}>
                    <Title>Objects</Title>
                    <Text mb={"xl"}>
                        This is where all of the current finished and ongoing objects/goals are going on
                    </Text>

                    <Title order={2}>Ongoing</Title>
                    <Divider />
                    <SimpleGrid cols={2} spacing="md" verticalSpacing="md">
                        {objects?.length == 0 && <Text>No objects created yet :(</Text>}
                        {objects
                            ?.filter(
                                (x) => x.chips.reduce((acc, chip) => acc + Number(chip.czk_amount), 0) < x.total_price,
                            )
                            .map((object, index) => (
                                <ObjectCard key={index} object={object} />
                            ))}
                    </SimpleGrid>
                    <Divider />
                    <Title order={2}>Finished</Title>
                    <Divider />
                    <SimpleGrid cols={2} spacing="md" verticalSpacing="md">
                        {objects?.length == 0 && <Text>No objects created yet :(</Text>}
                        {objects
                            ?.filter(
                                (x) => x.chips.reduce((acc, chip) => acc + Number(chip.czk_amount), 0) >= x.total_price,
                            )
                            .map((object, index) => (
                                <ObjectCard key={index} object={object} />
                            ))}
                    </SimpleGrid>
                </Flex>
            </Container>
        </Flex>
    );
}
