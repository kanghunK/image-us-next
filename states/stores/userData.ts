import { AxiosError } from "axios";
import useStore from "swr-global-state";
import axios from "@/lib/api";
import localStoragePersistor from "../persistors/local-storage";
import { DRoomData, RoomData } from "@/lib/types";

const AUTH_KEY = "@user/auth";
const TOKEN_KEY = "@user/token";
const ROOM_KEY = "@user/room";

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
                        console.log("get 확인");
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
                            const errorObj = new Error(
                                "사용자 정보가 일치하지 않아 로그아웃됩니다."
                            );
                            errorObj.name = "InvalidUserData";
                            throw errorObj;
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

            window.localStorage.setItem(
                TOKEN_KEY,
                JSON.stringify(authData.data)
            );
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

                    localStoragePersistor.onSet(key, roomlist);

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
                    const cachedData = localStoragePersistor.onGet(key);
                    return cachedData;
                } finally {
                    setLoading(false);
                }
            },
        },
    });

    const { error } = swrDefaultResponse;

    return {
        data,
        isLoading,
        error,
    };
}
