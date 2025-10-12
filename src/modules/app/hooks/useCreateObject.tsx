"use client";

import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ObjectFormModel } from "~/types/ObjectFormModel";

export function useCreateObject() {
    const queryClient = useQueryClient();
    const { mutate, isPending: isLoading } = useMutation<void, Error, ObjectFormModel>({
        mutationFn: async (object: ObjectFormModel) => {
            const response = await fetch(`/api/objects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...object }),
            });

            if (!response.ok) {
                notifications.show({
                    title: "Error",
                    message: `Failed to create object: ${response.statusText}`,
                    color: "red",
                });
                throw new Error(`Failed to create object: ${response.statusText}`);
            } else {
                notifications.show({
                    title: "Object created successfully!",
                    message: `Object '${object.name}' created.`,
                    color: "green",
                });
                await queryClient.invalidateQueries({ queryKey: ["objects"] });
            }
        },
    });

    return {
        mutate,
        isLoading,
    };
}
