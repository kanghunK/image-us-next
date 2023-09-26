"use client";

import React, { useEffect, useState } from "react";
import DetailPhotoModal from "@/components/DetailPhotoModal";
import { useUserImageList } from "@/states/stores/userData";
import { ImageInfo } from "@/lib/types";

export default function DetailPhoto({
    params,
}: {
    params: { imageId: string };
}) {
    const [userImageList] = useUserImageList();
    const [imageData, setImageData] = useState<ImageInfo>();

    useEffect(() => {
        setImageData(() => {
            if (!userImageList) return;
            const currentImageData = userImageList.find(
                (data) => "" + data.id === params.imageId
            );
            return currentImageData;
        });
    }, [userImageList, params.imageId]);

    return <DetailPhotoModal imageData={imageData} />;
}
