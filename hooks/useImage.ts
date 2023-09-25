import localStoragePersistor from "@/states/persistors/local-storage";
import customAxios from "@/lib/api";
import {
    TOKEN_KEY,
    useUserData,
    useUserImageList,
} from "@/states/stores/userData";
import { AxiosCustomRequestConfig, DImageData, ImageInfo } from "@/lib/types";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import useStore from "swr-global-state";
import { IMAGE_KEY, useRoomImageList } from "@/states/stores/roomData";
import { unknownError } from "@/lib/exceptions";
import { getToken } from "@/utils/getToken";

const limitNum = 12;

async function imageConvertToBlob(imageList: DImageData[]) {
    try {
        const tokenData = await getToken();

        // 삭제된 이미지 데이터는 link, user_id, user_name이 null을 가진다.
        const filteredImageList: DImageData[] = imageList.filter(
            (data) => data.link && data.user_id
        );
        const imgDataList: ImageInfo[] = [];
        const MAX_RETRY_COUNT = 2;
        const axiosObj = axios.create({
            baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
        });

        axiosObj.interceptors.response.use(undefined, (error: AxiosError) => {
            const config = error.config as AxiosCustomRequestConfig;
            config.retryCount = config.retryCount ?? 0;

            const shouldRetry = config.retryCount < MAX_RETRY_COUNT;
            if (shouldRetry) {
                config.retryCount += 1;
                config.headers = { ...config!.headers };

                return axiosObj.request(config);
            }

            return Promise.reject(error);
        });

        const imgDataStateList = await Promise.allSettled(
            filteredImageList.map(async (imageInfo) => {
                const requestConfig: AxiosRequestConfig = {
                    url: `/imageapi/image-download/${imageInfo.link}`,
                    method: "GET",
                    headers: {
                        Authorization: tokenData.access_token,
                    },
                    responseType: "blob",
                };

                const response = await axiosObj.request(requestConfig);

                const created_at =
                    imageInfo.created_at !== null
                        ? imageInfo.created_at.split(" ")[0]
                        : null;
                const url = window.URL.createObjectURL(
                    new Blob([response.data], {
                        type: response.headers["content-type"],
                    })
                );
                const fileName = imageInfo.link
                    ? imageInfo.link.split("/")[1]
                    : "Image";

                return {
                    ...imageInfo,
                    link: url,
                    fileName,
                    created_at,
                };
            })
        );

        imgDataStateList.forEach((data) => {
            if (data.status === "fulfilled") {
                imgDataList.push(data.value);
            }
        });

        return imgDataList;
    } catch (error) {
        throw error;
    }
}

