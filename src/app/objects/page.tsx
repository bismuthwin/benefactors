"use client";

import { Center, Container, Divider, Flex, SimpleGrid, Text, Title } from "@mantine/core";
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
                    {objects?.filter((x) => !x.finished && !x.unlisted).length == 0 ? (
                        <Center>
                            <Text>No ongoing objects</Text>
                        </Center>
                    ) : (
                        <SimpleGrid cols={2} spacing="md" verticalSpacing="md">
                            {objects
                                ?.filter((x) => !x.finished && !x.unlisted)
                                .map((object, index) => (
                                    <ObjectCard key={index} object={object} />
                                ))}
                        </SimpleGrid>
                    )}
                    <Divider />
                    <Title order={2}>Finished</Title>
                    <Divider />
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md" mb={"xl"}>
                        {objects?.length == 0 && <Text>No objects created yet :(</Text>}
                        {objects
                            ?.filter((x) => x.finished && !x.unlisted)
                            .map((object, index) => (
                                <ObjectCard key={index} object={object} />
                            ))}
                    </SimpleGrid>
                </Flex>
            </Container>
        </Flex>
    );
}
