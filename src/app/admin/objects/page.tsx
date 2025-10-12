"use client";

import { Container, Flex, Title } from "@mantine/core";
import { AdminObjectCard, Authorized, useObjects } from "~/modules";

// Force dynamic rendering to prevent prerendering during build
export const dynamic = "force-dynamic";

export default function AdminObjectsPage() {
    const { data: objects } = useObjects();

    if (!objects) return <div>Loading...</div>;

    return (
        <Authorized role={"Admin"} redirectHome>
            <Flex direction={"column"} justify={"center"} w={"100%"}>
                <Flex
                    direction={"column"}
                    w={"100%"}
                    h={"100%"}
                    gap={"xs"}
                    justify={"center"}
                    align={"center"}
                    style={{ flexGrow: 1 }}
                    p={"lg"}
                >
                    <Container w={"100%"}>
                        <Flex direction={"column"} w={"100%"} gap={"xs"}>
                            <Title>Objects</Title>
                            {objects.map((object) => (
                                <AdminObjectCard key={object.id} object={object} />
                            ))}
                        </Flex>
                    </Container>
                </Flex>
            </Flex>
        </Authorized>
    );
}
