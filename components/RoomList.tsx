"use client";
import styled from "@emotion/styled";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Scrollbars from "react-custom-scrollbars-2";
import { useRoom } from "@/hooks/useRoom";

export default function RoomList({ show }: { show: boolean }) {
    const pathname = usePathname();
    const { data: roomList } = useRoom();

    if (!roomList) return <div>로딩중...</div>;

    return (
        <>
            <h3>방 목록</h3>
            <Scrollbars>
                <Container show={show}>
                    {roomList.map((item) => {
                        const isActive = pathname === `/room/${item.id}`;
                        return (
                            <Link key={item.id} href={`/room/${item.id}`}>
                                <div
                                    className={`link_item ${
                                        isActive ? "active" : ""
                                    }`}
                                >
                                    {item.title}
                                </div>
                            </Link>
                        );
                    })}
                </Container>
            </Scrollbars>
        </>
    );
}

const Container = styled.div<{ show: boolean }>`
    display: flex;
    flex-direction: column;
    position: relative;

    gap: 1rem;
    padding: 0 1rem;
    margin-top: 10px;
    transition: opacity 0s 0.2s;

    ${({ show }) =>
        !show &&
        `
    transition-delay: 0.1s;
    opacity: 0;
    `}

    a {
        text-decoration: none;
    }

    .link_item {
        display: block;

        height: 35px;
        line-height: 35px;

        text-align: center;
        border-radius: 5px;
        color: rgb(255, 255, 255, 0.7);

        &.active,
        &:hover {
            background-color: #0058aa;
        }
    }
`;
