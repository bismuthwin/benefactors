"use client";

import { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
    Group,
    Image,
    InputLabel,
    Menu,
    NumberInput,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, type FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconPhoto, IconServerSpark, IconUpload, IconX } from "@tabler/icons-react";
import { useCreateObject, useUploadImage } from "~/modules/app";
import { LoadOverlay } from "~/modules/system";
import type { ObjectFormModel } from "~/types/ObjectFormModel";
import type { ObjectResponse } from "~/types/ObjectResponse";

import styles from "./CreateObjectModalMenuItem.module.scss";

interface CreateObjectModalMenuItemProps {
    iconSize?: number;
}

export function CreateObjectModalMenuItem({ iconSize = 24 }: CreateObjectModalMenuItemProps) {
    const { mutate } = useCreateObject();
    const { mutateAsync: uploadImage } = useUploadImage();

    const openModal = () => {
        modals.open({
            title: "Create new object",
            size: "lg",
            centered: true,
            children: <ObjectForm mutate={mutate} uploadImage={uploadImage} />,
        });
    };

    return (
        <Menu.Item leftSection={<IconServerSpark size={iconSize} />} onClick={openModal}>
            New Object
        </Menu.Item>
    );
}

interface CreateObjectFormProps {
    mutate: (values: ObjectFormModel) => void;
    uploadImage?: (image: FileWithPath) => Promise<string>;
    object?: ObjectResponse;
    onSuccess?: () => void;
}

export function ObjectForm({ mutate, uploadImage, object, onSuccess }: CreateObjectFormProps) {
    const form = useForm<ObjectFormModel>({
        mode: "uncontrolled",
        initialValues: {
            name: object?.name ?? "",
            description: object?.description ?? "",
            imageUrl: object?.imageUrl ?? "",
            total_price: object?.total_price ?? 0,
            finished: object?.finished ?? false,
            unlisted: object?.unlisted ?? false,
        },
    });

    const [imageFile, setImageFile] = useState<FileWithPath>();
    const [previewUrl, setPreviewUrl] = useState<string>();
    const [uploading, setUploading] = useState(false);

    // Clean up preview URLs when component unmounts
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleDrop = (file?: FileWithPath) => {
        if (!file) return;
        // Clean up old preview URL
        URL.revokeObjectURL(previewUrl ?? "");

        // Create new preview URLs
        const newUrl = URL.createObjectURL(file);
        setPreviewUrl(newUrl);
        setImageFile(file);
    };

    const imagePreview = previewUrl && (
        <Image className={styles.image} src={previewUrl} alt={`Preview`} radius="md" h={200} fit="contain" />
    );

    addEventListener("paste", (event) => {
        if (event.clipboardData) {
            const items = event.clipboardData.items;
            if (!items) return;

            for (const item of items) {
                if (item?.type.includes("image")) {
                    const blob = item.getAsFile();
                    if (blob) {
                        const extension = blob.type.split("/")[1] ?? "png";
                        const fileWithPath = new File([blob], `pasted-image.${extension}`, { type: blob.type });
                        handleDrop(fileWithPath);
                    }
                }
            }
        }
    });

    return (
        <form
            onSubmit={form.onSubmit(async (values) => {
                if (imageFile && uploadImage) {
                    setUploading(true);
                    try {
                        // Create a new File with the sanitized name
                        const sanitizedName =
                            values.name ??
                            ""
                                .trim()
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-");
                        const extension = imageFile.name.split(".").pop() ?? "png";
                        const newFile = new File([imageFile], `${sanitizedName}.${extension}`, {
                            type: imageFile.type,
                        });

                        const url = await uploadImage(newFile);
                        mutate({ ...values, imageUrl: url });
                        modals.closeAll();
                        onSuccess?.();
                    } catch (error) {
                        console.error("Upload failed:", error);
                    } finally {
                        setUploading(false);
                    }
                    return;
                } else {
                    mutate(values);
                    modals.closeAll();
                    onSuccess?.();
                }
            })}
        >
            <LoadOverlay visible={uploading} />
            <TextInput required label="Name" placeholder="Name of the object" {...form.getInputProps("name")} />
            <Textarea
                required
                label="Description"
                placeholder="Description of the object"
                {...form.getInputProps("description")}
            />
            <InputLabel mt="xs">Image (10MB max, uploads to copyparty)</InputLabel>
            <Dropzone
                className={styles.dropzone}
                accept={IMAGE_MIME_TYPE}
                onDrop={(files) => handleDrop(files[0])}
                maxFiles={1}
                maxSize={10 * 1024 ** 2} // 10 MB
                mb={"xs"}
            >
                <Group justify="center" gap="xl" style={{ minHeight: 100, pointerEvents: "none" }}>
                    <Dropzone.Accept>
                        <IconUpload size={52} stroke={1.5} />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX size={52} stroke={1.5} />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <IconPhoto size={52} stroke={1.5} />
                    </Dropzone.Idle>

                    {imageFile == null && (
                        <div>
                            <Text size="xl" inline>
                                Drag image here or click to select
                            </Text>
                            <Text size="sm" c="dimmed" inline mt={7}>
                                Attach an image for this object
                            </Text>
                        </div>
                    )}
                </Group>
                <div className={styles.imagePreview}>{imagePreview}</div>
            </Dropzone>

            <NumberInput
                required
                label="Total Price (In CZK)"
                placeholder="Total price in CZK"
                {...form.getInputProps("total_price")}
            />

            <Checkbox
                mt="md"
                label="Finished"
                description="Mark the object as finished. This will prevent any further chip-ins."
                {...form.getInputProps("finished", { type: "checkbox" })}
            />
            <Checkbox
                mt="md"
                label="Unlisted"
                description="Unlist the object from the main page. It will still be accessible via direct link."
                {...form.getInputProps("unlisted", { type: "checkbox" })}
            />
            <Button type="submit" mt="md" fullWidth>
                {object ? "Update Object" : "Create Object"}
            </Button>
        </form>
    );
}
