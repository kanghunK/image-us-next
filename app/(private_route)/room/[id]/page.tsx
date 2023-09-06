"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { useImage } from "@/states/stores/roomData";
import ImageCard from "@/components/ImageCard";
import { PiUploadThin } from "react-icons/pi";
import { usePathname, useRouter } from "next/navigation";
import { AiOutlineMenuUnfold } from "react-icons/ai";

export default function Page({ params }: { params: { id: string } }) {
    const router = useRouter();
    const currentPath = usePathname();

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
        <Wrapper>
            <Container>
                {imageList.map((imageData) => (
                    <ImageCard key={imageData.id} imageData={imageData} />
                ))}
            </Container>
            <UploadBox
                onClick={() => router.push(currentPath + "/upload_image")}
            >
                <PiUploadThin />
                <div>이미지 업로드하기</div>
            </UploadBox>
        </Wrapper>
    );
}

const NoImage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Wrapper = styled.div`
    padding: 50px 0;
    box-sizing: border-box;
`;

const Container = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 200px));
    justify-content: center;
    gap: 3rem;
    padding: 0 2rem;
`;

const UploadBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 70%;
    margin: 50px auto 0 auto;
    gap: 0.5rem;
    padding: 1rem;

    user-select: none;
    cursor: pointer;
    border-radius: 0.4rem;
    color: hsla(240, 7%, 70%, 1);
    border: 4px dashed hsla(240, 7%, 70%, 0.35);

    &:hover {
        background-color: hsla(240, 7%, 70%, 0.22);
    }

    svg {
        width: 70px;
        height: 70px;
    }
`;
