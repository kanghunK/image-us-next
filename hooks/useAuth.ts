import { AxiosError } from "axios";
import useStore from "swr-global-state";
import { DUserInfo, UserInfo } from "@/lib/types";
import localStoragePersistor from "@/states/persistors/local-storage";
import {
    FRIEND_KEY,
    ROOM_KEY,
    TOKEN_KEY,
    USERDATA_KEY,
    useUserData,
} from "@/states/stores/userData";
import customAxios from "@/lib/api";
import {
    AuthRequiredError,
    NetworkError,
    ServerError,
    unknownError,
} from "@/lib/exceptions";

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
                    console.log("토큰 확인", token);

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
                    if (window.navigator.onLine) {
                        if (err instanceof AxiosError) {
                            throw new AuthRequiredError();
                        } else {
                            throw new unknownError();
                        }
                    } else {
                        throw new NetworkError();
                    }
                } finally {
                    setLoading(false);
                }
            },
        },
    });

    const { mutate: loginMutate, error: authError } = swrDefaultResponse;

    const login = async ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => {
        try {
            setLoading(true);

            const tokenData = await customAxios.post("/user/login", {
                email,
                password,
            });

            localStoragePersistor.onSet(TOKEN_KEY, tokenData.data);

            await loginMutate();
            setLoading(false);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 404
                ) {
                    alert(error.response?.data.message);
                } else {
                    throw new ServerError();
                }
            } else {
                throw new unknownError();
            }
        }
    };

    const logout = async () => {
        setLoading(true);

        // 로컬스토리지에 저장된 정보 제거
        window.localStorage.removeItem(USERDATA_KEY);
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(ROOM_KEY);
        window.localStorage.removeItem(FRIEND_KEY);

        await loginMutate();
        setLoading(false);
    };

    const changeName = async (changeName: string) => {
        try {
            const token = localStoragePersistor.onGet(TOKEN_KEY);

            await customAxios.post(
                `/user/my`,
                {
                    name: changeName,
                },
                {
                    headers: {
                        Authorization: token?.access_token,
                    },
                }
            );

            loginMutate();
            alert("성공적으로 변경하였습니다!");
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    throw new AuthRequiredError();
                } else {
                    throw new ServerError();
                }
            } else {
                throw new unknownError();
            }
        }
    };

    return {
        authData,
        authError,
        isLoading: !authData || isLoading,
        login,
        logout,
        changeName,
    };
}
