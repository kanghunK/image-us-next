import { AxiosError } from "axios";
import useStore from "swr-global-state";
import { UserInfo } from "@/lib/types";
import localStoragePersistor from "@/states/persistors/local-storage";
import {
    FRIEND_KEY,
    ROOM_KEY,
    TOKEN_KEY,
    USERDATA_KEY,
    useUserData,
} from "@/states/stores/userData";
import customAxios from "@/lib/api";

export function useAuth() {
    const [, setUserData] = useUserData();

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
                    const token = localStoragePersistor.onGet(TOKEN_KEY);

                    if (!token) {
                        return {
                            isLoggedIn: false,
                        };
                    }

                    // 유저 정보 확인요청
                    const response = await customAxios.get("/user/my", {
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
            const tokenData = await customAxios.post("/user/login", {
                email,
                password,
            });

            localStoragePersistor.onSet(TOKEN_KEY, tokenData.data);
            // await setToken(tokenData.data);

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

        // await setToken(null);
        await loginMutate();
        setLoading(false);
    };

    const changeName = async (changeName: string) => {
        try {
            const token = localStoragePersistor.onGet(TOKEN_KEY);

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

            loginMutate();
            alert("성공적으로 변경하였습니다!");
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
