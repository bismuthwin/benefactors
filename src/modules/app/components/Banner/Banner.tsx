"use client";

import Link from "next/link";
import { ActionIcon, BackgroundImage, Button, Flex, Image, Modal, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";

import styles from "./Banner.module.scss";

export function Banner() {
    const [openedCredits, { open: openCredits, close: closeCredits }] = useDisclosure(false);

    return (
        <>
            <BackgroundImage src={"/img/bismuth.avif"} h={"100%"}>
                <Flex
                    w={"100%"}
                    h={"100%"}
                    style={{ flexGrow: 1 }}
                    direction={"column"}
                    justify={"center"}
                    align={"center"}
                >
                    <Text className={styles.title}>Bismuth Benefactors</Text>
                </Flex>
                <Tooltip label="Image credits" position="top" withArrow>
                    <ActionIcon
                        pos={"absolute"}
                        bottom={0}
                        right={0}
                        m={"sm"}
                        variant="transparent"
                        onClick={openCredits}
                    >
                        <IconInfoCircle opacity={0.5} />
                    </ActionIcon>
                </Tooltip>
            </BackgroundImage>
            <Modal opened={openedCredits} onClose={closeCredits} withCloseButton={false} centered>
                <Flex direction={"column"} gap={"md"} align={"center"}>
                    <Text>Background Image by Nicolas MIQUEL</Text>
                    <Text>Edited with higher saturation, changed HUE and blurred.</Text>
                    <Image src={"/img/bismuth.avif"} alt="" />
                    <Button
                        component={Link}
                        href="https://kranek.artstation.com/projects/58lPzO"
                        target="_blank"
                        rel="noreferrer"
                        fullWidth
                    >
                        Check out Nicolas MIQUEL
                    </Button>
                </Flex>
            </Modal>
        </>
    );
}
