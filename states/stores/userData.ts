import { createStore } from "swr-global-state";
import localStoragePersistor from "../persistors/local-storage";
import { ImageInfo, UserData } from "@/lib/types";

export const TOKEN_KEY = "@user/token";
export const USERDATA_KEY = "@user/info";
export const ROOM_KEY = "@user/room";
export const FRIEND_KEY = "@user/friend";
export const USER_IMAGE_KEY = "@user/image";

export const useUserData = createStore<UserData>({
    key: USERDATA_KEY,
    initial: { loginState: "loading" },
    persistor: localStoragePersistor,
});

export const useUserImageList = createStore<ImageInfo[] | null>({
    key: `${USER_IMAGE_KEY}-imagelist`,
    initial: null,
});
