"use client";
import React, { useCallback, useState } from "react";
import styled from "@emotion/styled";

import useInput from "@/hooks/useInput";
import Modal from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { useRouter } from "next/navigation";
import { useRoom } from "@/hooks/useRoom";
import { useFriend } from "@/hooks/useFriend";

const CreateRoomModal = () => {
    const router = useRouter();
    const [isRequestStage, setRequestStage] = useState(false);
    const [checkedMemberList, setCheckedMemberList] = useState<number[]>([]);
    const [roomName, setRoomName, handleRoomName] = useInput("");

    const { createRoom } = useRoom();
    const { data: friendList } = useFriend();

    const onClickCheckForm = useCallback(() => {
        if (!roomName) {
            alert("방이름이 입력되지 않았습니다.");
            return;
        } else {
            setRequestStage(true);
        }
    }, [roomName]);

    const onClickRequestForm = useCallback(async () => {
        createRoom({ userlist: checkedMemberList, title: roomName });
        router.back();
    }, [createRoom, checkedMemberList, router, roomName]);

    const onChangeMemberList =
        (memberId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.checked) {
                setCheckedMemberList((prev) => [...prev, memberId]);
            } else {
                setCheckedMemberList((prev) => {
                    const filteredList = prev.filter(
                        (data) => data !== memberId
                    );
                    return filteredList;
                });
            }
        };

    return (
        <Modal>
            <Container>
                <div className="title">방 만들기</div>
                <ModalInputBox>
                    <label htmlFor="roomName" className="subtitle">
                        생성할 방 이름
                    </label>
                    <input
                        type="text"
                        className={`modal_input ${
                            isRequestStage && `disabled-input`
                        }`}
                        id="roomName"
                        onChange={handleRoomName}
                        value={roomName}
                        readOnly={isRequestStage}
                        style={{
                            backgroundColor: `${
                                isRequestStage ? "#ced6e0" : ""
                            }`,
                        }}
                    />
                </ModalInputBox>
                <ModalInputBox>
                    <label className="subtitle">초대할 멤버 목록</label>
                    <div
                        className={`check_group ${
                            isRequestStage && `disabled-input`
                        }`}
                        style={{
                            backgroundColor: `${
                                isRequestStage ? "#ced6e0" : ""
                            }`,
                        }}
                    >
                        {!friendList ? (
                            <div>로딩중...</div>
                        ) : friendList.length === 0 ? (
                            <p>초대할 멤버가 없습니다...</p>
                        ) : (
                            friendList.map((data) => (
                                <label
                                    key={data.id}
                                    htmlFor={`${data.id}`}
                                    className={`checkbox ${
                                        isRequestStage && `disabled-input`
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        className="checkbox_input"
                                        id={`${data.id}`}
                                        disabled={isRequestStage}
                                        onChange={onChangeMemberList(data.id)}
                                    />
                                    <span className="check_shape"></span>
                                    <span className="checkbox_text">
                                        {data.name}
                                    </span>
                                </label>
                            ))
                        )}
                    </div>
                </ModalInputBox>
                <div className="button_group">
                    {!isRequestStage ? (
                        <Button
                            onClick={onClickCheckForm}
                            style={{
                                display: "block",
                                width: "60%",
                                height: "40px",
                                margin: "0 auto",
                                fontSize: "18px",
                            }}
                        >
                            확인
                        </Button>
                    ) : (
                        <>
                            <Button
                                onClick={() => setRequestStage(false)}
                                style={{
                                    height: "40px",
                                    fontSize: "18px",
                                }}
                            >
                                이전
                            </Button>
                            <Button
                                onClick={onClickRequestForm}
                                style={{
                                    height: "40px",
                                    fontSize: "18px",
                                }}
                            >
                                생성하기
                            </Button>
                        </>
                    )}
                </div>
            </Container>
        </Modal>
    );
};

export default CreateRoomModal;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    padding: 1.5rem;
    box-sizing: border-box;

    .title {
        text-align: center;
        font-size: 1.2rem;
    }

    .button_group {
        display: flex;
        justify-content: space-evenly;
    }
`;

const ModalInputBox = styled.div`
    .disabled-input {
        cursor: not-allowed !important;
    }

    .subtitle {
        font-size: 14px;
        margin-bottom: 5px;
        font-weight: 500;
        color: #1a3b5d;
        width: 100%;
        display: block;
        user-select: none;
    }

    .check_group {
        counter-reset: total;
        counter-reset: checked;
        height: 250px;
        padding: 1.5rem;

        border-radius: 0.5rem;
        border: 1px solid #3b4856;
        box-sizing: border-box;
        overflow: auto;

        .checkbox {
            counter-increment: total;
            display: flex;
            align-items: center;
            width: fit-content;

            margin: auto;
            cursor: pointer;

            &:not(:first-of-type) {
                margin-top: 0.75rem;
            }

            .checkbox_input {
                display: none;

                & + .check_shape {
                    position: relative;
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    margin-top: 1px;
                    border: 3px solid #707070;
                }

                &:checked + .check_shape::after {
                    content: "✔";
                    width: 15px;
                    height: 15px;
                    text-align: center;
                    position: absolute;
                    left: 0;
                    top: 0;
                    font-size: 12px;
                    font-weight: bolder;
                }
            }

            .checkbox_text {
                margin-left: 0.5rem;
            }
        }
    }

    .modal_input {
        width: 100%;
        height: 50px;

        box-sizing: border-box;
        border-radius: 5px;
        box-shadow: none;
        border: 1px solid #ced6e0;
        transition: all 0.3s ease-in-out;
        font-size: 18px;
        padding: 5px 15px;
        background: none;
        color: #1a3b5d;

        &:hover {
            border-color: #3d9cff;
        }
    }
`;
