"use client";

import type { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useUsers() {
    const { data, isLoading } = useQuery<User[]>({
        queryKey: ["users"],
        queryFn: () => {
            return fetch(`/api/users`).then((res) => res.json());
        },
    });

    return {
        data,
        isLoading,
    };
}
