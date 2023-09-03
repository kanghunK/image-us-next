"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { useImage } from "@/states/stores/roomData";
import ImageCard from "@/components/ImageCard";

export default function Page({ params }: { params: { id: string } }) {
    const [startNum, setStartNum] = useState(0);
    const {
        data: imageList,
        imageLoadError,
        loadImagelist,
    } = useImage({
        roomId: params.id,
    });

    useEffect(() => {
        // setStartNum((prev) => prev + 12);
        // if (startNum >= 12) loadImagelist(startNum);
    }, []);

    if (imageList.length === 0) {
        return (
            <NoImage>
                <Image
                    src="/no_image.png"
                    width={500}
                    height={500}
                    alt="이미지 없음"
                />
                <p style={{ fontSize: "1.2rem" }}>등록된 이미지가 없습니다.</p>
            </NoImage>
        );
    }

    return (
        <Container>
            {imageList.map((imageData) => (
                <ImageCard key={imageData.id} imageData={imageData} />
            ))}
        </Container>
    );
}

const NoImage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Container = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 200px));
    justify-content: center;
    gap: 3rem;
    margin: 50px 0;
    padding: 0 2rem;
`;
