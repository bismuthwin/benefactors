"use client";

import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteObject() {
    const queryClient = useQueryClient();
    const { mutate, isPending: isLoading } = useMutation<void, Error, string>({
        mutationFn: async (object_id: string) => {
            const response = await fetch(`/api/objects`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ object_id }),
            });

            if (!response.ok) {
                notifications.show({
                    title: "Error",
                    message: `Failed to delete object: ${response.statusText}`,
                    color: "red",
                });
                throw new Error(`Failed to delete object: ${response.statusText}`);
            } else {
                notifications.show({
                    title: "Object deleted successfully!",
                    message: `Object deleted.`,
                    color: "green",
                });
                await queryClient.invalidateQueries({ queryKey: ["chip"] });
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
