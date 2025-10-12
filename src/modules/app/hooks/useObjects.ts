"use client";

import { useQuery } from "@tanstack/react-query";
import type { ObjectResponse } from "~/types/ObjectResponse";

export function useObjects() {
    const { data, isLoading } = useQuery<ObjectResponse[]>({
        queryKey: ["objects"],
        queryFn: () => {
            return fetch(`/api/objects`).then((res) => res.json());
        },
    });

    return {
        data,
        isLoading,
    };
}
