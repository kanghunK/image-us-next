import { AxiosError } from "axios";
import useStore from "swr-global-state";
import axios from "@/lib/api";
import localStoragePersistor from "../persistors/local-storage";

const USER_KEY = "@user/auth";
const TOKEN_KEY = "@user/token";

export function useAuth() {
    const [isLoading, setLoading] = useStore({
        key: `${USER_KEY}-loading`,
        initial: true,
    });
    const [data, , swrDefaultResponse] = useStore(
        {
            key: USER_KEY,
            initial: null,
            persistor: {
                onSet: localStoragePersistor.onSet,
                onGet: async (key) => {
                    try {
                        const tokenData =
                            localStoragePersistor.onGet(TOKEN_KEY);
                        if (tokenData) {
                            const token = tokenData.access_token;
                            // 유저 정보 확인요청
                            const response = await axios.get("/user/my", {
                                headers: {
                                    Authorization: token,
                                },
                            });
                            const userData = {
                                isLoggedIn: true,
                                user_info: response.data.user_info,
                            };
                            localStoragePersistor.onSet(key, userData);
                            return userData;
                        }
                        const errorObj = new Error(
                            "사용자 정보가 없어 로그아웃됩니다."
                        );
                        errorObj.name = "NoToken";
                        throw errorObj;
                    } catch (err: unknown) {
                        if (window.navigator.onLine) {
                            if (err instanceof AxiosError) {
                                const errorObj = new Error(
                                    "사용자 정보가 일치하지 않아 로그아웃됩니다."
                                );
                                errorObj.name = "InvalidUserData";
                                throw errorObj;
                            } else {
                                throw err;
                            }
                        }
                        const cachedData = localStoragePersistor.onGet(key);
                        return cachedData;
                    } finally {
                        setLoading(false);
                    }
                },
            },
        },
        {
            revalidateOnReconnect: true,
        }
    );

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
        window.localStorage.removeItem(USER_KEY);
        window.localStorage.removeItem(TOKEN_KEY);
        loginMutate(null);
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
