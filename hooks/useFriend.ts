import { AxiosError } from "axios";
import useStore from "swr-global-state";
import { DFriendData } from "@/lib/types";
import localStoragePersistor from "@/states/persistors/local-storage";
import {
    FRIEND_KEY,
    USERDATA_KEY,
    useUserData,
} from "@/states/stores/userData";
import customAxios from "@/lib/api";
import { NetworkError, unknownError } from "@/lib/exceptions";
import { getToken } from "@/utils/getToken";

export function useFriend() {
    const [userData, setUserData] = useUserData();

    const [isLoading, setLoading] = useStore({
        key: `${FRIEND_KEY}-loading`,
        initial: true,
    });
    const [data, , swrDefaultResponse] = useStore<DFriendData[] | null, any>(
        {
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

                        const friendList: DFriendData[] =
                            response.data.friendlist;
                        setUserData((prev) => ({
                            ...prev,
                            friends: [...friendList],
                        }));

                        return friendList;
                    } catch (err: unknown) {
                        if (window.navigator.onLine) {
                            if (error instanceof AxiosError) {
                                if (
                                    error.response?.status === 401 ||
                                    error.response?.status === 403
                                ) {
                                    alert(
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
        },
        {
            revalidateOnReconnect: false,
            revalidateOnFocus: false,
        }
    );

    const { mutate: friendDataMutate, error } = swrDefaultResponse;

    const addFriend = async (friendId: number) => {
        try {
            setLoading(true);

            const tokenData = await getToken();
            const userId = userData?.user_info?.id;

            const response = await customAxios.post(
                `/user/${userId}/friend`,
                { friend_user_id: friendId },
                {
                    headers: {
                        Authorization: tokenData.access_token,
                    },
                }
            );

            if (response.data === "0명 친구 생성 성공") {
                const errorObj = new Error(
                    "자기 자신을 친구로 추가할 수 없습니다..."
                );
                errorObj.name = "AddMyAccount";
                throw errorObj;
            }

            friendDataMutate();
            alert("성공적으로 추가하였습니다!");

            setLoading(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    alert("올바른 요청이 아닙니다..다시시도 해주세요!");
                } else if (error.response?.status === 402) {
                    alert("이미 등록된 유저입니다.");
                } else if (error.response?.status === 404) {
                    alert(
                        "해당 유저가 존재하지 않습니다..관리자에게 문의하세요!"
                    );
                } else {
                    throw new unknownError();
                }
            } else {
                if (error instanceof Error) {
                    if (error.name === "AddMyAccount") alert(error.message);
                } else {
                    throw new unknownError();
                }
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
            alert("성공적으로 친구목록에서 삭제하였습니다!");

            setLoading(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    alert("올바른 요청이 아닙니다..다시시도 해주세요!");
                } else if (error.response?.status === 404) {
                    alert(
                        "해당 유저가 존재하지 않습니다..관리자에게 문의하세요!"
                    );
                }
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
