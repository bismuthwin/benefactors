"use client";

import { useQuery } from "@tanstack/react-query";
import type { ChipResponse } from "~/types/ChipResponse";

export function useChips() {
    const { data, isLoading } = useQuery<ChipResponse[]>({
        queryKey: ["chips"],
        queryFn: () => {
            return fetch(`/api/chips`).then((res) => res.json());
        },
    });

    return {
        data,
        isLoading,
    };
}
