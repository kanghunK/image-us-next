"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/shared/Modal";
import styled from "@emotion/styled";
import Image from "next/image";
import { useImage } from "@/states/stores/roomData";
import { ImageInfo } from "@/lib/types";

export default function DetailPhotoModal({
    params,
}: {
    params: { id: string; imageId: string };
}) {
    const { data: imageList } = useImage({
        roomId: params.id,
    });
    const [imageData, setImageData] = useState<ImageInfo>();

    useEffect(() => {
        setImageData(() => {
            const currentImageData = imageList.find(
                (data) => "" + data.id === params.imageId
            );
            return currentImageData;
        });
    }, [imageList, params.imageId]);

    return (
        <Modal>
            <Container>
                <div className="photo_info">
                    <div className="author">
                        <div className="label">
                            <b>작성자</b>:
                        </div>
                        <div className="text">{imageData?.user_name}</div>
                    </div>
                    <div className="name">
                        <div className="label">
                            <b>파일명</b>:
                        </div>
                        <div className="text">{imageData?.fileName}</div>
                    </div>
                </div>
                <div className="image_box">
                    {imageData && (
                        <Image
                            src={imageData?.link}
                            alt={imageData?.fileName}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                            }}
                            width={300}
                            height={300}
                        />
                    )}
                </div>
            </Container>
        </Modal>
    );
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
