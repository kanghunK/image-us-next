"use client";
import { useRouter } from "next/navigation";
import { BsCalendar2Plus } from "react-icons/bs";
import Image from "next/image";

import Card from "@/components/Card";
import { useRoom } from "@/hooks/useRoom";
import styles from "./room.module.scss";
import DataLoading from "@/components/shared/DataLoading";

export default function Room() {
    const { data: roomlist, isLoading } = useRoom();

    const router = useRouter();

    if (isLoading || !roomlist) return <DataLoading text="데이터" />;

    return (
        <div className={styles.wrapper}>
            <div className={styles.card_wrapper}>
                {roomlist.length === 0 ? (
                    <div className={styles.no_group}>
                        <Image
                            src="/no_data.png"
                            width={200}
                            height={200}
                            alt="그룹방 없음"
                            priority
                        />
                        <p className={styles.text}>등록된 방이 없습니다!</p>
                    </div>
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
            <div
                className={styles.create_room}
                onClick={() => router.push("/room/create_room")}
            >
                <BsCalendar2Plus />
                <div>새로운 방 만들기</div>
            </div>
        </div>
    );
}
