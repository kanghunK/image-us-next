import useStore, { createStore } from "swr-global-state";
import localStoragePersistor from "../persistors/local-storage";
import customAxios from "@/lib/api";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { TOKEN_KEY } from "./userData";
import { AxiosCustomRequestConfig, DImageData, ImageInfo } from "@/lib/types";

const IMAGE_KEY = "@room/image";
const limitNum = 12;

export function useImage({ roomId }: { roomId: string }) {
    const [isLoading, setLoading] = useStore({
        key: `${IMAGE_KEY}-loading`,
        initial: true,
    });
    const [data, setImagelist, swrDefaultResponse] = useStore<ImageInfo[], any>(
        {
            key: IMAGE_KEY,
            initial: [],
            persistor: {
                onSet: localStoragePersistor.onSet,
                onGet: async (key) => {
                    try {
                        const tokenData =
                            localStoragePersistor.onGet(TOKEN_KEY);
                        if (!tokenData) throw new Error();

                        const response = await customAxios.get(
                            `/room/${roomId}/imagelist?start=0&limit=${limitNum}`,
                            {
                                headers: {
                                    Authorization: tokenData.access_token,
                                },
                            }
                        );

                        const imageList: DImageData[] = response.data.imagelist;

                        // 삭제된 이미지 데이터는 link, user_id, user_name이 null을 가진다.
                        const filteredImageList: DImageData[] =
                            imageList.filter(
                                (data) => data.link && data.user_id
                            );
                        const imgDataList: ImageInfo[] = [];
                        const MAX_RETRY_COUNT = 2;
                        const axiosObj = axios.create({
                            baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
                        });

                        axiosObj.interceptors.response.use(
                            undefined,
                            (error: AxiosError) => {
                                const config =
                                    error.config as AxiosCustomRequestConfig;
                                config.retryCount = config.retryCount ?? 0;

                                const shouldRetry =
                                    config.retryCount < MAX_RETRY_COUNT;
                                if (shouldRetry) {
                                    config.retryCount += 1;
                                    config.headers = { ...config!.headers };

                                    return axiosObj.request(config);
                                }

                                return Promise.reject(error);
                            }
                        );

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

                                const response = await axiosObj.request(
                                    requestConfig
                                );

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

                        return [...imgDataList];
                    } catch (err) {
                        if (window.navigator.onLine) {
                            if (err instanceof AxiosError) {
                                if (err.response?.status === 401) {
                                    const errorObj = new Error(
                                        "올바른 접속이 아님으로 로그아웃됩니다.."
                                    );
                                    errorObj.name = "InvalidUserData";
                                    throw errorObj;
                                }
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
        }
    );

    const { mutate: imagelistMutate, error: imageLoadError } =
        swrDefaultResponse;

    const loadImagelist = async (startNum: number) => {
        try {
            setLoading(true);

            const tokenData = localStoragePersistor.onGet(TOKEN_KEY);

            const response = await customAxios.get(
                `/room/${roomId}/imagelist?start=${startNum}&limit=${limitNum}`,
                {
                    headers: {
                        Authorization: tokenData.access_token,
                    },
                }
            );

            const newImagelist = response.data.imagelist;

            setImagelist((prev) => [...newImagelist, prev]);

            setLoading(false);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    const errorObj = new Error(
                        "올바른 접속이 아님으로 로그아웃됩니다.."
                    );
                    errorObj.name = "InvalidUserData";
                    throw errorObj;
                } else {
                    const errorObj = new Error(
                        "이미지를 불러오는데 실패하였습니다..다시 시도해주세요"
                    );
                    errorObj.name = "failLoadImage";
                    throw errorObj;
                }
            }
        }
    };

    const deleteImage = async (imageId: number) => {
        try {
            const tokenData = localStoragePersistor.onGet(TOKEN_KEY);
            if (!tokenData) throw new Error();

            await customAxios.delete(`/room/${roomId}/image`, {
                headers: {
                    Authorization: tokenData.access_token,
                },
                data: {
                    delete_room_image_id: imageId,
                },
            });

            imagelistMutate();
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    const errorObj = new Error(
                        "올바른 접속이 아님으로 로그아웃됩니다.."
                    );
                    errorObj.name = "InvalidUserData";
                    throw errorObj;
                } else {
                    const errorObj = new Error(
                        "이미지를 삭제하는데 실패하였습니다..다시 시도해주세요"
                    );
                    errorObj.name = "failDeleteImage";
                    throw errorObj;
                }
            }
        }
    };

    const uploadImage = async (uploadImageFile: FormData) => {
        try {
            const tokenData = localStoragePersistor.onGet(TOKEN_KEY);
            if (!tokenData) throw new Error();

            await customAxios.post(`/room/${roomId}/image`, uploadImageFile, {
                headers: {
                    Authorization: tokenData.access_token,
                },
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    const errorObj = new Error(
                        "올바른 접속이 아님으로 로그아웃됩니다.."
                    );
                    errorObj.name = "InvalidUserData";
                    throw errorObj;
                } else {
                    const errorObj = new Error(
                        "이미지 업로드에 실패하였습니다..다시 시도해주세요"
                    );
                    errorObj.name = "failUploadImage";
                    throw errorObj;
                }
            }
        }
    };

    return {
        data,
        isLoading,
        imageLoadError,
        loadImagelist,
        deleteImage,
        uploadImage,
    };
}
