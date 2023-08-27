"use client";

import React from "react";
import { useRoom } from "@/states/stores/userData";
import Card from "@/components/Card";
import { RoomData } from "@/lib/types";
import styles from "./room.module.scss";

export default function Room() {
    const { data: roomlist, isLoading } = useRoom();
    // console.log("확인", roomlist, error);

    if (isLoading || !roomlist) return <div>로딩중...</div>;

    const dummyData: RoomData[] = [
        {
            id: 1,
            title: "room1",
            host_user_id: 1,
            userlist: [
                { id: 1, name: "test" },
                { id: 2, name: "test2" },
                { id: 3, name: "test3" },
            ],
        },
        {
            id: 2,
            title: "room2",
            host_user_id: 2,
            userlist: [
                { id: 2, name: "test2" },
                { id: 5, name: "test5" },
                { id: 3, name: "test3" },
                { id: 4, name: "test4" },
            ],
        },
    ];

    return (
        <div className={styles.card_wrapper}>
            {dummyData.map((roomData) => (
                <Card key={roomData.id} roomData={roomData} />
            ))}
        </div>
    );
}
