"use client";

import React, { useCallback, useEffect } from "react";
import Card from "@/components/Card";
import { RoomData } from "@/lib/types";
import styles from "./room.module.scss";
import styled from "@emotion/styled";
import { FiUserPlus } from "react-icons/fi";
import { BsCalendar2Plus } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useRoom } from "@/hooks/useRoom";
import { useUserData } from "@/states/stores/userData";
import { PageList } from "@/lib/enumType";

export default function Room() {
    const [userData, setUserData] = useUserData();
    const { data: roomlist, isLoading } = useRoom();

    const router = useRouter();

    useEffect(() => {
        setUserData((prev) => ({
            ...prev,
            currentPage: PageList.RoomMain,
            navigationTitle: "방 목록",
        }));
    }, [setUserData]);

    if (isLoading || !roomlist) return <div>로딩중...</div>;

    return (
        <Wrapper>
            <div className={styles.card_wrapper}>
                {roomlist.length === 0 ? (
                    <div>등록된 방이 없습니다...</div>
                ) : (
                    roomlist.map((roomData, i) => (
                        <Card
                            key={roomData.id}
                            roomData={roomData}
                            index={i + 1}
                        />
                    ))
                )}
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

    width: 85%;
    max-width: 800px;
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
        width: 50px;
        height: 50px;
    }
`;
