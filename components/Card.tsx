import React, { useState } from "react";
import styled from "@emotion/styled";
import { RoomData } from "@/lib/types";
import { IconContext } from "react-icons/lib";
import { BsThreeDots } from "react-icons/bs";

interface CardProps {
    roomData: RoomData;
}

export default function Card({ roomData }: CardProps) {
    const [showGetoutBox, setShowGetoutBox] = useState(false);

    return (
        <Wrapper>
            <div className="card_body">
                <div className="title">{roomData.title}</div>
                <div>
                    {roomData.userlist.slice(0, 3).map((data) => (
                        <span key={data.id} className="member">
                            {data.name}
                        </span>
                    ))}
                    ...
                </div>
                <div
                    className="icon"
                    onClick={() => setShowGetoutBox((prev) => !prev)}
                >
                    <IconContext.Provider
                        value={{
                            size: "28px",
                        }}
                    >
                        <BsThreeDots />
                    </IconContext.Provider>
                    {showGetoutBox && (
                        <div className="ellipsis_btn">
                            <div>
                                <span>방에서 나가기</span>
                            </div>
                        </div>
                    )}
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
        padding: 24px;
        border-radius: 0 0 8px 8px;

        &::after {
            content: "";
            display: block;
            clear: both;
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

        .icon {
            position: relative;
            display: inline-block;
            float: right;
            line-height: 0;
            cursor: pointer;

            .ellipsis_btn {
                position: absolute;
                top: 36px;
                left: -16px;
                width: 105px;
                padding: 10px;
                z-index: 1;

                line-height: normal;
                text-align: center;
                border-radius: 8px;
                box-shadow: 0px 1px 1px 1px rgba(0, 0, 0, 0.2);
                background-color: #f3eed9;
                cursor: pointer;

                &:hover {
                    background-color: #e75c5c;

                    &::after {
                        border-bottom-color: #e75c5c;
                    }
                }

                &::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 30%;
                    width: 0;
                    height: 0;
                    border: 12px solid transparent;
                    border-bottom-color: #f3eed9;
                    border-top: 0;
                    margin-left: -19.5px;
                    margin-top: -12px;
                }
            }
        }
    }

    .card_action {
        display: flex;

        list-style: none;
        background: #fff;
        border-top: 1px solid #f0f0f0;
        border-radius: 0 0 8px 8px;
    }
`;
