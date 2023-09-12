"use client";

import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Modal from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { DFriendData, RoomData } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useRoom } from "@/hooks/useRoom";
import { useFriend } from "@/hooks/useFriend";

export default function InviteMemberModal({
    params,
}: {
    params: { id: string };
}) {
    const router = useRouter();
    const { data: roomlist } = useRoom();
    const { data: friendlist, inviteMemberToRoom } = useFriend();
    const [filteredMemberlist, setFilteredMemberlist] = useState<
        DFriendData[] | null
    >();
    const [checkedMemberList, setCheckedMemberList] = useState<number[]>([]);
    const [roomData, setRoomData] = useState<RoomData | null>(null);

    useEffect(() => {
        try {
            if (roomlist && friendlist) {
                const findRoomData = roomlist.find(
                    (data) => "" + data.id === params.id
                );
                if (!findRoomData)
                    throw new Error(
                        "방을 찾을 수 없습니다.. 다시 시도해주세요."
                    );
                const filterMemberlist = friendlist?.filter((friendData) =>
                    findRoomData.userlist.find(
                        (data) => data.id === friendData.id
                    )
                );
                setFilteredMemberlist([...filterMemberlist]);
                setRoomData(findRoomData);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            }
            router.back();
        }
    }, [roomlist, router, friendlist, params.id]);

    const onChangeMemberlist =
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

    const onClickInviteMember = async () => {
        if (checkedMemberList.length === 0) {
            alert("초대할 멤버를 선택하지 않았습니다..");
            return;
        }
        inviteMemberToRoom(params.id, [...checkedMemberList]);
        router.back();
    };

    return (
        <Modal>
            <Container>
                <div className="title">{`${roomData?.title}방에 멤버 초대하기`}</div>
                <div className="member_list">
                    <label className="subtitle">멤버 목록</label>
                    <div className="check_group">
                        {!filteredMemberlist ? (
                            <div>로딩중...</div>
                        ) : filteredMemberlist.length === 0 ? (
                            <p>초대할 멤버가 없습니다...</p>
                        ) : (
                            filteredMemberlist.map((data) => (
                                <label
                                    key={data.id}
                                    htmlFor={`${data.id}`}
                                    className="checkbox"
                                >
                                    <input
                                        type="checkbox"
                                        className="checkbox_input"
                                        id={`${data.id}`}
                                        onChange={onChangeMemberlist(data.id)}
                                    />
                                    <span className="check_shape"></span>
                                    <span className="checkbox_text">
                                        {data.name}
                                    </span>
                                </label>
                            ))
                        )}
                    </div>
                </div>
                <div className="button_group">
                    <Button onClick={onClickInviteMember}>초대하기</Button>
                    <Button onClick={() => router.back()}>취소</Button>
                </div>
            </Container>
        </Modal>
    );
}

const Container = styled.div`
    position: relative;
    width: 50%;
    max-width: 570px;
    min-width: 300px;
    height: 510px;
    padding: 15px;
    box-sizing: border-box;

    border-radius: 10px;
    background: #fff;
    box-shadow: 0 30px 60px 0 rgba(90, 116, 148, 0.4);

    .title {
        text-align: center;
        margin-bottom: 40px;
        font-size: 1.2rem;
    }

    .member_list {
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
            height: 320px;
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
    }

    .button_group {
        position: absolute;
        bottom: 30px;
        display: flex;
        justify-content: space-evenly;
        width: calc(100% - 30px);
    }
`;
