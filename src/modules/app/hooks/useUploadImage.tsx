"use client";

import type { FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

interface UploadImageResponse {
    url: string;
}

export function useUploadImage() {
    const {
        mutate,
        mutateAsync,
        isPending: isLoading,
    } = useMutation<string, Error, FileWithPath>({
        mutationFn: async (image: FileWithPath) => {
            const formData = new FormData();
            formData.append("image", image);

            const response = await fetch(`/api/imageUpload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                notifications.show({
                    title: "Error",
                    message: `Failed to upload image: ${response.statusText}`,
                    color: "red",
                });
                throw new Error(`Failed to upload image: ${response.statusText}`);
            }

            const result = (await response.json()) as UploadImageResponse;
            notifications.show({
                title: "Image uploaded successfully!",
                message: `Image uploaded.`,
                color: "green",
            });
            return result.url;
        },
    });

    return {
        mutate,
        mutateAsync,
        isLoading,
    };
}
