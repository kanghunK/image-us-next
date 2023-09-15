"use client";

import React, { useEffect, useState, useCallback } from "react";
import styled from "@emotion/styled";
import Modal from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { DFriendData, RoomData } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useRoom } from "@/hooks/useRoom";
import { useFriend } from "@/hooks/useFriend";
import { useUserData } from "@/states/stores/userData";
import Scrollbars from "react-custom-scrollbars-2";
import { FaCrown } from "react-icons/fa";
import { PiFinnTheHumanFill } from "react-icons/pi";
import { MdPersonOff } from "react-icons/md";
import SearchBox from "@/components/SearchBox";

export default function InviteMemberModal({
    params,
}: {
    params: { id: string };
}) {
    const router = useRouter();
    const { data: roomList, inviteMemberToRoom, forceOutMember } = useRoom();
    const [userData] = useUserData();
    const { data: userFriendList } = useFriend();
    const [filteredMemberlist, setFilteredMemberlist] = useState<
        DFriendData[] | null
    >();
    const [checkedMemberList, setCheckedMemberList] = useState<DFriendData[]>(
        []
    );
    const [roomData, setRoomData] = useState<RoomData | null>(null);

    useEffect(() => {
        try {
            if (roomList && userFriendList) {
                const findRoomData = roomList.find(
                    (data) => "" + data.id === params.id
                );
                if (!findRoomData)
                    throw new Error(
                        "방을 찾을 수 없습니다.. 다시 시도해주세요."
                    );

                console.log("데이터 확인: ", userFriendList, findRoomData);
                const filterMemberlist = userFriendList?.filter(
                    (friendData) =>
                        !findRoomData.userlist.some(
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
    }, [roomList, router, userFriendList, params.id]);

    const onChangeMemberlist =
        (memberData: DFriendData) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.checked) {
                setCheckedMemberList((prev) => [...prev, memberData]);
            } else {
                setCheckedMemberList((prev) => {
                    const filteredList = prev.filter(
                        (data) => data.id !== memberData.id
                    );
                    return filteredList;
                });
            }
        };

    const onClickInviteMember = async () => {
        if (checkedMemberList.length === 0) {
            alert("선택된 멤버가 없습니다...");
            return;
        }

        const checkedMemberIdList = checkedMemberList.map((data) => data.id);

        inviteMemberToRoom(params.id, [...checkedMemberIdList]);
    };

    const onClickForceOutMember = async (memberId: string) => {
        const roomId = params.id;

        await forceOutMember(roomId, memberId);
    };

    return (
        <Modal>
            <Wrapper>
                <div className="title">{`${roomData?.title} 친구관리`}</div>
                <div className="tab_box">
                    <Tab>
                        <input
                            type="radio"
                            name="friend_management"
                            id="memberList"
                            defaultChecked
                        />
                        <label className="subtitle" htmlFor="memberList">
                            멤버 목록
                        </label>
                        <div className="member_list tab_content">
                            <Scrollbars>
                                <div className="container">
                                    {roomData?.userlist.map((memberData) => (
                                        <div
                                            key={memberData.id}
                                            className="member"
                                        >
                                            {roomData.host_user_id ===
                                            memberData.id ? (
                                                <FaCrown />
                                            ) : (
                                                <PiFinnTheHumanFill />
                                            )}
                                            <span>{memberData.name}</span>
                                            {roomData.host_user_id !==
                                                memberData.id &&
                                            roomData.host_user_id ===
                                                userData.user_info?.id ? (
                                                <Button
                                                    style={{
                                                        fontSize: "0.8rem",
                                                    }}
                                                    className="error"
                                                    onClick={() =>
                                                        onClickForceOutMember(
                                                            "" + memberData.id
                                                        )
                                                    }
                                                >
                                                    강퇴하기
                                                </Button>
                                            ) : (
                                                <div>
                                                    <b>방장</b>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Scrollbars>
                        </div>
                    </Tab>
                    <Tab>
                        <input
                            type="radio"
                            name="friend_management"
                            id="inviteFriends"
                        />
                        <label className="subtitle" htmlFor="inviteFriends">
                            초대할 친구목록
                        </label>
                        <InviteFriendsBox className="tab_content">
                            <div className="container">
                                <div className="check_group">
                                    <Scrollbars>
                                        {!filteredMemberlist ? (
                                            <div>로딩중...</div>
                                        ) : filteredMemberlist.length === 0 ? (
                                            <div className="no_member">
                                                <p>초대할 멤버가 없습니다...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <MemberListToInvite>
                                                    <div className="sub_heading">
                                                        초대할 멤버목록
                                                    </div>
                                                    <div className="member_list">
                                                        <div className="layout">
                                                            {filteredMemberlist.map(
                                                                (data) => (
                                                                    <label
                                                                        key={
                                                                            data.id
                                                                        }
                                                                        htmlFor={`${data.id}`}
                                                                        className="checkbox"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="checkbox_input"
                                                                            id={`${data.id}`}
                                                                            onChange={onChangeMemberlist(
                                                                                data
                                                                            )}
                                                                        />
                                                                        <span className="check_shape"></span>
                                                                        <span className="checkbox_text">
                                                                            {
                                                                                data.name
                                                                            }
                                                                        </span>
                                                                    </label>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </MemberListToInvite>
                                                <SelectedMemberList>
                                                    <div className="sub_heading">
                                                        선택한 멤버들
                                                    </div>
                                                    <div className="select_members">
                                                        {checkedMemberList.map(
                                                            (memberData) => (
                                                                <span
                                                                    key={
                                                                        memberData.id
                                                                    }
                                                                    className="member_tag"
                                                                >
                                                                    {
                                                                        memberData.name
                                                                    }
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </SelectedMemberList>
                                            </>
                                        )}
                                    </Scrollbars>
                                </div>
                                <div className="button_group">
                                    <Button onClick={onClickInviteMember}>
                                        초대하기
                                    </Button>
                                    <Button onClick={() => router.back()}>
                                        취소
                                    </Button>
                                </div>
                            </div>
                        </InviteFriendsBox>
                    </Tab>
                    <Tab>
                        <input
                            type="radio"
                            name="friend_management"
                            id="SearchMember"
                        />
                        <label className="subtitle" htmlFor="SearchMember">
                            멤버 검색
                        </label>
                        <div className="search_member tab_content">
                            <Scrollbars>
                                <SearchBox />
                            </Scrollbars>
                        </div>
                    </Tab>
                </div>
            </Wrapper>
        </Modal>
    );
}

const Wrapper = styled.div`
    .title {
        height: 30px;
        line-height: 30px;
        margin: 20px;
        text-align: center;
        font-size: 1.2rem;
    }

    .tab_box {
        display: flex;
        height: 30px;
        justify-content: space-evenly;
        align-items: center;
    }
`;

const Tab = styled.div`
    input[name="friend_management"] {
        display: none;
    }

    .subtitle {
        position: relative;
        z-index: 1;
        display: inline-block;
        padding: 10px 15px;

        color: #23527c;
        border: 1px solid transparent;
        border-radius: 4px 4px 0 0;
        cursor: pointer;

        &:hover {
            background-color: #ddd;
        }
    }

    input[name="friend_management"]:checked ~ .subtitle {
        color: #555;
        background-color: #fff;
        border: 1px solid #ddd;
        border-bottom-color: transparent;
        cursor: default;
    }

    .tab_content {
        position: absolute;
        left: -9999px;
        clip-path: polygon(0 0, 0 0, 0 0);
        width: 1px;
        height: 1px;
        margin: -1px;

        border: 1px solid #ddd;
        border-radius: 10px;
    }

    input[name="friend_management"]:checked ~ .tab_content {
        clip-path: none;
        left: 0;
        display: block;
        margin: 0px 20px;
        width: calc(100% - 40px);
        height: calc(100% - 135px);
        margin-top: -1px;
    }

    .member_list {
        display: flex;
        flex-direction: column;

        .container {
            padding: 20px 0;

            .member {
                display: flex;
                align-items: center;
                justify-content: space-around;
                margin: 0 20px;
                margin-bottom: 1.2rem;
            }
        }
    }

    .invite_friends {
        .container {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .sub_heading {
            height: 30px;
            padding: 1rem 0;
            margin-left: 30px;
            line-height: 30px;
        }

        .check_group {
            flex: 1 0 auto;
            counter-reset: total;
            counter-reset: checked;

            .no_member {
                height: 100%;
                overflow: hidden;

                &::before {
                    display: block;
                    content: "";
                    clear: both;
                }

                & > p {
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                    text-align: center;
                }
            }

            .select_members_c {
                margin: 1rem 0;
            }

            .select_members {
                display: flex;
                gap: 0.5rem;
                padding: 0 30px;

                .member_tag {
                    padding: 4px 8px;
                    border-radius: 20px;

                    background-color: #f7f8fc;
                    color: #a0a6b5;
                }
            }
        }

        .button_group {
            display: flex;
            align-items: center;
            justify-content: space-evenly;
            width: 100%;
            height: 60px;
            box-shadow: rgba(206, 206, 206, 0.5) 0px -1px 1px 0px;
        }
    }

    .search_member {
        padding: 10px 0;
        box-sizing: border-box;
    }
`;

const MemberListToInvite = styled.div`
    margin: 1rem 0;

    .member_list {
        height: calc(100% - 62px);

        .layout {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            height: 100%;
            box-sizing: border-box;
        }

        .checkbox {
            counter-increment: total;
            display: flex;
            align-items: center;
            width: fit-content;

            margin-left: 3rem;
            cursor: pointer;

            .checkbox_input {
                display: none;

                & + .check_shape {
                    position: relative;
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    margin-top: 1px;
                    border: 3px solid #707070;
                    border-radius: 5px;
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
`;

const InviteFriendsBox = styled.div`
    .container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .sub_heading {
        height: 30px;
        padding: 1rem 0;
        margin-left: 30px;
        line-height: 30px;
    }

    .check_group {
        flex: 1 0 auto;
        counter-reset: total;
        counter-reset: checked;

        .no_member {
            height: 100%;
            overflow: hidden;

            &::before {
                display: block;
                content: "";
                clear: both;
            }

            & > p {
                position: relative;
                top: 50%;
                transform: translateY(-50%);
                text-align: center;
            }
        }
    }

    .button_group {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        width: 100%;
        height: 60px;
        box-shadow: rgba(206, 206, 206, 0.5) 0px -1px 1px 0px;
    }
`;

const SelectedMemberList = styled.div`
    margin: 1rem 0;

    .select_members {
        display: flex;
        gap: 0.5rem;
        padding: 0 30px;

        .member_tag {
            padding: 4px 8px;
            border-radius: 20px;

            background-color: #f7f8fc;
            color: #a0a6b5;
        }
    }
`;
