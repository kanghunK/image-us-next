"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { PiUploadThin } from "react-icons/pi";
import styled from "@emotion/styled";

import { PageList } from "@/lib/enumType";
import { ImageInfo } from "@/lib/types";
import ImageCard from "@/components/ImageCard";
import useIntersect from "@/hooks/useIntersect";
import { useImage } from "@/hooks/useImage";
import { useRoomImageList } from "@/states/stores/roomData";
import { useUserData } from "@/states/stores/userData";

export default function Page({ params }: { params: { id: string } }) {
    const [userData, setUserData] = useUserData();
    const [imageList, setImageList] = useRoomImageList();
    const {
        isLoading: isImageLoading,
        imageLoadEnd,
        setImageLoadEnd,
        loadRoomImagelist,
    } = useImage();

    const roomId = params.id;
    const router = useRouter();
    const currentPath = usePathname();
    const [startNum, setStartNum] = useState(0);

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
            const newImageList = (await loadRoomImagelist(
                roomId,
                fetchNum
            )) as ImageInfo[];

            if (fetchNum === 0) {
                setImageList(() => [...newImageList]);
            } else {
                setImageList((prev) => [...prev, ...newImageList]);
            }
            setStartNum((prev) => prev + 12);
        } catch (error) {
            throw error;
        }
    };

    const resetImageList = async () => {
        setImageList([]);
        setImageLoadEnd(false);
    };

    useEffect(() => {
        try {
            const currentRoomData = userData?.roomList?.find(
                (data) => "" + data.id === roomId
            );
            fetchImageToList(startNum);
            setUserData((prev) => ({
                ...prev,
                currentPage: PageList.ImageRoom,
                navigationTitle: currentRoomData?.title ?? "Unknown",
            }));
        } catch (error) {
            throw error;
        }
        return () => {
            resetImageList();
        };
    }, [roomId]);

    return (
        <Wrapper>
            {imageList.length === 0 ? (
                <NoImage>
                    <Image
                        src="/no_image.png"
                        width={300}
                        height={300}
                        alt="이미지 없음"
                    />
                    <p style={{ fontSize: "1.2rem" }}>
                        등록된 이미지가 없습니다.
                    </p>
                </NoImage>
            ) : (
                <Container>
                    {imageList.map((imageData, i) => (
                        <ImageCard
                            key={imageData.id}
                            imageData={imageData}
                            observerRef={
                                i === imageList.length - 1 ? observerRef : null
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
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    min-height: 100%;
    padding: 50px 0;
    box-sizing: border-box;
`;

const Container = styled.div`
    flex: 1 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 250px));
    justify-content: center;

    width: 85%;
    gap: 3rem;
`;

const UploadBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 70%;
    max-width: 800px;
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
