"use client";

import { use } from "react";
import Link from "next/link";
import type { AdapterUser } from "@auth/core/adapters";
import {
    ActionIcon,
    Button,
    Center,
    Container,
    Divider,
    Flex,
    Group,
    Image,
    Modal,
    Progress,
    Text,
    Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBrandDiscord, IconBrandPaypalFilled, IconBrandRevolut, IconCoins, IconPencil } from "@tabler/icons-react";
import {
    ChipCard,
    CreateChipForm,
    LoadOverlay,
    ObjectForm,
    useObject,
    useUpdateObject,
    useUploadImage,
} from "~/modules";
import { signIn, useSession } from "next-auth/react";

import styles from "./page.module.scss";

export default function ObjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { data: session, status } = useSession({ required: false });
    const { id } = use(params);

    const { data: object, isLoading } = useObject({ id });
    const { mutate: updateObject } = useUpdateObject({ object_id: id });
    const { mutateAsync: uploadImage } = useUploadImage();

    const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
    const [openedChipIn, { open: openChipIn, close: closeChipIn }] = useDisclosure(false);

    if (isLoading || status === "loading") return <LoadOverlay visible />;
    if (isLoading) return <LoadOverlay visible />;

    // if (session == null) return <DiscordLoginOverlay />;

    if (object == null) return <Text>Object not found</Text>;

    const verified_chipped_in = object.chips
        .filter((x) => x.verified)
        .reduce((acc, chip) => acc + Number(chip.czk_amount), 0);

    const unverified_chipped_in = object.chips
        .filter((x) => !x.verified)
        .reduce((acc, chip) => acc + Number(chip.czk_amount), 0);

    const total_chipped_in = object.chips.reduce((acc, chip) => acc + Number(chip.czk_amount), 0);

    return (
        <>
            <Flex
                direction={"column"}
                w={"100%"}
                h={"100%"}
                gap={"xs"}
                align={"center"}
                style={{ flexGrow: 1 }}
                p={"lg"}
            >
                <Container w={"100%"}>
                    <Flex direction={"column"} gap={"xs"} w={"100%"}>
                        {object.unlisted && (
                            <Center>
                                <Text size="lg" className={styles.unlistedText}>
                                    👻 This object is unlisted. Only people with the link can see it. This is usually
                                    used for testing stuff out. 👻
                                </Text>
                            </Center>
                        )}
                        <Flex direction={"column"} gap={"xs"} w={"100%"} className={styles.header}>
                            <Progress.Root h={"xl"}>
                                <Tooltip withArrow label="Chips I have not yet received the money for.">
                                    <Progress.Section
                                        value={(unverified_chipped_in / object.total_price) * 100}
                                        color="orange"
                                        animated={unverified_chipped_in < object.total_price}
                                    >
                                        <Progress.Label>
                                            <Text c="white" fw={700} fz="sm" className={styles.progressLabel}>
                                                {unverified_chipped_in.toFixed(2)} CZK
                                            </Text>
                                        </Progress.Label>
                                    </Progress.Section>
                                </Tooltip>

                                <Tooltip withArrow label="Chips I have received the money for.">
                                    <Progress.Section
                                        value={(verified_chipped_in / object.total_price) * 100}
                                        color="green"
                                        animated={verified_chipped_in < object.total_price}
                                    >
                                        <Progress.Label>
                                            <Text c="white" fw={700} fz="sm" className={styles.progressLabel}>
                                                {verified_chipped_in.toFixed(2)} CZK
                                            </Text>
                                        </Progress.Label>
                                    </Progress.Section>
                                </Tooltip>
                                <Tooltip withArrow label="How much is left to reach the goal.">
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
                                </Tooltip>
                            </Progress.Root>
                            <div className={styles.imageHeader}>
                                {session?.user.role === "Admin" && (
                                    <ActionIcon
                                        variant="transparent"
                                        style={{ zIndex: 10 }}
                                        pos={"absolute"}
                                        top={10}
                                        right={10}
                                        onClick={openEdit}
                                    >
                                        <IconPencil />
                                    </ActionIcon>
                                )}
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

                            <Text
                                mb={"xl"}
                                dangerouslySetInnerHTML={{ __html: object.description.replace("\n", "<br/>") }}
                            />

                            <Divider />
                            <Text ml={"auto"} mr={0} opacity={0.25} size="sm">
                                Created on: {new Date(object.createdAt).toLocaleDateString()}
                            </Text>
                        </Flex>

                        {object.finished ? (
                            <div className={styles.header}>
                                <Center>
                                    <Text size="xl" fw={"bold"}>
                                        This object is finished. You can chip no more.
                                    </Text>
                                </Center>
                            </div>
                        ) : !session?.user ? (
                            <Button
                                fullWidth
                                leftSection={<IconBrandDiscord />}
                                size="xl"
                                onClick={() => void signIn("discord")}
                            >
                                Sign in to chip in!
                            </Button>
                        ) : object.chips.some(
                              (chip) => chip.chippedInByUserId === (session?.user as unknown as AdapterUser)?.id,
                          ) ? (
                            <Tooltip label={"You have already chipped into this object."}>
                                <Button fullWidth variant="light" size="xl" disabled>
                                    Chip in
                                </Button>
                            </Tooltip>
                        ) : (
                            <Button fullWidth leftSection={<IconCoins />} bg={"green"} size="xl" onClick={openChipIn}>
                                Chip in
                            </Button>
                        )}
                        {!object.finished && session?.user && (
                            <>
                                <Divider />
                                <Center>
                                    <Group>
                                        <Button
                                            w={"min-content"}
                                            leftSection={<IconBrandPaypalFilled />}
                                            bg={"#003087"}
                                            component={Link}
                                            href={"https://paypal.me/antoninvondrovic"}
                                            target="_blank"
                                            size="md"
                                        >
                                            PayPal
                                        </Button>
                                        <Button
                                            w={"min-content"}
                                            leftSection={<IconBrandRevolut />}
                                            bg={"#7F84F6"}
                                            component={Link}
                                            href={"https://revolut.me/antoninvondrovic"}
                                            target="_blank"
                                            size="md"
                                        >
                                            Revolut
                                        </Button>
                                    </Group>
                                </Center>
                            </>
                        )}

                        <Divider />
                        {object.chips?.map((chip, index) => (
                            <ChipCard key={index} object_id={object.id} chip={chip} />
                        ))}
                        {object.chips.length === 0 && (
                            <div className={styles.noChips}>
                                <Text>No chips in yet :v</Text>
                            </div>
                        )}
                        <Divider />
                        <Flex w={"100%"} align={"end"} direction={"column"} mb={"lg"}>
                            <Text>Total price: {object.total_price} CZK</Text>
                            <Text style={{ marginLeft: 16 }}>
                                Total chipped in: {verified_chipped_in.toFixed(2)} CZK
                            </Text>
                        </Flex>
                    </Flex>
                </Container>
            </Flex>
            <Modal opened={openedEdit} onClose={closeEdit} size="lg" withCloseButton={false} centered>
                <ObjectForm mutate={updateObject} uploadImage={uploadImage} object={object} onSuccess={closeEdit} />
            </Modal>
            <Modal opened={openedChipIn} onClose={closeChipIn} withCloseButton={false} size={"lg"} centered>
                <Text fw={"bold"} size="lg">
                    How does chipping in work?
                </Text>
                <Divider mb={"sm"} />
                <Text>Right now you put in how much money you are willing to give.</Text>
                <Text>Your chip will get put as unverified until you send money via PayPal etc.</Text>
                <br />
                <Text fw={"bold"} size="lg">
                    When do I send the money?
                </Text>
                <Divider mb={"sm"} />
                <Text>You either send it right now or when the object goal gets reached.</Text>
                <Text>Once I receive the money, I will verify your chip.</Text>
                <br />
                <Divider mb={"xs"} />
                <Text fw={"bold"} ta={"center"}>
                    As always I&apos;ll pay the remaining amount if the goal is not fully reached.
                    <br />
                    Thank you for your help!
                </Text>
                <br />
                <CreateChipForm object={object} onSuccess={closeChipIn} />
            </Modal>
        </>
    );
}
