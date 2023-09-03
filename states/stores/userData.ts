import { AxiosError } from "axios";
import useStore from "swr-global-state";
import axios from "@/lib/api";
import localStoragePersistor from "../persistors/local-storage";
import { DFriendData, DRoomData, RoomData } from "@/lib/types";

export const TOKEN_KEY = "@user/token";
const AUTH_KEY = "@user/auth";
const ROOM_KEY = "@user/room";
const FRIEND_KEY = "@user/friend";

export function useAuth() {
    const [isLoading, setLoading] = useStore({
        key: `${AUTH_KEY}-loading`,
        initial: true,
    });
    const [data, , swrDefaultResponse] = useStore({
        key: AUTH_KEY,
        initial: null,
        persistor: {
            onSet: localStoragePersistor.onSet,
            onGet: async (key) => {
                try {
                    const tokenData = localStoragePersistor.onGet(TOKEN_KEY);

                    if (!tokenData) {
                        return {
                            isLoggedIn: false,
                            user_info: null,
                        };
                    }

                    // 유저 정보 확인요청
                    const response = await axios.get("/user/my", {
                        headers: {
                            Authorization: tokenData.access_token,
                        },
                    });

                    const userData = {
                        isLoggedIn: true,
                        user_info: response.data.user_info,
                    };

                    localStoragePersistor.onSet(key, userData);

                    return userData;
                } catch (err: unknown) {
                    console.error(err);
                    if (window.navigator.onLine) {
                        if (err instanceof AxiosError) {
                            if (err.response?.status === 401) {
                                const errorObj = new Error(
                                    "올바른 접속이 아님으로 로그아웃됩니다.."
                                );
                                errorObj.name = "InvalidUserData";
                                throw errorObj;
                            }
                        }
                    }
                    const cachedData = localStoragePersistor.onGet(key);
                    return cachedData;
                } finally {
                    setLoading(false);
                }
            },
        },
    });

    const { mutate: loginMutate, error: loginError } = swrDefaultResponse;

    const login = async ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => {
        try {
            setLoading(true);
            // 로그인 요청
            const authData = await axios.post("/user/login", {
                email,
                password,
            });

            // window.localStorage.setItem(
            //     TOKEN_KEY,
            //     JSON.stringify(authData.data)
            // );
            localStoragePersistor.onSet(TOKEN_KEY, authData.data);

            loginMutate();
            setLoading(false);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                alert(error.response?.data.message);
            }
        }
    };

    const logout = async () => {
        setLoading(true);
        window.localStorage.removeItem(AUTH_KEY);
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(ROOM_KEY);

        loginMutate({
            isLoggedIn: false,
            user_info: null,
        });
        setLoading(false);
    };

    return {
        data,
        loginError,
        isLoading,
        login,
        logout,
    };
}

export function useRoom() {
    const [isLoading, setLoading] = useStore({
        key: `${ROOM_KEY}-loading`,
        initial: true,
    });
    const [data, , swrDefaultResponse] = useStore<RoomData[] | null, any>({
        key: ROOM_KEY,
        initial: null,
        persistor: {
            onSet: localStoragePersistor.onSet,
            onGet: async (key) => {
                try {
                    const tokenData = localStoragePersistor.onGet(TOKEN_KEY);
                    const userInfoData = localStoragePersistor.onGet(AUTH_KEY);

                    if (!tokenData || !userInfoData) throw new Error();

                    const response = await axios.get(
                        `/user/${userInfoData.user_info.id}/roomlist`,
                        {
                            headers: {
                                Authorization: tokenData.access_token,
                            },
                        }
                    );

                    const roomlist: RoomData[] = response.data.roomlist.map(
                        (roomData: DRoomData) => {
                            const userlist = roomData.userlist.map((data) => ({
                                id: data.id,
                                name: data.name,
                            }));
                            return { ...roomData, userlist };
                        }
                    );

                    return roomlist;
                } catch (error: unknown) {
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

    const { mutate: roomListMutate, error } = swrDefaultResponse;

    const createRoom = async ({
        userlist,
        title,
    }: {
        userlist: number[];
        title: string;
    }) => {
        setLoading(true);

        const tokenData = localStoragePersistor.onGet(TOKEN_KEY);

        await axios.post(
            "/room",
            { userlist, title },
            {
                headers: {
                    Authorization: tokenData.access_token,
                },
            }
        );

        roomListMutate();
        setLoading(false);
    };

    const exitRoom = async (id: number) => {
        setLoading(true);

        const tokenData = localStoragePersistor.onGet(TOKEN_KEY);
        const userInfoData = localStoragePersistor.onGet(AUTH_KEY);

        await axios.delete(`/user/${userInfoData.user_info.id}/room`, {
            headers: {
                Authorization: tokenData.access_token,
            },
            data: {
                delete_user_room_id: id,
            },
        });

        roomListMutate();

        setLoading(false);
    };

    return {
        data,
        isLoading,
        error,
        createRoom,
        exitRoom,
    };
}

export function useFriend() {
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
                    const userInfoData = localStoragePersistor.onGet(AUTH_KEY);

                    if (!tokenData || !userInfoData) throw new Error();

                    const response = await axios.get(
                        `/user/${userInfoData.user_info.id}/friendlist`,
                        {
                            headers: {
                                Authorization: tokenData.access_token,
                            },
                        }
                    );

                    return response.data.friendlist;
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

        await axios.post(
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

    return {
        data,
        isLoading,
        error,
        inviteMemberToRoom,
    };
}
