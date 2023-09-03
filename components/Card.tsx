import React, { useState, useCallback } from "react";
import styled from "@emotion/styled";
import { RoomData } from "@/lib/types";
import { IconContext } from "react-icons/lib";
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { FaUserPlus } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import ExitRoomBtn from "./ExitRoomBtn";

interface CardProps {
    roomData: RoomData;
}

export default function Card({ roomData }: CardProps) {
    const router = useRouter();

    const onClickNavigateRoom = useCallback(
        (roomId: number) => () => {
            router.push(`room/${roomId}`);
        },
        [router]
    );

    return (
        <Wrapper>
            <div className="card_body">
                <div
                    className="main_info"
                    onClick={onClickNavigateRoom(roomData.id)}
                >
                    <div className="title">{roomData.title}</div>
                    <div>
                        {roomData.userlist.slice(0, 3).map((data) => (
                            <span key={data.id} className="member">
                                {data.name}
                            </span>
                        ))}
                        ...
                    </div>
                </div>
                <div className="btn_group">
                    <IconContext.Provider
                        value={{
                            size: "22px",
                            color: "rgba(0, 0, 0, 0.45)",
                        }}
                    >
                        <ExitRoomBtn roomId={roomData.id} />
                        <div
                            className="invite_icon"
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
    position: relative;

    width: 300px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 1px 1px 1px rgba(0, 0, 0, 0.2);

    .card_body {
        display: flex;
        border-radius: 8px;
        overflow: hidden;

        .main_info {
            flex: 1 0 auto;
            padding: 15px 0;
            text-align: center;
            cursor: pointer;

            &:hover {
                background-color: wheat;
            }

            .title {
                margin-bottom: 8px;
                font-weight: 600;
                font-size: 24px;
                color: rgba(0, 0, 0, 0.88);
            }

            .member {
                color: rgba(0, 0, 0, 0.45);

                &:not(:last-child) {
                    margin-right: 5px;
                }
            }
        }

        .btn_group {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            width: 50px;

            border-left: 1px solid #f0f0f0;

            .invite_icon {
                display: flex;
                justify-content: center;
                align-items: center;
                flex: 1;
                width: 100%;
                cursor: pointer;

                &:hover {
                    background-color: #f0f0f0;
                }
            }
        }
    }
`;