"use client";

import React, { useEffect, useState } from "react";
import { PiUploadThin } from "react-icons/pi";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import styled from "@emotion/styled";

import ImageCard from "@/components/ImageCard";
import useIntersect from "@/hooks/useIntersect";
import { useImage } from "@/hooks/useImage";
import { useUserData, useUserImageList } from "@/states/stores/userData";

export default function MyPicture() {
    const router = useRouter();
    const currentPath = usePathname();
    const [userData] = useUserData();

    const [startNum, setStartNum] = useState(0);
    const [userImageList, setUserImageList] = useUserImageList();
    const {
        isLoading: isImageLoading,
        imageLoadEnd,
        setImageLoadEnd,
        loadUserImagelist,
    } = useImage();

    const observerRef = useIntersect(
        async (entry, observer) => {
            observer.unobserve(entry.target);
            if (isImageLoading || imageLoadEnd) return;
            fetchImageToList(startNum);
        },
        {
            threshold: 0.5,
        }
    );

    const fetchImageToList = async (fetchNum: number) => {
        try {
            const userId = userData?.user_info?.id;

            const newImageList = await loadUserImagelist(userId, fetchNum);

            if (fetchNum === 0) {
                setUserImageList(() => [...newImageList]);
            } else {
                setUserImageList((prev) => [...prev, ...newImageList]);
            }
            setStartNum((prev) => prev + 12);
        } catch (error) {
            throw error;
        }
    };

    const resetImageList = async () => {
        setUserImageList([]);
        setImageLoadEnd(false);
    };

    useEffect(() => {
        try {
            fetchImageToList(startNum);
        } catch (error) {
            throw error;
        }
        return () => {
            resetImageList();
        };
    }, []);

    return (
        <Wrapper>
            {userImageList.length === 0 ? (
                <NoImage>
                    <Image
                        src="/no_image.png"
                        width={500}
                        height={500}
                        alt="이미지 없음"
                    />
                    <p style={{ fontSize: "1.2rem" }}>
                        등록된 이미지가 없습니다.
                    </p>
                </NoImage>
            ) : (
                <Container>
                    {userImageList.map((imageData, i) => (
                        <ImageCard
                            key={imageData.id}
                            imageData={imageData}
                            observerRef={
                                i === userImageList.length - 1
                                    ? observerRef
                                    : null
                            }
                        />
                    ))}
                </Container>
            )}
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
