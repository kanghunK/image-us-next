"use client";

import React, { useState } from "react";
import { IconContext } from "react-icons/lib";
import { FaRegUser } from "react-icons/fa";
import styled from "@emotion/styled";
import { usePathname, useRouter } from "next/navigation";
import { DUserInfo } from "@/lib/types";
import { CgLogOff } from "react-icons/cg";
import { LiaInfoCircleSolid } from "react-icons/lia";
import { useAuth } from "@/states/stores/userData";
import { BsCalendar2Plus } from "react-icons/bs";

interface NavProps {
    userInfo: {
        isLoggedIn: boolean;
        user_info: DUserInfo;
    };
}

export default function NavigationBar({ userInfo }: NavProps) {
    const router = useRouter();
    const currentPath = usePathname().split("/")[1];
    const { logout } = useAuth();

    const [showUserMenu, setShowUserMenu] = useState(false);
    const pageTitle = { room: "Room", my_page: "MyPage" };

    const onClickCreateRoom = () => {
        router.push("room/create_room");
    };

    return (
        <Wrapper>
            <NavTitle>
                <span className="text">
                    {pageTitle.hasOwnProperty(currentPath)
                        ? pageTitle[currentPath as keyof typeof pageTitle]
                        : "unknown"}
                </span>
            </NavTitle>
            <IconContext.Provider
                value={{
                    size: "16px",
                }}
            >
                <div className="active_btn_group">
                    <div
                        className="create_room_btn"
                        onClick={onClickCreateRoom}
                    >
                        <BsCalendar2Plus />
                    </div>
                    <div
                        className="user_icon"
                        onClick={() => setShowUserMenu((prev) => !prev)}
                    >
                        <FaRegUser />
                    </div>
                    <div>{userInfo.user_info.name}</div>
                    {showUserMenu && (
                        <div className="user_icon_menu">
                            <div
                                className="menu_item"
                                onClick={() => router.push("/my_page")}
                            >
                                <LiaInfoCircleSolid />
                                <span className="text">마이페이지</span>
                            </div>
                            <div className="menu_item" onClick={logout}>
                                <CgLogOff />
                                <span className="text">로그아웃</span>
                            </div>
                        </div>
                    )}
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

    .active_btn_group {
        display: flex;
        align-items: center;
        position: absolute;
        right: 5%;

        .create_room_btn {
            padding: 10px;
            margin-right: 25px;
            border-radius: 50%;
            background-color: lightgray;
            cursor: pointer;

            &:hover {
                background-color: darkgray;
            }
        }

        .user_icon {
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

        .user_icon_menu {
            position: absolute;
            top: 50px;
            right: 0;

            z-index: 1;
            width: 140px;

            text-align: center;
            border-radius: 8px;
            box-shadow: 0px 1px 1px 1px rgba(0, 0, 0, 0.2);
            background-color: white;
            overflow: hidden;

            .menu_item {
                padding: 12px;
                cursor: pointer;

                &:hover {
                    background-color: #e6e6e6;
                }

                &:not(:last-child) {
                    border-bottom: 1px solid #f2f2f2;
                }

                .text {
                    margin-left: 3px;
                }
            }
        }
    }
`;

const NavTitle = styled.div`
    position: relative;
    user-select: none;

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
        transform: rotate(45deg);
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
