"use client";

import React, { useState } from "react";
import { IconContext } from "react-icons/lib";
import { FaRegUser } from "react-icons/fa";
import styled from "@emotion/styled";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavigationBar() {
    const currentPath = usePathname().split("/")[1];
    const pageTitle = { room: "Room", my_page: "MyPage" };
    const [showMenu, setShowMenu] = useState(false);

    return (
        <Wrapper>
            <NavTitle
                onClick={() => setShowMenu((prev) => !prev)}
                clicked={showMenu}
            >
                <span className="text">
                    {pageTitle.hasOwnProperty(currentPath)
                        ? pageTitle[currentPath as keyof typeof pageTitle]
                        : "unknown"}
                </span>
                {showMenu && (
                    <ul className="nav_menu">
                        <li className="first_item">
                            <Link href="/room">방 목록</Link>
                        </li>
                        <li>
                            <Link href="/my_page">마이페이지</Link>
                        </li>
                    </ul>
                )}
            </NavTitle>
            <IconContext.Provider
                value={{
                    size: "16px",
                }}
            >
                <div className="user_icon">
                    <FaRegUser />
                </div>
            </IconContext.Provider>
        </Wrapper>
    );
}

const Wrapper = styled.nav`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    border-bottom: 1px solid hsl(210, 8%, 85%);

    ul {
        padding: 0;
        margin: 0;
        list-style: none;

        a {
            text-decoration: none;
        }
    }

    .user_icon {
        position: absolute;
        right: 12px;

        display: inline-block;
        margin-left: auto;
        margin-right: 15px;
        padding: 10px;
        border-radius: 50%;
        background-color: lightgray;
        cursor: pointer;

        &:hover {
            background-color: darkgray;
        }
    }

    .nav_menu {
        position: absolute;
        top: 30px;
        z-index: 1;
        width: 120px;

        text-align: center;
        border-radius: 8px;
        box-shadow: 0px 1px 1px 1px rgba(0, 0, 0, 0.2);
        background-color: white;
        overflow: hidden;

        li:not(:last-child) {
            border-bottom: 1px solid #f2f2f2;
        }

        li {
            padding: 12px;

            a {
                color: black;
            }

            &:hover {
                background-color: #e6e6e6;
            }
        }
    }
`;

const NavTitle = styled.div<{ clicked: boolean }>`
    position: relative;
    cursor: pointer;

    .text {
        margin-left: 10px;
    }

    &::before {
        content: "";
        width: 8px;
        height: 8px;
        border-top: 2px solid #121212;
        border-right: 2px solid #121212;
        display: inline-block;
        transition: transform 0.5s;
        transform: ${({ clicked }) =>
            clicked ? "rotate(135deg)" : "rotate(45deg)"};
    }
`;
