export interface RootLayoutChildren {
    children: React.ReactNode;
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
