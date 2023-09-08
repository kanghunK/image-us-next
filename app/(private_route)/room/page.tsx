"use client";

import React, { useCallback } from "react";
import Card from "@/components/Card";
import { RoomData } from "@/lib/types";
import styles from "./room.module.scss";
import styled from "@emotion/styled";
import { FiUserPlus } from "react-icons/fi";
import { BsCalendar2Plus } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useRoom } from "@/hooks/useRoom";

export default function Room() {
    const router = useRouter();
    const { data: roomlist, isLoading } = useRoom();

    if (isLoading || !roomlist) return <div>로딩중...</div>;

    return (
        <Wrapper>
            <div className={styles.card_wrapper}>
                {roomlist.map((roomData) => (
                    <Card key={roomData.id} roomData={roomData} />
                ))}
            </div>
            <CreateRoomBox onClick={() => router.push("/room/create_room")}>
                <BsCalendar2Plus />
                <div>새로운 방 만들기</div>
            </CreateRoomBox>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    min-height: 100%;
    padding: 50px;
    box-sizing: border-box;
`;

const CreateRoomBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 65%;
    margin-top: 3rem;
    gap: 0.5rem;
    padding: 1rem;

    box-sizing: border-box;
    user-select: none;
    cursor: pointer;
    border-radius: 0.4rem;
    color: hsla(240, 7%, 70%, 1);
    border: 4px dashed hsla(240, 7%, 70%, 0.35);

    &:hover {
        background-color: hsla(240, 7%, 70%, 0.22);
    }

    svg {
        width: 70px;
        height: 70px;
    }
`;
