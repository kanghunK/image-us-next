import { AxiosError } from "axios";
import useStore from "swr-global-state";
import { DUserInfo, UserInfo } from "@/lib/types";
import localStoragePersistor from "@/states/persistors/local-storage";
import {
    FRIEND_KEY,
    ROOM_KEY,
    TOKEN_KEY,
    USERDATA_KEY,
    USER_IMAGE_KEY,
    useUserData,
} from "@/states/stores/userData";
import customAxios from "@/lib/api";
import {
    AuthRequiredError,
    NetworkError,
    ServerError,
    unknownError,
} from "@/lib/exceptions";

export function useMy() {
    // const [, setUserData] = useUserData();

    const [isLoading, setLoading] = useStore({
        key: `${USERDATA_KEY}-loading`,
        initial: true,
    });
    const [userInfoData, , swrDefaultResponse] = useStore<UserInfo | null>(
        {
            key: "useMy",
            initial: null,
            persistor: {
                onSet: localStoragePersistor.onSet,
                onGet: async (key) => {
                    try {
                        const token = localStoragePersistor.onGet(TOKEN_KEY);
                        console.log("토큰 확인", token);

                        // 유저 정보 확인요청
                        const response = await customAxios.get("/user/my", {
                            headers: {
                                Authorization: token?.access_token,
                            },
                        });

                        const userInfo = response.data.user_info;

                        return { user_info: userInfo };
                    } catch (err: unknown) {
                        console.error(err);
                        if (window.navigator.onLine) {
                            if (err instanceof AxiosError) {
                                throw new AuthRequiredError();
                            } else {
                                console.error("여기서 발생,", err);
                                throw new unknownError();
                            }
                        } else {
                            alert("연결되 네트워크가 없습니다..");
                            const cachedData = localStoragePersistor.onGet(key);
                            return cachedData;
                        }
                    } finally {
                        setLoading(false);
                    }
                },
            },
        },
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateOnMount: false,
        }
    );

    const { mutate: loginMutate, error } = swrDefaultResponse;

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

    // console.log("my 내부", error);

    return {
        userInfoData,
        error,
        isLoading: !userInfoData || isLoading,
        changeName,
    };
}
