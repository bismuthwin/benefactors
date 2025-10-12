import { Button, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCreateChip, useObjects } from "~/modules/app";
import type { ChipFormModel } from "~/types/ChipFormModel";
import type { ObjectResponse } from "~/types/ObjectResponse";

interface CreateChipFormProps {
    object: ObjectResponse;
    onSuccess?: () => void;
}

export function CreateChipForm({ object, onSuccess }: CreateChipFormProps) {
    const form = useForm<ChipFormModel>({
        mode: "uncontrolled",
        initialValues: {
            czk_amount: 0,
            object_id: object.id,
        },
    });

    const { data: objects } = useObjects();
    const { mutate } = useCreateChip();

    if (!objects) return null;

    return (
        <form
            onSubmit={form.onSubmit((values) => {
                mutate(values);
                onSuccess?.();
            })}
        >
            <NumberInput
                required
                label="Total Amount (In CZK)"
                placeholder="Total amount in CZK"
                {...form.getInputProps("czk_amount")}
            />
            <Button type="submit" mt="md" fullWidth>
                Chip in
            </Button>
        </form>
    );
}
