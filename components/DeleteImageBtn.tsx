import React from "react";
import NoticeModal from "./shared/NoticeModal";
import { AiOutlineDelete } from "react-icons/ai";
import { useParams } from "next/navigation";
import { useImage } from "@/hooks/useImage";

interface Props {
    isRoom: boolean;
    imageId: number;
}

export default function DeleteImageBtn({ isRoom, imageId }: Props) {
    const params = useParams();
    const { deleteRoomImage, deleteUserImage } = useImage();

    return (
        <NoticeModal
            icon={<AiOutlineDelete />}
            title={"주의!"}
            content={"정말 이미지를 삭제하시겠습니까?"}
            okHandler={() => {
                if (isRoom) {
                    deleteRoomImage(params.id as string, imageId);
                } else {
                    deleteUserImage(imageId);
                }
            }}
        />
    );
}
