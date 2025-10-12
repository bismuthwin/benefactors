"use client";

import { Text } from "@mantine/core";
import { PunchableAvatar } from "~/modules/users/components/PunchableAvatar";
import type { ChipResponse } from "~/types/ChipResponse";

import styles from "./ChipCard.module.scss";

interface ChipCardProps {
    chip: ChipResponse;
}

export function ChipCard({ chip }: ChipCardProps) {
    return (
        <div className={styles.chip}>
            {!chip.verified && (
                <div className={styles.unverifiedOverlay}>
                    <p>UNVERIFIED PAYMENT</p>
                </div>
            )}
            <PunchableAvatar src={chip.chippedInByUser.image ?? ""} particles={false} />
            <Text className={styles.name}>{chip.chippedInByUser.name}</Text>
            <Text className={styles.price_czk}>{chip.czk_amount} CZK</Text>
        </div>
    );
}
