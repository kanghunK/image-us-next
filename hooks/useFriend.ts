import { AxiosError } from "axios";
import useStore from "swr-global-state";
import { DFriendData } from "@/lib/types";
import localStoragePersistor from "@/states/persistors/local-storage";
import {
    FRIEND_KEY,
    TOKEN_KEY,
    USERDATA_KEY,
    useUserData,
} from "@/states/stores/userData";
import customAxios from "@/lib/api";
import {
    NetworkError,
    alertErrorMessage,
    unknownError,
} from "@/lib/exceptions";
import { getToken } from "@/utils/getToken";

export function useFriend() {
    const [userData, setUserData] = useUserData();

    const [isLoading, setLoading] = useStore({
        key: `${FRIEND_KEY}-loading`,
        initial: true,
    });
    const [data, , swrDefaultResponse] = useStore<DFriendData[] | null, any>({
        key: FRIEND_KEY,
        initial: null,
        persistor: {
            onSet: localStoragePersistor.onSet,
            onGet: async (key) => {
                try {
                    const tokenData = await getToken();
                    const userInfoData =
                        localStoragePersistor.onGet(USERDATA_KEY);

                    const response = await customAxios.get(
                        `/user/${userInfoData.user_info.id}/friendlist`,
                        {
                            headers: {
                                Authorization: tokenData.access_token,
                            },
                        }
                    );

                    const friendList: DFriendData[] = response.data.friendlist;
                    setUserData((prev) => ({
                        ...prev,
                        friends: [...friendList],
                    }));

                    return friendList;
                } catch (err: unknown) {
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
                } finally {
                    setLoading(false);
                }
            },
        },
    });

    const { mutate: friendDataMutate, error } = swrDefaultResponse;

    const addFriend = async (friendId: number) => {
        try {
            setLoading(true);

            const tokenData = await getToken();
            const userId = userData?.user_info?.id;

            await customAxios.post(
                `/user/${userId}/friend`,
                { friend_user_id: friendId },
                {
                    headers: {
                        Authorization: tokenData.access_token,
                    },
                }
            );

            friendDataMutate();

            setLoading(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 401 || error.status === 403) {
                    throw new alertErrorMessage(
                        "올바른 요청이 아닙니다..다시시도 해주세요!"
                    );
                } else if (error.status === 402) {
                    throw new alertErrorMessage("이미 등록된 유저입니다.");
                } else if (error.status === 404) {
                    throw new alertErrorMessage(
                        "해당 유저가 존재하지 않습니다..관리자에게 문의하세요!"
                    );
                }
                throw new unknownError();
            } else {
                throw new unknownError();
            }
        }
    };

    const deleteMember = async (friendId: number) => {
        try {
            setLoading(true);

            const tokenData = await getToken();
            const userId = userData?.user_info?.id;

            await customAxios.delete(`/user/${userId}/friend`, {
                headers: {
                    Authorization: tokenData.access_token,
                },
                data: {
                    delete_friend_user_id: friendId,
                },
            });

            await friendDataMutate();

            setLoading(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 401 || error.status === 403) {
                    throw new alertErrorMessage(
                        "올바른 요청이 아닙니다..다시시도 해주세요!"
                    );
                } else if (error.status === 404) {
                    throw new alertErrorMessage(
                        "해당 유저가 존재하지 않습니다..관리자에게 문의하세요!"
                    );
                }
                throw new unknownError();
            } else {
                throw new unknownError();
            }
        }
    };

    return {
        data,
        isLoading,
        error,
        addFriend,
        deleteMember,
    };
}
