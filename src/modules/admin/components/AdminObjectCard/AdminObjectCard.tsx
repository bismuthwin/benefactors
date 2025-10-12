"use client";

import { Button, Group, Image, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useDeleteObject } from "~/modules/app";
import { useConfirmModal } from "~/modules/system";
import type { ObjectResponse } from "~/types/ObjectResponse";

import styles from "./AdminObjectCard.module.scss";

interface AdminObjectCardProps {
    object: ObjectResponse;
}

export function AdminObjectCard({ object }: AdminObjectCardProps) {
    const [opened, { open, close }] = useDisclosure(false);

    const { mutate } = useDeleteObject();

    const total_chipped_in = object.chips
        .filter((x) => x.verified)
        .reduce((acc, chip) => acc + Number(chip.czk_amount), 0);

    const { openConfirmModal } = useConfirmModal({
        title: `Delete object "${object.name}"`,
        message: "Are you sure you want to delete this object? This action cannot be undone.",
    });

    const confirmDelete = () => {
        openConfirmModal({
            onConfirm: () => void mutate(object.id),
        });
    };

    return (
        <>
            <div className={styles.card} key={object.id} onClick={open}>
                {object.imageUrl && (
                    <Image src={object.imageUrl} alt="" className={styles.image} width={512} height={512} />
                )}
                <Text className={styles.name}>{object.name}</Text>
            </div>
            <Modal opened={opened} onClose={close} size="lg" withCloseButton={false} centered>
                {object.imageUrl && (
                    <Image src={object.imageUrl} alt="" className={styles.image} width={512} height={512} />
                )}
                <Text className={styles.name}>{object.name}</Text>
                <Text className={styles.price_czk}>{object.total_price} CZK</Text>
                <Text className={styles.progress}>{object.chips.length} chips</Text>
                <Text className={styles.progress}>
                    {total_chipped_in} CZK / {object.total_price} CZK chipped in
                </Text>
                <Text className={styles.description}>{object.description}</Text>

                <Group gap="xs" grow>
                    <Button fullWidth mt="md" color={"orange"}>
                        Edit Object (wip)
                    </Button>
                    <Button mt="md" color={"red"} onClick={confirmDelete}>
                        Delete Object
                    </Button>
                </Group>
            </Modal>
        </>
    );
}
