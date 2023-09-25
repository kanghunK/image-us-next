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
import { getToken } from "./getToken";

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

        // const response = await customAxios.get("/user/my", {
        //     headers: {
        //         Authorization: token?.access_token,
        //     },
        // });

        localStoragePersistor.onSet(TOKEN_KEY, token);

        // const userInfo = response.data.user_info;
        // return userInfo;
        return true;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            if (
                error.response?.status === 401 ||
                error.response?.status === 404
            ) {
                alert(error.response?.data.message);
            } else {
                alert("서버 문제로 잠시 후에 다시 시도 해주세요.");
            }
        } else {
            alert("예기치 못한 에러가 발생하였습니다..다시 시도해주세요.");
        }
    }
};

const socialLogin = async (coperation: string, code: string) => {
    try {
        const oauthResponse = await customAxios.get(
            `/oauth-login/callback?coperation=${coperation}&code=${code}`
        );
        const { user_id, ...oAuthData } = oauthResponse.data;

        const userResponse = await customAxios.get("/user/my", {
            headers: {
                Authorization: oAuthData?.access_token,
            },
        });

        localStoragePersistor.onSet(TOKEN_KEY, oAuthData);

        const userInfo = userResponse.data.user_info;

        return userInfo;
    } catch (error) {
        if (error instanceof AxiosError) {
            alert("서버 문제로 잠시 후에 다시 시도 해주세요.");
        } else {
            alert("예기치 못한 에러가 발생하였습니다..다시 시도해주세요.");
        }
    }
};

const removeLocalStorageData = () => {
    // 로컬스토리지에 저장된 정보 제거
    window.localStorage.removeItem(USERDATA_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(ROOM_KEY);
    window.localStorage.removeItem(FRIEND_KEY);
    window.localStorage.removeItem(USER_IMAGE_KEY);
};

const changeName = async (changeName: string) => {
    try {
        const token = await getToken();

        const response = await customAxios.post(
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

        alert("성공적으로 변경하였습니다!");

        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            if (err.response?.status === 401) {
                alert("사용자 권한이 없습니다..로그아웃 후 시도해주세요.");
            } else {
                alert("서버 문제로 잠시 후에 다시 시도 해주세요.");
            }
        } else {
            alert("예기치 못한 에러가 발생하였습니다..다시 시도해주세요.");
        }
    }
};

const checkAuth = async () => {
    try {
        const token = await getToken();

        if (!token) throw Error();

        const response = await customAxios.get("/user/my", {
            headers: {
                Authorization: token?.access_token,
            },
        });

        return response.data.user_info;
    } catch (err) {
        if (err instanceof AxiosError) {
            if (err.response?.status === 401) {
                console.error("Auth Error: ", err);
            } else {
                console.error("Server Error: ", err);
            }
        }
        return null;
    }
};

export { login, removeLocalStorageData, changeName, checkAuth, socialLogin };
