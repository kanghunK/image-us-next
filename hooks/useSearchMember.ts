import React from "react";
import useSWR from "swr";
import useStore from "swr-global-state";
import customAxios from "@/lib/api";
import { DFriendData } from "@/lib/types";

const searchFetcher = async (url: string) => {
    try {
        const res = await customAxios.get(url);
        const resultData: DFriendData[] = res.data.result;
        const searchData = resultData.slice(0, 5);

        return [...searchData];
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
};

export default function useSearchMember(queryParams: string) {
    const { data, isLoading, error } = useSWR<DFriendData[]>(
        `/user/search?email=${queryParams}`,
        searchFetcher,
        {
            fallbackData: [],
            revalidateOnFocus: false,
            revalidateOnMount: false,
            revalidateOnReconnect: false,
            keepPreviousData: true,
        }
    );

    return {
        data,
        isLoading,
        error,
    };
}
