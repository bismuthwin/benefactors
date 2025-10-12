"use client";

import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseAdminVerifyChipProps {
    object_id: string;
    chip_id: string;
}

export function useAdminVerifyChip({ object_id, chip_id }: UseAdminVerifyChipProps) {
    const queryClient = useQueryClient();
    const { mutate, isPending: isLoading } = useMutation<void, Error, string>({
        mutationFn: async () => {
            const response = await fetch(`/api/chips/${chip_id}/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                notifications.show({
                    title: "Error",
                    message: `Failed to verify chip: ${response.statusText}`,
                    color: "red",
                });
                throw new Error(`Failed to verify chip: ${response.statusText}`);
            } else {
                notifications.show({
                    title: "Success!",
                    message: "Chip successfully verified",
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
