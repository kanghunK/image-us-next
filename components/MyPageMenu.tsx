import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import styled from "@emotion/styled";

export default function MyPageMenu({ show }: { show: boolean }) {
    const pathname = usePathname();

    return (
        <Container show={show}>
            <Link href={`/my_page`}>
                <div
                    className={`link_item ${
                        pathname === "/my_page" ? "active" : ""
                    }`}
                >
                    프로필
                </div>
            </Link>
            <Link href={`/my_page/friends`}>
                <div
                    className={`link_item ${
                        pathname === "/my_page/friends" ? "active" : ""
                    }`}
                >
                    친구 목록
                </div>
            </Link>
            <Link href={`/my_page/my_picture`}>
                <div
                    className={`link_item ${
                        pathname === "/my_page/my_picture" ? "active" : ""
                    }`}
                >
                    저장된 사진들
                </div>
            </Link>
            <Link href={`/my_page/search`}>
                <div
                    className={`link_item ${
                        pathname === "/my_page/search" ? "active" : ""
                    }`}
                >
                    유저 검색
                </div>
            </Link>
        </Container>
    );
}

export const Container = styled.div<{ show: boolean }>`
    display: flex;
    flex-direction: column;
    position: relative;

    gap: 1rem;
    padding: 0 1rem;
    margin-top: 60px;
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
