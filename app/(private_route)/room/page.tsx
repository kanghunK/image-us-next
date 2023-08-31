"use client";

import React, { useCallback } from "react";
import { useRoom } from "@/states/stores/userData";
import Card from "@/components/Card";
import { RoomData } from "@/lib/types";
import styles from "./room.module.scss";

export default function Room() {
    const { data: roomlist, isLoading } = useRoom();

    if (isLoading || !roomlist) return <div>로딩중...</div>;

    return (
        <>
            <div className={styles.subtitle}>
                <h2>방 목록</h2>
            </div>
            <div className={styles.card_wrapper}>
                {roomlist.map((roomData) => (
                    <Card key={roomData.id} roomData={roomData} />
                ))}
            </div>
        </>
    );
}
