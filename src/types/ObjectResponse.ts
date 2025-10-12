import type { ChipResponse } from "./ChipResponse";

export interface ObjectResponse {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    total_price: number;
    createdAt: Date;
    updatedAt: Date;
    chips: ChipResponse[];
}
