import type { User } from "@prisma/client";

export interface ChipResponse {
    id: string;
    czk_amount: number;
    chippedInByUserId: string;
    chippedInByUser: User;
    verified: boolean;
    verifiedAt?: Date;
    verifiedByUserId?: string;
    verifiedByUser?: User;
}
