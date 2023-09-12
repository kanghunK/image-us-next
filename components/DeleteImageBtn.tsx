import React from "react";
import NoticeModal from "./shared/NoticeModal";
import { AiOutlineDelete } from "react-icons/ai";
import { useParams } from "next/navigation";
import { useImage } from "@/hooks/useImage";

interface Props {
    imageId: number;
}

export default function DeleteImageBtn({ imageId }: Props) {
    const params = useParams();
    const { deleteImage } = useImage({ roomId: params.id as string });

    return (
        <NoticeModal
            icon={<AiOutlineDelete />}
            title={"주의!"}
            content={"정말 이미지를 삭제하시겠습니까?"}
            okHandler={() => deleteImage(imageId)}
        />
    );
}
