import axios, { AxiosError } from "axios";
import localStoragePersistor from "@/states/persistors/local-storage";
import { TOKEN_KEY, USERDATA_KEY } from "@/states/stores/userData";

export const getToken = async () => {
    try {
        const currentTimeDate = new Date();

        const tokenData = localStoragePersistor.onGet(TOKEN_KEY);

        const accessToken = tokenData?.access_token;
        const refreshToken = tokenData?.refresh_token;
        const accessTokenExpireTime = tokenData?.access_token_expire_time;
        const refreshTokenExpireTime = tokenData?.refresh_token_expire_time;

        if (!accessTokenExpireTime || !refreshTokenExpireTime || !accessToken) {
            return null;
        }

        const accessTokenExpireTimeDate = new Date(accessTokenExpireTime);
        const accessTokenDiffTime =
            accessTokenExpireTimeDate.getTime() - currentTimeDate.getTime();

        const refreshTokenExpireTimeDate = new Date(refreshTokenExpireTime);
        const refreshTokenDiffTime =
            refreshTokenExpireTimeDate.getTime() - currentTimeDate.getTime();

        if (accessTokenDiffTime >= 30000) {
            return tokenData;
        } else if (refreshTokenDiffTime >= 30000) {
            const userData = localStoragePersistor.onGet(USERDATA_KEY);
            const userId = userData?.user_info.id;
            const responseTokenData = await axios.post(
                `/backapi/user/${userId}/refresh`,
                {
                    refresh_token: refreshToken,
                }
            );

            const responseToken = responseTokenData.data;
            localStoragePersistor.onSet(TOKEN_KEY, responseToken);
            // const { access_token, access_token_expire_time, user_id } =
            //     response.data;
            // sessionStorage.setItem("access_token", access_token);
            // sessionStorage.setItem(
            //     "access_token_expire_time",
            //     access_token_expire_time
            // );
            // sessionStorage.setItem("user_id", user_id);

            return responseToken;
        } else {
            return null;
        }
    } catch (err) {
        if (err instanceof AxiosError) {
            console.error("Error: 사용자 권한을 갱신하지 못하였습니다..", err);
        } else {
            console.error("Error: ", err);
        }
    }
};
