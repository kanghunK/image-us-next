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
    const [mouseOver, setMouseOver] = useState(false);

    const onClickNavigateRoom = useCallback(
        (roomId: number) => () => {
            router.push(`room/${roomId}`);
        },
        [router]
    );

    return (
        <Wrapper accessBoxHover={mouseOver}>
            <div className="card_body">
                <div className="card_num">{index}</div>
                <div
                    className="main_info"
                    onClick={onClickNavigateRoom(roomData.id)}
                    onMouseOver={() => setMouseOver(true)}
                    onMouseLeave={() => setMouseOver(false)}
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

const Wrapper = styled.div<{ accessBoxHover: boolean }>`
    position: relative;

    width: 250px;
    border: 1px solid #b8b9c9;
    border-radius: 8px;
    background: #fff;
    transition: box-shadow 0.2s, border-color 0.2s;
    ${({ accessBoxHover }) =>
        accessBoxHover
            ? "border-color: transparent; box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);"
            : ""}

    .card_body {
        display: flex;
        align-items: center;
        height: 90px;
        border-radius: 8px;
        overflow: hidden;

        .card_num {
            width: 30px;
            height: 100%;
            line-height: 90px;
            border-right: 1px solid #f0f0f0;
        }

        .main_info {
            flex: 1 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            height: 100%;
            cursor: pointer;

            &:hover {
                background-color: #f8f8ff;
            }

            .title {
                margin-bottom: 8px;
                font-weight: 600;
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
            height: 100%;

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
