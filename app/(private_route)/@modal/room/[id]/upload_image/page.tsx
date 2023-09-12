"use client";

import React, { useRef, useState } from "react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { LuPictureInPicture } from "react-icons/lu";
import styled from "@emotion/styled";
import Modal from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { IconContext } from "react-icons/lib";
import { PiFilePlusThin } from "react-icons/pi";
import useInput from "@/hooks/useInput";
import { useImage } from "@/hooks/useImage";

const acceptableType = [
    "image/HEIF",
    "image/heif",
    "image/JPEG",
    "image/jpeg",
    "image/JPG",
    "image/jpg",
    "image/GIF",
    "image/gif",
    "image/PDF",
    "image/pdf",
    "image/PNG",
    "image/png",
];

export default function UploadModal({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { uploadRoomImage } = useImage();
    const roomId = params.id;

    const [uploadImageFile, setUploadImageFile] = useState<FormData | null>(
        null
    );
    const [uploadFileName, setUploadFileName, handleUploadFileName] =
        useInput("");
    const [showImageCover, setShowImageCover] = useState(false);
    const [imageData, setImageData] = useState<HTMLImageElement | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formData: any = new FormData();

        if (e.target.files) {
            if (e.target.files.length === 0) return;
            for (let i = 0; i < e.target.files.length; i++) {
                if (acceptableType.includes(e.target.files[i].type)) {
                    formData.append("image", e.target.files[i]);
                    setUploadFileName(e.target.files[i].name);
                } else {
                    alert(
                        "jpg, png, pdf, gif, jpeg, heif 형식만 업로드 가능합니다."
                    );
                    return;
                }
            }
            const image = new Image();
            image.src = URL.createObjectURL(formData.get("image"));

            setImageData(image);
            setUploadImageFile(formData);
        }
    };

    const onDropData = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const formData: any = new FormData();
        if (e.dataTransfer.items) {
            for (let i = 0; i < e.dataTransfer.items.length; i++) {
                if (
                    e.dataTransfer.items[i].kind === "file" &&
                    acceptableType.includes(e.dataTransfer.items[i].type)
                ) {
                    const file = e.dataTransfer.items[i].getAsFile();
                    formData.append("image", file);
                } else {
                    alert(
                        "jpg, png, pdf, gif, jpeg, heif 형식만 업로드 가능합니다."
                    );
                    return;
                }
            }
        } else {
            for (let i = 0; i < e.dataTransfer.files.length; i++) {
                if (acceptableType.includes(e.dataTransfer.files[i].type)) {
                    formData.append("image", e.dataTransfer.files[i]);
                } else {
                    alert(
                        "jpg, png, pdf, gif, jpeg, heif 형식만 업로드 가능합니다."
                    );
                    return;
                }
            }
        }
        const image = new Image();
        const imageFormData = formData.get("image");
        image.src = URL.createObjectURL(imageFormData);

        setUploadFileName(imageFormData.name);
        setImageData(image);
        setUploadImageFile(formData);
        setShowImageCover(false);
    };

    const onClickUploadImg = async () => {
        if (uploadImageFile) await uploadRoomImage(roomId, uploadImageFile);
        router.back();
    };

    return (
        <Modal>
            <Container>
                <div className="title">이미지 업로드</div>
                <div
                    className="preview"
                    onDrop={onDropData}
                    onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        setShowImageCover(true);
                    }}
                    ref={previewRef}
                >
                    <IconContext.Provider value={{ size: "60px" }}>
                        {!showImageCover ? (
                            !imageData ? (
                                <div className="preview_icon_box">
                                    <LuPictureInPicture />
                                    <p>이미지를 올려놓으세요</p>
                                </div>
                            ) : (
                                <NextImage
                                    src={imageData.src}
                                    alt="미리보기 이미지"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                    width={300}
                                    height={300}
                                />
                            )
                        ) : (
                            <div className="upload_cover">
                                <PiFilePlusThin />
                            </div>
                        )}
                    </IconContext.Provider>
                </div>
                <div className="file_search">
                    <input
                        className="upload_name"
                        value={uploadFileName}
                        placeholder="첨부파일"
                        readOnly
                    />
                    <label htmlFor="file">파일찾기</label>
                    <input type="file" id="file" onChange={handleInputFile} />
                </div>
                <div className="button_group">
                    <Button onClick={onClickUploadImg}>업로드</Button>
                    <Button onClick={() => router.back()}>취소</Button>
                </div>
            </Container>
        </Modal>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    width: 65%;
    max-width: 650px;
    min-width: 300px;
    padding: 15px;
    box-sizing: border-box;

    border-radius: 10px;
    background: #fff;
    box-shadow: 0 30px 60px 0 rgba(90, 116, 148, 0.4);

    .title {
        margin-bottom: 10px;
        text-align: center;
        font-size: 1.2rem;
    }

    .preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        height: 500px;

        color: hsla(240, 7%, 70%, 1);
        user-select: none;

        .preview_icon_box {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }

    .file_search {
        display: flex;
        justify-content: center;
        margin: 15px 0;

        .upload_name {
            display: inline-block;
            height: 40px;
            padding: 0 10px;
            vertical-align: middle;
            border: 1px solid #dddddd;
            width: 60%;
            color: #999999;
        }

        label {
            display: inline-block;
            padding: 10px 20px;
            color: #fff;
            vertical-align: middle;
            background-color: #999999;
            cursor: pointer;
            margin-left: 10px;
        }

        input[type="file"] {
            position: absolute;
            width: 0;
            height: 0;
            padding: 0;
            overflow: hidden;
            border: 0;
        }
    }

    .button_group {
        display: flex;
        justify-content: space-evenly;
    }
`;
