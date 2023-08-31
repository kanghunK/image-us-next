import React from "react";
import { ImExit } from "react-icons/im";
import { useRoom } from "@/states/stores/userData";
import NoticeModal from "./shared/NoticeModal";

interface Props {
    roomId: number;
}

export default function ExitRoomBtn({ roomId }: Props) {
    const { exitRoom } = useRoom();

    return (
        <NoticeModal
            icon={<ImExit />}
            title={"주의!"}
            content={"정말 방에서 나가시겠습니까?"}
            okHandler={() => exitRoom(roomId)}
        />
    );
}
