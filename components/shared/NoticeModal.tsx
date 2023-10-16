import React from "react";
import styled from "@emotion/styled";

interface Props {
    id: number;
    icon: React.ReactNode;
    title: string;
    content: string;
    okHandler: () => void;
}

export default function NoticeModal({
    id,
    icon,
    title,
    content,
    okHandler,
}: Props) {
    return (
        <Container idNum={id}>
            <input id={`modal_toggle_${id}`} type="checkbox"></input>
            <label htmlFor={`modal_toggle_${id}`} className="label_icon">
                {icon}
            </label>
            <label
                className="modal_backdrop"
                htmlFor={`modal_toggle_${id}`}
            ></label>
            <div className="modal_content">
                <label className="modal_close" htmlFor={`modal_toggle_${id}`}>
                    &#x2715;
                </label>
                <h2>{title}</h2>
                <hr />
                <p className="modal_content_text">{content}</p>
                <label
                    className="modal_content_btn ok_button"
                    onClick={okHandler}
                    htmlFor={`modal_toggle_${id}`}
                >
                    확인
                </label>
                <label
                    className="modal_content_btn"
                    htmlFor={`modal_toggle_${id}`}
                >
                    취소
                </label>
            </div>
        </Container>
    );
}

const Container = styled.div<{ idNum: number }>`
    width: 100%;
    height: 100%;

    .label_icon {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    #modal_toggle_${({ idNum }) => idNum} {
        display: none;
    }

    .modal_content,
    .modal_backdrop {
        height: 0;
        width: 0;
        opacity: 0;
        visibility: hidden;
        overflow: hidden;
        cursor: pointer;
        transition: opacity 0.2s ease-in;
    }

    .modal_content {
        .modal_content_text {
            margin-top: 2rem;
            text-align: center;
            font-size: 18px;
        }

        .modal_close {
            color: #aaa;
            position: absolute;
            right: 5px;
            top: 5px;
            padding-top: 3px;
            background: #fff;
            font-size: 16px;
            width: 25px;
            height: 25px;
            font-weight: bold;
            text-align: center;
            cursor: pointer;

            &:hover {
                color: #333;
            }
        }

        .modal_content_btn {
            position: absolute;
            text-align: center;
            cursor: pointer;
            bottom: 20px;
            right: 30px;
            background: #446cb3;
            color: #fff;
            width: 50px;
            border-radius: 2px;
            font-size: 14px;
            height: 32px;
            padding-top: 9px;
            font-weight: normal;

            &:hover {
                color: #fff;
                background: #365690;
            }
        }

        .ok_button {
            margin-right: 75px;
        }
    }

    #modal_toggle_${({ idNum }) => idNum}.active ~ .modal_backdrop,
    #modal_toggle_${({ idNum }) => idNum}:checked ~ .modal_backdrop {
        background-color: rgba(0, 0, 0, 0.6);
        width: 100vw;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9;
        visibility: visible;
        opacity: 1;
        transition: opacity 0.2s ease-in;
    }

    #modal_toggle_${({ idNum }) => idNum}.active ~ .modal_content,
    #modal_toggle_${({ idNum }) => idNum}:checked ~ .modal_content {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 999;

        max-width: 400px;
        width: 300px;
        height: 230px;
        padding: 10px 30px;
        opacity: 1;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 3px 7px rgba(0, 0, 0, 0.6);
        cursor: auto;
        pointer-events: auto;
        visibility: visible;
    }
`;
