"use client";

import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ObjectFormModel } from "~/types/ObjectFormModel";

interface UseUpdateObjectProps {
    object_id: string;
}

export function useUpdateObject({ object_id }: UseUpdateObjectProps) {
    const queryClient = useQueryClient();
    const { mutate, isPending: isLoading } = useMutation<void, Error, ObjectFormModel>({
        mutationFn: async (object: ObjectFormModel) => {
            const response = await fetch(`/api/objects/${object_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...object }),
            });

            if (!response.ok) {
                notifications.show({
                    title: "Error",
                    message: `Failed to update object: ${response.statusText}`,
                    color: "red",
                });
                throw new Error(`Failed to update object: ${response.statusText}`);
            } else {
                notifications.show({
                    title: "Object updated successfully!",
                    message: `Object '${object.name}' updated.`,
                    color: "green",
                });
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
