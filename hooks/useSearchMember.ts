import useSWR from "swr";
import customAxios from "@/lib/api";
import { DFriendData } from "@/lib/types";
import { AxiosError } from "axios";
import {
    NetworkError,
    alertErrorMessage,
    unknownError,
} from "@/lib/exceptions";

const searchFetcher = async (url: string) => {
    try {
        const res = await customAxios.get(url);
        const resultData: DFriendData[] = res.data.result;
        const searchData = resultData.slice(0, 5);

        return [...searchData];
    } catch (error) {
        if (window.navigator.onLine) {
            if (error instanceof AxiosError) {
                if (error.status === 401 || error.status === 403) {
                    throw new alertErrorMessage(
                        "올바른 요청이 아닙니다..다시시도 해주세요!"
                    );
                }
            } else {
                throw new unknownError();
            }
        }
        throw new NetworkError();
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