export function useImage() {
    const [userData, setUserData] = useUserData();
    const [, setRoomImageList] = useRoomImageList();
    const [, setUserImageList] = useUserImageList();
    const [isLoading, setLoading] = useStore({
        key: `${IMAGE_KEY}-loading`,
        initial: true,
    });
    const [imageLoadEnd, setImageLoadEnd] = useStore({
        key: `${IMAGE_KEY}-loadend`,
        initial: false,
    });

    const loadUserImagelist = async (userId?: number, startNum?: number) => {
        try {
            setLoading(true);

            const tokenData = await getToken();

            const response = await customAxios.get(
                `/user/${userId}/imagelist?start=${startNum}&limit=${limitNum}`,
                {
                    headers: {
                        Authorization: tokenData.access_token,
                    },
                }
            );

            const imageList: DImageData[] = response.data.imagelist;

            const newImgDatalist = await imageConvertToBlob(imageList);

            if (newImgDatalist.length < limitNum) setImageLoadEnd(true);
            setLoading(false);

            return newImgDatalist;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    console.error(
                        "Error: 올바른 요청이 아닙니다..다시시도 해주세요!"
                    );
                } else {
                    console.error(
                        "Error: 이미지를 불러오는데 실패하였습니다..다시 시도해주세요"
                    );
                }
            } else {
                throw new unknownError();
            }
        }
    };

    const deleteUserImage = async (imageId: number) => {
        try {
            const tokenData = await getToken();

            await customAxios.delete(`/image`, {
                headers: {
                    Authorization: tokenData.access_token,
                },
                data: {
                    delete_image_id: imageId,
                },
            });

            alert("이미지를 성공적으로 삭제하였습니다!");

            setUserImageList((prevData) => {
                const newData = prevData.filter(
                    (imageData) => imageData.id !== imageId
                );
                return newData;
            });

            setUserData((prev) => ({
                ...prev,
                imageLen: prev?.imageLen ? prev.imageLen - 1 : prev?.imageLen,
            }));
        } catch (error) {
            if (error instanceof AxiosError) {
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    alert("올바른 요청이 아닙니다..다시시도 해주세요!");
                } else {
                    alert(
                        "이미지를 삭제하는데 실패하였습니다..다시 시도해주세요"
                    );
                }
            } else {
                throw new unknownError();
            }
        }
    };

    const uploadUserImage = async (uploadImageFile: FormData) => {
        try {
            const tokenData = await getToken();

            const response: {
                data: { image_info: DImageData; success: number };
            } = await customAxios.post(`/image`, uploadImageFile, {
                headers: {
                    Authorization: tokenData.access_token,
                },
            });

            const imageInfo = response.data.image_info;

            const created_at =
                imageInfo.created_at !== null
                    ? imageInfo.created_at.split(" ")[0]
                    : null;

            const url = window.URL.createObjectURL(
                new Blob([uploadImageFile.get("image") as FormDataEntryValue], {
                    type: "multipart/form-data",
                })
            );
            const fileName = imageInfo.link
                ? imageInfo.link.split("/")[1]
                : "Image";

            const newData = {
                ...response.data.image_info,
                created_at,
                link: url,
                fileName,
            };

            alert("이미지를 성공적으로 업로드하였습니다!");

            setUserImageList((prevData) => [newData, ...prevData]);

            setUserData((prev) => ({
                ...prev,
                imageLen: prev?.imageLen ? prev.imageLen + 1 : prev?.imageLen,
            }));
        } catch (error) {
            if (error instanceof AxiosError) {
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    alert("올바른 요청이 아닙니다..다시시도 해주세요!");
                } else {
                    alert("이미지 업로드에 실패하였습니다..다시 시도해주세요");
                }
            } else {
                throw new unknownError();
            }
        }
    };

    const loadRoomImagelist = async (roomId: string, startNum: number) => {
        try {
            setLoading(true);

            const tokenData = await getToken();

            const response = await customAxios.get(
                `/room/${roomId}/imagelist?start=${startNum}&limit=${limitNum}`,
                {
                    headers: {
                        Authorization: tokenData.access_token,
                    },
                }
            );

            const imageList: DImageData[] = response.data.imagelist;

            const newImgDatalist = await imageConvertToBlob(imageList);

            if (newImgDatalist.length < limitNum) setImageLoadEnd(true);
            setLoading(false);

            return newImgDatalist;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    console.error(
                        "Error: 올바른 요청이 아닙니다..다시시도 해주세요!"
                    );
                } else {
                    console.error(
                        "Error: ",
                        "이미지를 불러오는데 실패하였습니다..다시 시도해주세요"
                    );
                }
            } else {
                throw new unknownError();
            }
        }
    };

    const deleteRoomImage = async (roomId: string, imageId: number) => {
        try {
            const tokenData = await getToken();

            await customAxios.delete(`/room/${roomId}/image`, {
                headers: {
                    Authorization: tokenData.access_token,
                },
                data: {
                    delete_room_image_id: imageId,
                },
            });

            alert("이미지를 성공적으로 삭제하였습니다!");

            setRoomImageList((prevData) => {
                const newData = prevData.filter(
                    (imageData) => imageData.id !== imageId
                );
                return newData;
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    alert("올바른 요청이 아닙니다..다시시도 해주세요!");
                } else {
                    alert(
                        "이미지를 삭제하는데 실패하였습니다..다시 시도해주세요"
                    );
                }
            } else {
                throw new unknownError();
            }
        }
    };

    const uploadRoomImage = async (
        roomId: string,
        uploadImageFile: FormData
    ) => {
        try {
            const tokenData = await getToken();

            const response: {
                data: { image_info: DImageData; success: number };
            } = await customAxios.post(
                `/room/${roomId}/image`,
                uploadImageFile,
                {
                    headers: {
                        Authorization: tokenData.access_token,
                    },
                }
            );

            const imageInfo = response.data.image_info;

            const created_at =
                imageInfo.created_at !== null
                    ? imageInfo.created_at.split(" ")[0]
                    : null;

            const url = window.URL.createObjectURL(
                new Blob([uploadImageFile.get("image") as FormDataEntryValue], {
                    type: "multipart/form-data",
                })
            );
            const fileName = imageInfo.link
                ? imageInfo.link.split("/")[1]
                : "Image";

            const newData = {
                ...response.data.image_info,
                created_at,
                link: url,
                fileName,
                user_name: userData.user_info?.name,
            };

            alert("이미지를 성공적으로 업로드하였습니다!");

            setRoomImageList((prevData) => [newData, ...prevData]);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    alert("올바른 요청이 아닙니다..다시시도 해주세요!");
                } else {
                    alert("이미지 업로드에 실패하였습니다..다시 시도해주세요");
                }
            } else {
                throw new unknownError();
            }
        }
    };

    return {
        isLoading,
        imageLoadEnd,
        setImageLoadEnd,
        loadUserImagelist,
        deleteUserImage,
        uploadUserImage,
        loadRoomImagelist,
        deleteRoomImage,
        uploadRoomImage,
    };
}
