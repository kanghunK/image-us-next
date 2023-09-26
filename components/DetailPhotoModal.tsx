"use client";

import React, { useCallback, useEffect, useState } from "react";
import NextImage from "next/image";
import styled from "@emotion/styled";
import { ImageInfo } from "@/lib/types";
import Modal from "./shared/Modal";

export default function DetailPhotoModal({
    imageData,
}: {
    imageData?: ImageInfo;
}) {
    const ImageResizer = ({ imageData }: { imageData: ImageInfo }) => {
        const [imageCSS, setImageCSS] = useState<React.CSSProperties>();
        const img = new Image();
        img.src = imageData?.link;

        const handleResize = useCallback(() => {
            const innerWidth = window.innerWidth;
            const innerHeight = window.innerHeight;
            const ratio = img.naturalWidth / img.naturalHeight;
            const imgWidth = innerWidth * 0.7 > 550 ? 550 : innerWidth * 0.7;
            const imgHeight = innerHeight * 0.7 > 500 ? 500 : innerHeight * 0.7;
            const maxImgWidth = imgHeight * ratio;

            setImageCSS({
                width: `${imgWidth}px`,
                height: "auto",
                maxWidth: `${maxImgWidth}px`,
                objectFit: "contain",
            });
        }, [img.naturalWidth, img.naturalHeight]);

        useEffect(() => {
            handleResize();
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, [handleResize]);

        return (
            <NextImage
                src={imageData.link}
                alt={imageData.fileName}
                style={imageCSS}
                width={300}
                height={300}
            />
        );
    };

    return (
        <Modal scroll={false} width="auto" height="fit-content">
            <Container>
                <div className="photo_info">
                    {imageData?.user_name && (
                        <div className="author">
                            <span>
                                <b>작성자</b>:{" "}
                            </span>
                            <span className="text">{imageData.user_name}</span>
                        </div>
                    )}
                    <div className="name">
                        <span>
                            <b>파일명</b>:{" "}
                        </span>
                        <span className="text">{imageData?.fileName}</span>
                    </div>
                </div>
                <div className="image_box">
                    {imageData && <ImageResizer imageData={imageData} />}
                </div>
            </Container>
        </Modal>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    border-radius: 10px;
    overflow: hidden;

    .photo_info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.5rem;
        height: 80px;
        border-bottom: 1px solid hsl(210, 8%, 85%);
        white-space: nowrap;
        padding: 1rem;
        box-sizing: border-box;

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
        display: flex;
        justify-content: center;

        line-height: 0;
    }

    @media screen and (max-width: 600px) {
        .photo_info {
            .author,
            .name {
                padding: 0;
            }
        }
    }
`;
