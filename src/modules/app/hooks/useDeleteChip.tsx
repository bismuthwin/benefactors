"use client";

import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseDeleteChipParams {
    object_id: string;
}

export function useDeleteChip({ object_id }: UseDeleteChipParams) {
    const queryClient = useQueryClient();
    const { mutate, isPending: isLoading } = useMutation<void, Error, string>({
        mutationFn: async (chip_id: string) => {
            const response = await fetch(`/api/chips`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ chip_id }),
            });

            if (!response.ok) {
                notifications.show({
                    title: "Error",
                    message: `Failed to delete chip: ${response.statusText}`,
                    color: "red",
                });
                throw new Error(`Failed to delete chip: ${response.statusText}`);
            } else {
                notifications.show({
                    title: "Chip deleted successfully!",
                    message: `Chip deleted.`,
                    color: "green",
                });
                await queryClient.invalidateQueries({ queryKey: ["chip", chip_id] });
                await queryClient.invalidateQueries({ queryKey: ["object", object_id] });
                await queryClient.invalidateQueries({ queryKey: ["objects"] });
            }
        },
    });

    return {
        mutate,
        isLoading,
    };
}
