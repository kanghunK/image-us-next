import { useCallback, useState } from "react";
import { IconContext } from "react-icons/lib";
import { useRouter } from "next/navigation";
import { FaUserPlus } from "react-icons/fa";

import styled from "@emotion/styled";
import { RoomData } from "@/lib/types";
import ExitRoomBtn from "./ExitRoomBtn";

interface CardProps {
    roomData: RoomData;
    index: number;
}

export default function Card({ roomData, index }: CardProps) {
    const router = useRouter();

    const onClickNavigateRoom = useCallback(
        (roomId: number) => () => {
            router.push(`room/${roomId}`);
        },
        [router]
    );

    return (
        <Wrapper>
            <div className="info">
                <div className="room_title_d">
                    <span className="tag">방 제목</span>
                    <div className="room_title">{roomData.title}</div>
                </div>
                <div className="member_d">
                    <span className="tag">멤버들</span>
                    <div className="members">
                        {roomData.userlist.slice(0, 3).map((data) => (
                            <span key={data.id} className="member">
                                {data.name}
                            </span>
                        ))}
                        ...
                    </div>
                </div>
                <div className="access_d">
                    <div
                        className="access_btn"
                        onClick={onClickNavigateRoom(roomData.id)}
                    >
                        입장하기
                    </div>
                </div>
                <div className="btn_group">
                    <IconContext.Provider
                        value={{
                            size: "22px",
                            color: "rgba(0, 0, 0, 0.45)",
                        }}
                    >
                        <div className="exit_room_btn">
                            <ExitRoomBtn roomId={roomData.id} />
                        </div>
                        <div
                            className="invite_member_btn"
                            onClick={() =>
                                router.push(`room/${roomData.id}/invite_member`)
                            }
                        >
                            <FaUserPlus />
                        </div>
                    </IconContext.Provider>
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    float: left;
    width: 200px;
    overflow: hidden;
    border-radius: 11px;
    border: 1px solid #ddd;

    .tag {
        padding: 0.125rem 0.625rem;
        margin-right: 15px;

        border-radius: 0.25rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: rgb(55 48 163);
        background-color: rgb(224 231 255);
    }

    .thumb {
        float: left;
        width: 100%;
        overflow: hidden;
        position: relative;
    }

    .info {
        float: left;
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;

        .room_title_d {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            padding-left: 1rem;

            .room_title {
                margin: 0;
                color: #000;
                font-size: 19px;
                font-weight: bold;
            }
        }

        .member_d {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;
            margin-top: 0.5rem;
            padding-left: 1rem;

            .members {
                display: flex;
                gap: 0.4rem;

                .member {
                    color: #666;
                    font-size: 14px;
                }
            }
        }

        .access_d {
            margin-top: 1.5rem;

            &::after {
                display: block;
                content: "";
                clear: both;
            }

            .access_btn {
                float: right;
                display: table;
                width: auto;
                height: auto;
                padding: 10px 20px;
                background: #f6e5cb;
                color: #000;
                font-size: 14px;
                border-radius: 20px;
                transition: 0.6s;
                cursor: pointer;

                &:hover {
                    background: #000;
                    color: #fff;
                }
            }
        }

        .btn_group {
            display: flex;
            justify-content: space-around;
            height: 35px;
            margin-top: 1rem;

            .exit_room_btn {
                flex: 1;
                display: flex;
                justify-content: center;
                border-radius: 11px;

                &:hover {
                    background-color: #f07070;
                    svg {
                        color: white !important;
                    }
                }
            }

            .invite_member_btn {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 11px;
                cursor: pointer;

                &:hover {
                    background-color: #f0c2a7;
                }
            }
        }
    }

    @media screen and (min-width: 400px) {
        width: 300px;

        .info {
            padding: 20px;
        }
    }
`;
