"use client";

import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ChipFormModel } from "~/types/ChipFormModel";

export function useAdminCreateChip() {
    const queryClient = useQueryClient();
    const { mutate, isPending: isLoading } = useMutation<void, Error, ChipFormModel>({
        mutationFn: async (chip: ChipFormModel) => {
            const response = await fetch(`/api/chips`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...chip }),
            });

            if (!response.ok) {
                notifications.show({
                    title: "Error",
                    message: `Failed to tip: ${response.statusText}`,
                    color: "red",
                });
                throw new Error(`Failed to create tip: ${response.statusText}`);
            } else {
                notifications.show({
                    title: "Success!",
                    message: "Tipped successfully",
                    color: "green",
                });
                await queryClient.invalidateQueries({ queryKey: ["chip"] });
                await queryClient.invalidateQueries({ queryKey: ["object", chip.object_id] });
                await queryClient.invalidateQueries({ queryKey: ["objects"] });
            }
        },
    });

    return {
        mutate,
        isLoading,
    };
}
