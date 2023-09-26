import { ImageInfo } from "@/lib/types";
import useStore, { createStore } from "swr-global-state";

export const IMAGE_KEY = "@room/image";

export const useRoomImageList = createStore<ImageInfo[] | null>({
    key: `${IMAGE_KEY}-imagelist`,
    initial: null,
});
