"use client";

import { ActionIcon, Button, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDotsVertical } from "@tabler/icons-react";
import { useAdminVerifyChip, useConfirmModal, useDeleteChip } from "~/modules";
import { PunchableAvatar } from "~/modules/users/components/PunchableAvatar";
import type { ChipResponse } from "~/types/ChipResponse";
import { useSession } from "next-auth/react";

import styles from "./ChipCard.module.scss";

interface ChipCardProps {
    object_id: string;
    chip: ChipResponse;
}

export function ChipCard({ object_id, chip }: ChipCardProps) {
    const { data: session } = useSession({ required: false });
    const [opened, { open, close }] = useDisclosure(false);
    const { mutate: toggleVerification } = useAdminVerifyChip({ object_id: object_id, chip_id: chip.id });
    const { mutate: deleteChip } = useDeleteChip({ object_id: object_id });

    const { openConfirmModal } = useConfirmModal({
        title: `Delete chip from "${chip.chippedInByUser.name}"`,
        message: "Are you sure you want to delete this chip? This action cannot be undone.",
    });

    const confirmDelete = () => {
        openConfirmModal({
            onConfirm: () => {
                void deleteChip(chip.id);
                close();
            },
        });
    };

    return (
        <>
            <div className={styles.chip}>
                {!chip.verified && (
                    <div className={styles.unverifiedOverlay}>
                        <p>😱 UNVERIFIED PAYMENT 😱</p>
                    </div>
                )}
                <PunchableAvatar src={chip.chippedInByUser.image ?? ""} particles={false} />
                <Text className={styles.name}>{chip.chippedInByUser.name}</Text>
                <Text className={styles.price_czk}>{Number(chip.czk_amount).toFixed(2)} CZK</Text>
                {session?.user.role === "Admin" && (
                    <ActionIcon variant="transparent" style={{ zIndex: 10 }} onClick={open}>
                        <IconDotsVertical />
                    </ActionIcon>
                )}
            </div>
            <Modal opened={opened} onClose={close} title="Chip details" centered>
                <Text>
                    Chipped in by: <b>{chip.chippedInByUser.name}</b>
                </Text>
                <Text>
                    Amount: <b>{Number(chip.czk_amount).toFixed(2)} CZK</b>
                </Text>
                <Text>
                    Verified: <b>{chip.verified ? "Yes" : "No"}</b>
                </Text>
                {chip.verified && chip.verifiedAt && (
                    <Text>
                        Verified at: <b>{new Date(chip.verifiedAt).toLocaleString()}</b>
                    </Text>
                )}
                {chip.verified && chip.verifiedByUser && (
                    <Text>
                        Verified by: <b>{chip.verifiedByUser.name}</b>
                    </Text>
                )}
                <Button
                    fullWidth
                    mt="md"
                    onClick={() => {
                        toggleVerification(chip.id);
                        close();
                    }}
                >
                    Toggle Verification
                </Button>
                <Button
                    color="red"
                    fullWidth
                    mt="md"
                    onClick={() => {
                        confirmDelete();
                    }}
                >
                    Delete chip
                </Button>
            </Modal>
        </>
    );
}
