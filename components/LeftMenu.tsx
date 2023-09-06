import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { BiArrowFromRight } from "react-icons/bi";
import { useRoom } from "@/states/stores/userData";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
    show: boolean;
    setLeftMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LeftMenu({ show, setLeftMenu }: Props) {
    const pathname = usePathname();
    const { data: roomList } = useRoom();

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
            {!roomList ? (
                <div>로딩중...</div>
            ) : (
                <Container show={show}>
                    <h3>방 목록</h3>
                    {roomList.map((item) => {
                        const isActive = pathname === `/room/${item.id}`;

                        return (
                            <div key={item.id}>
                                <Link
                                    href={`/room/${item.id}`}
                                    className={
                                        isActive
                                            ? "active check_box"
                                            : "check_box"
                                    }
                                >
                                    {item.title}
                                </Link>
                            </div>
                        );
                    })}
                </Container>
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

export const Container = styled.div<{ show: boolean }>`
    display: flex;
    flex-direction: column;
    position: relative;

    gap: 1rem;
    padding: 0 1rem;
    margin: 2rem 0;
    transition: opacity 0s 0.2s;

    ${({ show }) =>
        !show &&
        `
    transition-delay: 0.1s;
    opacity: 0;
    `}

    .check_box {
        display: block;

        height: 35px;
        line-height: 35px;

        text-align: center;
        border-radius: 5px;
        text-decoration: none;
        color: rgb(255, 255, 255, 0.7);

        &.active,
        &:hover {
            background-color: #0058aa;
        }
    }
`;
