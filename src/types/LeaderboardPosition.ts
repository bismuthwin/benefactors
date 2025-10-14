import type { User } from "@prisma/client";

export interface LeaderboardPosition {
    user: User;
    totalCzkAmount: number;
}
