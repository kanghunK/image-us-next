import { AxiosError } from "axios";
import useStore from "swr-global-state";
import customAxios from "@/lib/api";
import { DRoomData, RoomData } from "@/lib/types";
import localStoragePersistor from "@/states/persistors/local-storage";
import { ROOM_KEY, USERDATA_KEY, useUserData } from "@/states/stores/userData";
import { NetworkError, unknownError } from "@/lib/exceptions";
import { getToken } from "@/utils/getToken";

export function useRoom() {
    const [, setUserData] = useUserData();
    const [isLoading, setLoading] = useStore({
        key: `${ROOM_KEY}-loading`,
        initial: true,
    });
    const [data, , swrDefaultResponse] = useStore<RoomData[] | null, any>(
        {
            key: ROOM_KEY,
            initial: null,
            persistor: {
                onSet: localStoragePersistor.onSet,
                onGet: async (key) => {
                    try {
                        const tokenData = await getToken();
                        const userInfoData =
                            localStoragePersistor.onGet(USERDATA_KEY);

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
                                const userlist = roomData.userlist.map(
                                    (data) => ({
                                        id: data.id,
                                        name: data.name,
                                    })
                                );
                                return { ...roomData, userlist };
                            }
                        );

                        setUserData((prev) => ({
                            ...prev,
                            roomList: roomlist,
                        }));

                        return roomlist;
                    } catch (error: unknown) {
                        if (window.navigator.onLine) {
                            if (error instanceof AxiosError) {
                                if (
                                    error.response?.status === 401 ||
                                    error.response?.status === 403
                                ) {
                                    console.error(
                                        "Error: 올바른 요청이 아닙니다..다시시도 해주세요!"
                                    );
                                } else {
                                    throw new unknownError();
                                }
                            } else {
                                throw new unknownError();
                            }
                        }
                        throw new NetworkError();
                    } finally {
                        setLoading(false);
                    }
                },
            },
        },
        {
            revalidateOnReconnect: false,
            revalidateOnFocus: false,
        }
    );

    const { mutate: roomListMutate, error } = swrDefaultResponse;

    const createRoom = async ({
        userlist,
        title,
    }: {
        userlist: number[];
        title: string;
    }) => {
        try {
            setLoading(true);

            const tokenData = await getToken();

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
            alert("성공적으로 방을 생성하였습니다!");
            setLoading(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    alert("올바른 요청이 아닙니다..다시시도 해주세요!");
                } else {
                    alert("방 생성에 실패했습니다..다시시도 해주세요!");
                }
            } else {
                throw new unknownError();
            }
        }
    };

    const exitRoom = async (id: number) => {
        try {
            setLoading(true);

            const tokenData = await getToken();
            const userInfoData = localStoragePersistor.onGet(USERDATA_KEY);

            await customAxios.delete(
                `/user/${userInfoData.user_info.id}/room`,
                {
                    headers: {
                        Authorization: tokenData.access_token,
                    },
                    data: {
                        delete_user_room_id: id,
                    },
                }
            );

            roomListMutate();
            alert("성공적으로 방에서 나갔습니다!");

            setLoading(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    alert("올바른 요청이 아닙니다..다시시도 해주세요!");
                } else {
                    alert("방에서 나가지 못하였습니다..다시시도 해주세요!");
                }
            } else {
                throw new unknownError();
            }
        }
    };

    const inviteMemberToRoom = async (
        roomId: string,
        inviteMemberlist: number[]
    ) => {
        try {
            setLoading(true);

            const tokenData = await getToken();

            await customAxios.post(
                `/room/${roomId}/user`,
                {
                    invite_userlist: inviteMemberlist,
                },
                {
                    headers: {
                        Authorization: tokenData.access_token,
                    },
                }
            );

            roomListMutate();
            alert("성공적으로 초대하였습니다!");

            setLoading(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    alert("올바른 요청이 아닙니다..다시시도 해주세요!");
                } else if (error.response?.status === 402) {
                    alert("방이 존재하지 않습니다...다시시도 해주세요!");
                } else {
                    throw new unknownError();
                }
            } else {
                throw new unknownError();
            }
        }
    };

    const forceOutMember = async (roomId: string, memberId: string) => {
        try {
            setLoading(true);

            const tokenData = await getToken();

            await customAxios.delete(`/room/${roomId}/user`, {
                headers: {
                    Authorization: tokenData.access_token,
                },
                data: {
                    delete_room_user_id: memberId,
                },
            });

            roomListMutate();
            alert("성공적으로 강퇴하였습니다!");

            setLoading(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    alert("올바른 요청이 아닙니다..다시시도 해주세요!");
                } else if (error.response?.status === 402) {
                    alert("방이 존재하지 않습니다..다시시도 해주세요!");
                } else {
                    throw new unknownError();
                }
            } else {
                throw new unknownError();
            }
        }
    };

    return {
        data,
        isLoading,
        error,
        createRoom,
        exitRoom,
        inviteMemberToRoom,
        forceOutMember,
    };
}
