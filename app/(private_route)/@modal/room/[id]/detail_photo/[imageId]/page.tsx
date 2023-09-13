"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/shared/Modal";
import styled from "@emotion/styled";
import Image from "next/image";
import { ImageInfo } from "@/lib/types";
import { useImage } from "@/hooks/useImage";
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
            const currentImageData = imageList.find(
                (data) => "" + data.id === params.imageId
            );
            return currentImageData;
        });
    }, [imageList, params.imageId]);

    return <DetailPhotoModal imageData={imageData} />;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 65%;
    max-width: 650px;
    min-width: 300px;
    height: 510px;
    box-sizing: border-box;

    border-radius: 10px;
    background: #fff;
    box-shadow: 0 30px 60px 0 rgba(90, 116, 148, 0.4);
    overflow: hidden;

    .photo_info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.5rem;
        height: 80px;
        border-bottom: 1px solid hsl(210, 8%, 85%);
        white-space: nowrap;

        .name,
        .author {
            display: flex;
            padding: 0 1rem;

            .text {
                flex: 1 0 auto;
                text-align: center;
            }
        }
    }

    .image_box {
        flex: 1 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 10px;
    }
`;
