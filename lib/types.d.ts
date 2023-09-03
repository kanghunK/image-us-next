import { AxiosRequestConfig } from "axios";

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
    profile: string;
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
    isLoggedIn: boolean;
    user_info: DUserInfo;
}

export interface ImageInfo {
    id: number;
    user_id: number | null;
    link: string;
    fileName: string;
    created_at: string | null;
    user_name?: string | null;
}
