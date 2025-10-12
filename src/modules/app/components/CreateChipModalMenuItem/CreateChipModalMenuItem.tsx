import {
    Autocomplete,
    Avatar,
    Button,
    Checkbox,
    Group,
    Menu,
    NumberInput,
    Select,
    Text,
    TextInput,
    type AutocompleteProps,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconCoins } from "@tabler/icons-react";
import { useAdminCreateChip, useObjects, useUsers } from "~/modules/app";
import type { ChipFormModel } from "~/types/ChipFormModel";

interface CreateChipModalMenuItemProps {
    iconSize?: number;
}

export function CreateChipModalMenuItem({ iconSize = 24 }: CreateChipModalMenuItemProps) {
    const form = useForm<ChipFormModel>({
        mode: "uncontrolled",
        initialValues: {
            czk_amount: 0,
            object_id: "",
            user_id: undefined,
            name: undefined,
            verified: false,
        },
    });

    const { data: objects } = useObjects();
    const { data: users } = useUsers();
    const { mutate } = useAdminCreateChip();

    if (!objects) return null;

    const renderAutocompleteOption: AutocompleteProps["renderOption"] = ({ option }) => (
        <Group gap="sm">
            <Avatar src={users?.find((u) => u.id.toString() === option.value)?.image} radius="sm" />
            <div>
                <Text size="sm">{option.value}</Text>
                <Text size="xs" opacity={0.5}>
                    {users?.find((u) => u.id.toString() === option.value)?.name ?? "Unknown User"}
                </Text>
            </div>
        </Group>
    );

    return (
        <Menu.Item
            leftSection={<IconCoins size={iconSize} />}
            onClick={() =>
                modals.open({
                    title: "Create new chip-in",
                    size: "lg",
                    centered: true,
                    children: (
                        <form
                            onSubmit={form.onSubmit((values) => {
                                modals.closeAll();
                                mutate(values);
                            })}
                        >
                            <Select
                                required
                                label="Object"
                                placeholder="Select object"
                                searchable
                                data={
                                    objects.map((obj) => ({
                                        value: obj.id.toString(),
                                        label: obj.name,
                                    })) || []
                                }
                                {...form.getInputProps("object_id")}
                            />
                            <Autocomplete
                                required
                                data={users?.map((user) => ({ value: user.id.toString() })) ?? []}
                                label="User (Discord ID)"
                                placeholder="User ID (Discord ID)"
                                renderOption={renderAutocompleteOption}
                                {...form.getInputProps("user_id")}
                            />
                            <TextInput
                                label="Name (use if user does not exist yet)"
                                placeholder="Name"
                                {...form.getInputProps("name")}
                            />
                            <NumberInput
                                required
                                label="Total Price (In CZK)"
                                placeholder="Total price in CZK"
                                {...form.getInputProps("czk_amount")}
                            />
                            <Checkbox
                                mt="md"
                                label="Verified (only check if payment has been made)"
                                {...form.getInputProps("verified", { type: "checkbox" })}
                            />
                            <Button type="submit" mt="md" fullWidth>
                                Create
                            </Button>
                        </form>
                    ),
                })
            }
        >
            New Chip-in
        </Menu.Item>
    );
}
