"use client";

import { useRouter } from "next/navigation";
import { Image, Progress, Text } from "@mantine/core";
import { Routes } from "~/constants/routes";
import type { ObjectResponse } from "~/types/ObjectResponse";

import styles from "./ObjectCard.module.scss";

interface ObjectCardProps {
    object: ObjectResponse;
}

export function ObjectCard({ object }: ObjectCardProps) {
    const router = useRouter();
    const total_chipped_in = object.chips
        .filter((x) => x.verified)
        .reduce((acc, chip) => acc + Number(chip.czk_amount), 0);

    return (
        <div className={styles.card} onClick={() => router.push(Routes.OBJECT(object.id))}>
            {object.imageUrl && (
                <Image src={object.imageUrl} alt="" className={styles.image} width={512} height={512} />
            )}
            <Text className={styles.name}>{object.name}</Text>
            <Text className={styles.price_czk}>{object.total_price} CZK</Text>
            <Text className={styles.progress}>
                {total_chipped_in} CZK / {object.total_price} CZK chipped in
            </Text>
            <Progress.Root h={"xs"} mt={"auto"} mb={0}>
                <Progress.Section
                    value={(total_chipped_in / object.total_price) * 100}
                    color="green"
                    animated={total_chipped_in < object.total_price}
                ></Progress.Section>
                <Progress.Section
                    value={((object.total_price - total_chipped_in) / object.total_price) * 100}
                    color="black"
                ></Progress.Section>
            </Progress.Root>
        </div>
    );
}
