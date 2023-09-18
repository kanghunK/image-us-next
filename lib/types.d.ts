import { AxiosRequestConfig } from "axios";
import { PageList } from "./enumType";

export interface RootLayoutChildren {
    children: React.ReactNode;
}

export interface AxiosCustomRequestConfig extends AxiosRequestConfig {
    retryCount: number;
}

// database
export interface DUserInfo {
    id: number;
    email: string;
    name: string;
    profile: string;
    user_type: string;
}

export interface DFriendData {
    id: number;
    email: string;
    name: string;
    profile?: string;
    user_type: string;
}

export interface DRoomData {
    id: number;
    title: string;
    host_user_id: number;
    userlist: DUserInfo[];
}

export interface DImageData {
    id: number;
    link: string;
    user_id: number;
    created_at: string | null;
}

// client
export interface RoomData {
    id: number;
    title: string;
    host_user_id: number;
    userlist: {
        id: number;
        name: string;
    }[];
}

export interface UserInfo {
    user_info?: DUserInfo;
}

export interface ImageInfo {
    id: number;
    user_id: number | null;
    link: string;
    fileName: string;
    created_at: string | null;
    user_name?: string | null;
}

export interface MyPageInfo {
    imageLen?: number;
    roomListLen?: number;
    friendlistLen?: number;
}

// global state

export interface TokenData {
    access_token: string;
    refresh_token: string;
    access_token_expire_time: string;
    refresh_token_expire_time: string;
    user_id: number;
}

export interface UserData extends UserInfo, MyPageInfo {
    friends?: DFriendData[];
    roomList?: RoomData[];
    currentPage?: PageList;
    navigationTitle?: string;
}
