"use client";

import { useEffect, useState } from "react";

import { ImageInfo } from "@/lib/types";
import { useRoomImageList } from "@/states/stores/roomData";
import DetailPhotoModal from "@/components/DetailPhotoModal";

export default function DetailPhoto({
    params,
}: {
    params: { id: string; imageId: string };
}) {
    const [imageList] = useRoomImageList();
    const [imageData, setImageData] = useState<ImageInfo>();

    useEffect(() => {
        setImageData(() => {
            if (!imageList) return;
            const currentImageData = imageList.find(
                (data) => "" + data.id === params.imageId
            );
            return currentImageData;
        });
    }, [imageList, params.imageId]);

    return <DetailPhotoModal imageData={imageData} />;
}
