import axios, { AxiosError } from "axios";
import customAxios from "@/lib/api";
import { TOKEN_KEY } from "@/states/stores/userData";
import localStoragePersistor from "@/states/persistors/local-storage";

export async function getMyPageInfo(userId: number) {
    try {
        const token = localStoragePersistor.onGet(TOKEN_KEY);

        const urls = [
            `/user/${userId}/imagelist-len`,
            `/user/${userId}/roomlist`,
            `/user/${userId}/friendlist`,
        ];

        const axiosPromises = urls.map((url) =>
            customAxios.get(url, {
                headers: {
                    Authorization: token?.access_token,
                },
            })
        );

        const [imagelenRes, roomlistRes, friendlistRes] = await Promise.all(
            axiosPromises
        );

        return {
            imageLen: imagelenRes.data.imagelist_len as number,
            roomListLen: roomlistRes.data.roomlist.length as number,
            friendlistLen: friendlistRes.data.friendlist.length as number,
        };
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error: ", error);
        }
    }
}