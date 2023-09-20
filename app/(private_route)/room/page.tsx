"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsCalendar2Plus } from "react-icons/bs";
import styled from "@emotion/styled";

import { PageList } from "@/lib/enumType";
import Card from "@/components/Card";
import { useRoom } from "@/hooks/useRoom";
import { useUserData } from "@/states/stores/userData";
import styles from "./room.module.scss";

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
        width: 35px;
        height: 35px;
    }
`;
