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
                    const tokenData = localStoragePersistor.onGet(TOKEN_KEY);
                    const userInfoData =
                        localStoragePersistor.onGet(USERDATA_KEY);

                    if (!tokenData || !userInfoData) throw new Error();

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
                            if (error.status === 401) {
                                const errorObj = new Error(
                                    "사용자 정보가 없어 로그아웃됩니다."
                                );
                                errorObj.name = "InvalidUserData";
                                throw errorObj;
                            } else if (error.status === 403) {
                                const errorObj = new Error(
                                    "권한을 가진 이용자가 아닙니다.."
                                );
                                errorObj.name = "IncorrectAuth";
                                throw errorObj;
                            }
                        } else {
                            console.error("에러", error);
                            const errorObj = new Error(
                                "사용자 정보가 없습니다! 다시 로그인 해주세요.."
                            );
                            errorObj.name = "NoLocalStorageInfo";
                            throw errorObj;
                        }
                    }
                    const errorObj = new Error(
                        "네트워크에 연결되어있지 않습니다.."
                    );
                    errorObj.name = "NetworkError";
                    throw errorObj;
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

            const tokenData = localStoragePersistor.onGet(TOKEN_KEY);

            if (!tokenData) {
                throw new Error();
            }

            const userId = userData.user_info?.id;

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
                if (error.status === 401) {
                    const errorObj = new Error(
                        "사용자 정보가 없어 로그아웃됩니다."
                    );
                    errorObj.name = "InvalidUserData";
                    throw errorObj;
                } else if (error.status === 402) {
                    const errorObj = new Error("이미 등록된 유저입니다.");
                    errorObj.name = "ReRegistration";
                    throw errorObj;
                } else if (error.status === 403) {
                    const errorObj = new Error("권한이 없습니다...");
                    errorObj.name = "IncorrectAuth";
                    throw errorObj;
                } else if (error.status) {
                    const errorObj = new Error(
                        "해당 유저가 존재하지 않습니다."
                    );
                    errorObj.name = "NotFoundFriend";
                    throw errorObj;
                }
            } else {
                const errorObj = new Error(
                    "사용자 정보가 없습니다! 다시 로그인 해주세요.."
                );
                errorObj.name = "NoLocalStorageInfo";
                throw errorObj;
            }
        }
    };

    const deleteMember = async (friendId: number) => {
        try {
            setLoading(true);

            const tokenData = localStoragePersistor.onGet(TOKEN_KEY);

            if (!tokenData) {
                throw new Error();
            }

            const userId = userData.user_info?.id;

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
                if (error.status === 403) {
                    const errorObj = new Error("권한이 없습니다...");
                    errorObj.name = "IncorrectAuth";
                    throw errorObj;
                } else if (error.status) {
                    const errorObj = new Error(
                        "해당 유저가 존재하지 않습니다."
                    );
                    errorObj.name = "NotFoundFriend";
                    throw errorObj;
                }
            } else {
                const errorObj = new Error(
                    "사용자 정보가 없습니다! 다시 로그인 해주세요.."
                );
                errorObj.name = "NoLocalStorageInfo";
                throw errorObj;
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
