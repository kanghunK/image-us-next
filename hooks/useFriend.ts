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
    const [, setUserData] = useUserData();
    const token = localStoragePersistor.onGet(TOKEN_KEY);
    // const [token] = useToken();

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

    const inviteMemberToRoom = async (
        roomId: string,
        inviteMemberlist: number[]
    ) => {
        setLoading(true);

        const tokenData = localStoragePersistor.onGet(TOKEN_KEY);

        await customAxios.post(
            `/room/${roomId}/user`,
            {
                invite_userlist: inviteMemberlist,
            },
            {
                headers: {
                    Authorization: tokenData.access_token,
                },
            }
        );

        friendDataMutate();

        setLoading(false);
    };

    const deleteMember = async () => {
        try {
        } catch (error) {}
    };

    return {
        data,
        isLoading,
        error,
        inviteMemberToRoom,
    };
}
