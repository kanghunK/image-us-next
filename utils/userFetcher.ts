import { ServerError, unknownError } from "@/lib/exceptions";
import localStoragePersistor from "@/states/persistors/local-storage";
import {
    FRIEND_KEY,
    ROOM_KEY,
    TOKEN_KEY,
    USERDATA_KEY,
    USER_IMAGE_KEY,
} from "@/states/stores/userData";
import { AxiosError } from "axios";
import customAxios from "@/lib/api";

const login = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    try {
        const tokenData = await customAxios.post("/user/login", {
            email,
            password,
        });

        const token = tokenData.data;

        const response = await customAxios.get("/user/my", {
            headers: {
                Authorization: token?.access_token,
            },
        });

        localStoragePersistor.onSet(TOKEN_KEY, token);

        const userInfo = response.data.user_info;
        return userInfo;

        // setUserData((prev) => ({
        //     ...prev,
        //     user_info: userInfo,
        // }));

        // await loginMutate();
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

const logout = () => {
    // 로컬스토리지에 저장된 정보 제거
    window.localStorage.removeItem(USERDATA_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(ROOM_KEY);
    window.localStorage.removeItem(FRIEND_KEY);
    window.localStorage.removeItem(USER_IMAGE_KEY);
    // setUserData(null);

    // await loginMutate();
};

export { login, logout };
