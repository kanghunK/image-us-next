"use client";

import { AxiosError } from "axios";
import useStore, { createStore } from "swr-global-state";
import axios from "@/lib/api";
import localStoragePersistor from "../persistors/local-storage";
import { DFriendData, TokenData, UserData } from "@/lib/types";

export const TOKEN_KEY = "@user/token";
export const USERDATA_KEY = "@user/info";
export const ROOM_KEY = "@user/room";
export const FRIEND_KEY = "@user/friend";

export const useUserData = createStore<UserData>({
    key: USERDATA_KEY,
    initial: { isLoggedIn: false },
    persistor: localStoragePersistor,
});
