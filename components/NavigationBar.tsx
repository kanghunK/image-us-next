"use client";

import React, { useState, useEffect, useRef } from "react";
import { IconContext } from "react-icons/lib";
import { FaRegUser } from "react-icons/fa";
import styled from "@emotion/styled";
import { useParams, usePathname, useRouter } from "next/navigation";
import { DUserInfo } from "@/lib/types";
import { CgLogOff } from "react-icons/cg";
import { CiViewList } from "react-icons/ci";
import { LiaInfoCircleSolid } from "react-icons/lia";
import { useAuth } from "@/states/stores/userData";
import { BsCalendar2Plus } from "react-icons/bs";
import { Button } from "./shared/Button";

interface NavProps {
    userInfo: {
        isLoggedIn: boolean;
        user_info: DUserInfo;
    };
}

export default function NavigationBar({ userInfo }: NavProps) {
    const router = useRouter();
    const params = useParams();
    const currentPathArray = usePathname().split("/");
    const { logout } = useAuth();

    const [pageTitle, setPageTitle] = useState("unknwon");
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userIconRef = useRef(null);

    useEffect(() => {
        if (currentPathArray.includes("room")) {
            console.log(currentPathArray);
            if (params.id && currentPathArray.length === 3) {
                setPageTitle(`${params.id} 방`);
            } else {
                setPageTitle("방 목록");
            }
        } else if (currentPathArray.includes("my_page")) {
            setPageTitle("마이 페이지");
        } else {
            setPageTitle("unknown");
        }
    }, [currentPathArray, params]);

    const onClickCreateRoom = () => {
        router.push("/room/create_room");
    };

    return (
        <Wrapper>
            <IconContext.Provider
                value={{
                    size: "16px",
                }}
            >
                <LeftButton>
                    {pageTitle === "방 목록" ? (
                        <div
                            className="create_room_btn"
                            onClick={onClickCreateRoom}
                        >
                            <BsCalendar2Plus />
                        </div>
                    ) : (
                        <button
                            className="move_roomlist_btn"
                            onClick={() => router.push("/room")}
                        >
                            <div className="list_icon">
                                <CiViewList />
                            </div>
                            <div className="list_text">방 목록으로 이동</div>
                        </button>
                    )}
                </LeftButton>
                <NavTitle>
                    <span className="text">{pageTitle}</span>
                </NavTitle>
                <UserIconGroup>
                    <div
                        className="user_icon"
                        onClick={() => setShowUserMenu((prev) => !prev)}
                    >
                        <FaRegUser />
                    </div>
                    <div>{userInfo.user_info.name}</div>
                    {showUserMenu && (
                        <>
                            <div
                                className="backdrop"
                                onClick={() => setShowUserMenu(false)}
                            ></div>
                            <div className="user_icon_menu" ref={userIconRef}>
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
                        </>
                    )}
                </UserIconGroup>
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
    box-sizing: border-box;

    ul {
        padding: 0;
        margin: 0;
        list-style: none;

        a {
            text-decoration: none;
        }
    }
`;

const LeftButton = styled.div`
    position: absolute;
    left: 10%;

    .create_room_btn {
        padding: 7px;
        margin-right: 25px;
        border-radius: 50%;
        background-color: lightgray;
        cursor: pointer;

        &:hover {
            background-color: darkgray;
        }
    }

    .move_roomlist_btn {
        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;

        padding: 7px;

        vertical-align: middle;
        overflow: hidden;
        text-decoration: none;
        white-space: nowrap;
        user-select: none;
        background: none;
        background-color: hsla(240, 7%, 70%, 0.22);
        color: #0e0e10;
        font-weight: 600;
        border: none;
        border-radius: 0.4rem;
        cursor: pointer;

        &:hover {
            background-color: hsla(240, 7%, 70%, 0.35);
        }

        .list_icon {
            line-height: 0;
            margin-right: 3px;
        }

        @media screen and (max-width: 700px) {
            svg {
                width: 20px;
                height: 20px;
            }

            .list_icon {
                margin: 0;
            }

            .list_text {
                position: absolute;
                width: 1px;
                height: 1px;
                clip-path: polygon(0 0, 0 0, 0 0, 0 0);
                overflow: hidden;
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

const UserIconGroup = styled.div`
    display: flex;
    align-items: center;
    position: absolute;
    right: 5%;

    .user_icon {
        display: inline-block;
        margin-left: auto;
        margin-right: 15px;
        padding: 7px;
        border-radius: 50%;
        background-color: lightgray;
        cursor: pointer;

        &:hover {
            background-color: darkgray;
        }
    }

    .backdrop {
        width: 100vw;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9;
        visibility: visible;
    }

    .user_icon_menu {
        position: absolute;
        top: 44px;
        right: 0;

        z-index: 10;
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
`;
