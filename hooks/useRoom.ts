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
import {
    NetworkError,
    alertErrorMessage,
    unknownError,
} from "@/lib/exceptions";

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
                            if (error.status === 401 || error.status === 403) {
                                throw new alertErrorMessage(
                                    "올바른 요청이 아닙니다..다시시도 해주세요!"
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
    });

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
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 401 || error.status === 403) {
                    throw new alertErrorMessage(
                        "올바른 요청이 아닙니다..다시시도 해주세요!"
                    );
                } else {
                    throw new alertErrorMessage(
                        "방 생성에 실패했습니다..다시시도 해주세요!"
                    );
                }
            } else {
                throw new unknownError();
            }
        }
    };

    const exitRoom = async (id: number) => {
        try {
            setLoading(true);

            const tokenData = localStoragePersistor.onGet(TOKEN_KEY);
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

            setLoading(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 401 || error.status === 403) {
                    throw new alertErrorMessage(
                        "올바른 요청이 아닙니다..다시시도 해주세요!"
                    );
                } else {
                    throw new alertErrorMessage(
                        "방에서 나가지 못하였습니다..다시시도 해주세요!"
                    );
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

            const tokenData = localStoragePersistor.onGet(TOKEN_KEY);

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
                if (error.status === 401 || error.status === 403) {
                    throw new alertErrorMessage(
                        "올바른 요청이 아닙니다..다시시도 해주세요!"
                    );
                } else if (error.status === 402) {
                    throw new alertErrorMessage(
                        "방이 존재하지 않습니다...다시시도 해주세요!"
                    );
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

            const tokenData = localStoragePersistor.onGet(TOKEN_KEY);

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
                if (error.status === 401 || error.status === 403) {
                    throw new alertErrorMessage(
                        "올바른 요청이 아닙니다..다시시도 해주세요!"
                    );
                } else if (error.status === 402) {
                    throw new alertErrorMessage(
                        "방이 존재하지 않습니다..다시시도 해주세요!"
                    );
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
