"use client";

import { AxiosError } from "axios";
import useStore, { createStore } from "swr-global-state";
import axios from "@/lib/api";
import localStoragePersistor from "../persistors/local-storage";
import {
    DFriendData,
    DRoomData,
    RoomData,
    TokenData,
    UserData,
    UserInfo,
} from "@/lib/types";
import customAxios from "@/lib/api";

export const TOKEN_KEY = "@user/token";
const USERDATA_KEY = "@user/info";
const ROOM_KEY = "@user/room";
const FRIEND_KEY = "@user/friend";

export const useToken = createStore<TokenData | null>({
    key: TOKEN_KEY,
    initial: null,
    persistor: localStoragePersistor,
});

export const useUserData = createStore<UserData | null>({
    key: USERDATA_KEY,
    initial: null,
    persistor: localStoragePersistor,
});

export function useAuth() {
    const [userData, setUserData] = useUserData();
    const [token, setToken] = useToken();

    const [isLoading, setLoading] = useStore({
        key: `${USERDATA_KEY}-loading`,
        initial: true,
    });
    const [authData, , swrDefaultResponse] = useStore<UserInfo | null>({
        key: "useAuth",
        initial: null,
        persistor: {
            onSet: localStoragePersistor.onSet,
            onGet: async (key) => {
                try {
                    if (!token) {
                        return {
                            isLoggedIn: false,
                            user_info: null,
                        };
                    }

                    // 유저 정보 확인요청
                    const response = await axios.get("/user/my", {
                        headers: {
                            Authorization: token.access_token,
                        },
                    });

                    const userInfo = response.data.user_info;

                    const authData = {
                        isLoggedIn: true,
                        user_info: userInfo,
                    };

                    // 전역 상태 관리
                    setUserData((prev) => ({ ...prev, ...authData }));

                    return authData;
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
                            } else {
                                const errorObj = new Error(
                                    "사용자 인증에 실패했습니다..다시 로그인 해주세요.."
                                );
                                errorObj.name = "AuthFailed";
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
            const tokenData = await axios.post("/user/login", {
                email,
                password,
            });

            await setToken(tokenData.data);

            await loginMutate();
            setLoading(false);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                alert(error.response?.data.message);
            }
        }
    };

    const logout = async () => {
        setLoading(true);

        window.localStorage.removeItem(USERDATA_KEY);
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(ROOM_KEY);
        window.localStorage.removeItem(FRIEND_KEY);

        await setToken(null);
        await loginMutate();
        setLoading(false);
    };

    const changeName = async (changeName: string) => {
        try {
            if (!token) throw new Error();

            await customAxios.post(
                `/user/my`,
                {
                    name: changeName,
                },
                {
                    headers: {
                        Authorization: token.access_token,
                    },
                }
            );
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    const errorObj = new Error(
                        "올바른 접속이 아님으로 로그아웃됩니다.."
                    );
                    errorObj.name = "InvalidUserData";
                    throw errorObj;
                } else {
                    const errorObj = new Error(
                        "서버 오류로 변경하지 못하였습니다! 다시 시도해주세요.."
                    );
                    errorObj.name = "ServerError";
                    throw errorObj;
                }
            } else {
                const errorObj = new Error(
                    "유효한 토큰이 없습니다! 다시 로그인 해주세요.."
                );
                errorObj.name = "NoToken";
                throw errorObj;
            }
        }
    };

    return {
        authData,
        loginError,
        isLoading,
        login,
        logout,
        changeName,
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
                    const userInfoData =
                        localStoragePersistor.onGet(USERDATA_KEY);

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
        const userInfoData = localStoragePersistor.onGet(USERDATA_KEY);

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
                    const userInfoData =
                        localStoragePersistor.onGet(USERDATA_KEY);

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
