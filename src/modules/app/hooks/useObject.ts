"use client";

import { useQuery } from "@tanstack/react-query";
import type { ObjectResponse } from "~/types/ObjectResponse";

interface UseObjectProps {
    id: string;
}

export function useObject({ id }: UseObjectProps) {
    const { data, isLoading } = useQuery<ObjectResponse>({
        queryKey: ["object", id],
        queryFn: () => {
            return fetch(`/api/objects/${id}`).then((res) => res.json());
        },
    });

    return {
        data,
        isLoading,
    };
}
