"use client";

import { use } from "react";
import type { AdapterUser } from "@auth/core/adapters";
import {
    ActionIcon,
    Button,
    Center,
    Container,
    Divider,
    Flex,
    Image,
    Modal,
    Progress,
    Text,
    Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import {
    ChipCard,
    CreateChipForm,
    DiscordLoginOverlay,
    LoadOverlay,
    ObjectForm,
    useObject,
    useUpdateObject,
    useUploadImage,
} from "~/modules";
import { useSession } from "next-auth/react";

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

    if (session == null) return <DiscordLoginOverlay />;

    if (object == null) return <Text>Object not found</Text>;

    const total_chipped_in = object.chips
        .filter((x) => x.verified)
        .reduce((acc, chip) => acc + Number(chip.czk_amount), 0);

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
                        ) : object.chips.some(
                              (chip) => chip.chippedInByUserId === (session?.user as unknown as AdapterUser).id,
                          ) ? (
                            <Tooltip label={"You have already chipped into this object."}>
                                <Button fullWidth variant="light" size="xl" disabled>
                                    Chip in
                                </Button>
                            </Tooltip>
                        ) : (
                            <Button fullWidth variant="light" size="xl" onClick={openChipIn}>
                                Chip in
                            </Button>
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
                            <Text style={{ marginLeft: 16 }}>Total chipped in: {total_chipped_in.toFixed(2)} CZK</Text>
                        </Flex>
                    </Flex>
                </Container>
            </Flex>
            <Modal opened={openedEdit} onClose={closeEdit} size="lg" withCloseButton={false} centered>
                <ObjectForm mutate={updateObject} uploadImage={uploadImage} object={object} onSuccess={closeEdit} />
            </Modal>
            <Modal
                opened={openedChipIn}
                onClose={closeChipIn}
                withCloseButton={false}
                title={"How much do you want to give?"}
                centered
            >
                <CreateChipForm object={object} onSuccess={closeChipIn} />
            </Modal>
        </>
    );
}
