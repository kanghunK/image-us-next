import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { BiArrowFromRight } from "react-icons/bi";
import { useRoom } from "@/states/stores/userData";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RoomList from "./RoomList";
import MyPageMenu from "./MyPageMenu";

interface Props {
    show: boolean;
    pageMatchNum: number;
    setLeftMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LeftMenu({ show, setLeftMenu, pageMatchNum }: Props) {
    const handleCloseMenu = useCallback(
        () => setLeftMenu(false),
        [setLeftMenu]
    );

    return (
        <Wrapper show={show}>
            {show && (
                <div className="close_icon" onClick={handleCloseMenu}>
                    <BiArrowFromRight />
                </div>
            )}
            {pageMatchNum === 2 ? (
                <RoomList show={show} />
            ) : (
                <MyPageMenu show={show} />
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div<{ show: boolean }>`
    position: relative;
    display: flex;
    flex-direction: column;

    width: 200px;
    height: 100%;
    padding: 40px 0;

    box-sizing: border-box;
    transition: width 0.5s, opacity 0.4s;
    background-color: #99aebb;
    text-align: center;

    ${({ show }) =>
        !show &&
        `
    width: 0;
    opacity: 0;
    `}

    .close_icon {
        position: absolute;
        z-index: 1;
        right: 10px;
        top: 10px;

        padding: 7px;
        border-radius: 50%;
        background-color: lightgray;
        cursor: pointer;

        &:hover {
            background-color: darkgray;
        }
    }

    @media screen and (max-width: 460px) {
        position: absolute;
        z-index: 10;
    }
`;