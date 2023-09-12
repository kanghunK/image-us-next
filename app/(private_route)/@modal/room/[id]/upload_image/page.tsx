"use client";
import styled from "@emotion/styled";
import UploadImageModal from "@/components/UploadImageModal";

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

export default function UploadImage({ params }: { params: { id: string } }) {
    return <UploadImageModal roomId={params.id} />;
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
