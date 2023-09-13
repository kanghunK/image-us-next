import { AxiosError } from "axios";
import useStore from "swr-global-state";
import customAxios from "@/lib/api";
import { DRoomData, RoomData } from "@/lib/types";
import localStoragePersistor from "@/states/persistors/local-storage";
import {
    ROOM_KEY,
    TOKEN_KEY,
    USERDATA_KEY,
    useUserData,
} from "@/states/stores/userData";

export function useRoom() {
    const [, setUserData] = useUserData();
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

                    const response = await customAxios.get(
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

                    setUserData((prev) => ({ ...prev, roomList: roomlist }));

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

        await customAxios.post(
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

        await customAxios.delete(`/user/${userInfoData.user_info.id}/room`, {
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
