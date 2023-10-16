import React from "react";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { IconContext } from "react-icons/lib";
import { BiDownload } from "react-icons/bi";

import styled from "@emotion/styled";
import { ImageInfo } from "@/lib/types";
import { useUserData } from "@/states/stores/userData";
import DeleteImageBtn from "./DeleteImageBtn";

interface Props {
    imageData: ImageInfo;
    observerRef: React.MutableRefObject<null> | null;
}

export default function ImageCard({ imageData, observerRef }: Props) {
    const router = useRouter();
    const params = useParams();
    const currentPath = usePathname();
    const [userData] = useUserData();

    return (
        <Wrapper ref={observerRef}>
            <div
                className="image_box"
                onClick={() =>
                    router.push(`${currentPath}/detail_photo/${imageData.id}`)
                }
            >
                <Image
                    src={imageData.link}
                    alt={imageData.fileName + " 이미지"}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                    width={300}
                    height={300}
                />
            </div>
            <IconContext.Provider
                value={{
                    size: "22px",
                    color: "rgba(0, 0, 0, 0.88)",
                    style: {
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                    },
                }}
            >
                <div className="button_box">
                    <div className="download_btn">
                        <a href={imageData.link} download={imageData.fileName}>
                            <BiDownload />
                        </a>
                    </div>
                    {userData?.user_info?.id === imageData.user_id && (
                        <div className="delete_btn">
                            <DeleteImageBtn
                                isRoom={params?.id ? true : false}
                                imageId={imageData.id}
                            />
                        </div>
                    )}
                </div>
            </IconContext.Provider>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    box-sizing: border-box;

    height: 250px;
    margin: 0;
    padding: 0;

    border: 1px solid #f0f0f0;
    border-radius: 8px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.88);
    transition: box-shadow 0.2s, border-color 0.2s;
    background: #fff;
    cursor: pointer;
    overflow: hidden;

    &:hover {
        border: transparent;
        box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16),
            0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
    }

    .image_box {
        display: flex;
        flex: 4;
        overflow: hidden;
    }

    .button_box {
        display: flex;
        flex: 1;

        & > div {
            position: relative;
            flex: 1;
        }

        .download_btn {
            border-right: 1px solid #f0f0f0;

            &:hover {
                background-color: #f0f0f0;
            }

            & > a {
                display: inline-block;
                width: 100%;
                height: 100%;
            }
        }

        .delete_btn {
            &:hover {
                background-color: #f07070;
                svg {
                    color: white !important;
                }
            }
        }
    }
`;
