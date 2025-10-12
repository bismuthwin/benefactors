import { Button, Menu, NumberInput, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconServerSpark } from "@tabler/icons-react";
import { useCreateObject } from "~/modules/app";
import type { ObjectFormModel } from "~/types/ObjectFormModel";

interface CreateObjectModalMenuItemProps {
    iconSize?: number;
}

export function CreateObjectModalMenuItem({ iconSize = 24 }: CreateObjectModalMenuItemProps) {
    const form = useForm<ObjectFormModel>({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            description: "",
            imageUrl: "",
            total_price: 0,
        },
    });

    const { mutate } = useCreateObject();

    return (
        <Menu.Item
            leftSection={<IconServerSpark size={iconSize} />}
            onClick={() =>
                modals.open({
                    title: "Create new object",
                    size: "lg",
                    centered: true,
                    children: (
                        <form
                            onSubmit={form.onSubmit((values) => {
                                modals.closeAll();
                                mutate(values);
                            })}
                        >
                            <TextInput
                                required
                                label="Name"
                                placeholder="Name of the object"
                                {...form.getInputProps("name")}
                            />
                            <Textarea
                                required
                                label="Description"
                                placeholder="Description of the object"
                                {...form.getInputProps("description")}
                            />
                            <TextInput
                                label="Image URL"
                                placeholder="URL of the image"
                                {...form.getInputProps("imageUrl")}
                            />
                            <NumberInput
                                required
                                label="Total Price (In CZK)"
                                placeholder="Total price in CZK"
                                {...form.getInputProps("total_price")}
                            />
                            <Button type="submit" mt="md" fullWidth>
                                Create
                            </Button>
                        </form>
                    ),
                })
            }
        >
            New Object
        </Menu.Item>
    );
}
