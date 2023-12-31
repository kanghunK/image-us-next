"use client";
import { useState } from "react";
import { IconContext } from "react-icons/lib";
import { FaRegUser } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { CgLogOff } from "react-icons/cg";
import { CiViewList } from "react-icons/ci";
import { LiaInfoCircleSolid } from "react-icons/lia";
import { BsCalendar2Plus } from "react-icons/bs";
import { FiUserPlus } from "react-icons/fi";
import { BiUpload } from "react-icons/bi";

import styled from "@emotion/styled";
import { PageList } from "@/lib/enumType";
import { useUserData } from "@/states/stores/userData";
import { removeLocalStorageData } from "@/utils/userFetcher";
import { montserrat } from "@/app/fonts";

export default function NavigationBar({ navTitle }: { navTitle: string }) {
    const [userData, setUserData] = useUserData();

    const router = useRouter();
    const currentPath = usePathname();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const onClickCreateRoom = () => {
        router.push("/room/create_room");
    };

    const moveToRoom = () => router.push("/room");

    const logoutRequest = async () => {
        await setUserData({
            loginState: "logout",
        });
        removeLocalStorageData();
    };

    return (
        <Wrapper>
            <IconContext.Provider
                value={{
                    size: "16px",
                }}
            >
                <LeftButton>
                    <button
                        className="left_btn"
                        onClick={
                            navTitle === "방 목록"
                                ? onClickCreateRoom
                                : moveToRoom
                        }
                    >
                        <div className="list_icon">
                            {navTitle === "방 목록" ? (
                                <BsCalendar2Plus />
                            ) : (
                                <CiViewList />
                            )}
                        </div>
                        <div className="list_text">
                            {navTitle === "방 목록"
                                ? "방 생성하기"
                                : "방 목록으로 이동"}
                        </div>
                    </button>
                </LeftButton>
                <h2 className={`${montserrat.className} title_tag`}>
                    {navTitle}
                </h2>
                <IconGroup>
                    {navTitle !== "방 목록" && navTitle !== "마이 페이지" && (
                        <>
                            <div
                                className="upload_icon icon_d"
                                onClick={() =>
                                    router.push(currentPath + "/upload_image")
                                }
                            >
                                <BiUpload />
                            </div>
                            <div
                                className="invite_icon icon_d"
                                onClick={() =>
                                    router.push(currentPath + "/invite_member")
                                }
                            >
                                <FiUserPlus />
                            </div>
                        </>
                    )}
                    <div className="user_name">{userData?.user_info?.name}</div>
                    <div
                        className="user_icon icon_d"
                        onClick={() => setShowUserMenu((prev) => !prev)}
                    >
                        <FaRegUser />
                    </div>
                    {showUserMenu && (
                        <>
                            <div
                                className="backdrop"
                                onClick={() => setShowUserMenu(false)}
                            ></div>
                            <div className="user_icon_menu">
                                <div
                                    className="menu_item"
                                    onClick={() => {
                                        setShowUserMenu(false);
                                        router.push("/my_page");
                                    }}
                                >
                                    <LiaInfoCircleSolid />
                                    <span className="text">마이페이지</span>
                                </div>
                                <div
                                    className="menu_item logout"
                                    onClick={logoutRequest}
                                >
                                    <CgLogOff />
                                    <span className="text">로그아웃</span>
                                </div>
                            </div>
                        </>
                    )}
                </IconGroup>
            </IconContext.Provider>
        </Wrapper>
    );
}

const Wrapper = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem;
    height: 50px;

    border-bottom: 1px solid hsl(210, 8%, 85%);
    box-sizing: border-box;

    h2 {
        margin: 0;
        white-space: nowrap;
    }

    .title_tag {
        color: #444;
        margin: 0;
        padding: 0.6rem;
        text-align: center;
        font-size: 1.1rem;
        font-weight: bold;
    }

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
    display: flex;

    .create_room_btn {
        padding: 7px;
        border-radius: 50%;
        background-color: lightgray;
        cursor: pointer;

        &:hover {
            background-color: darkgray;
        }
    }

    .left_btn {
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

const IconGroup = styled.div`
    display: flex;
    align-items: center;

    .icon_d {
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

    .user_name {
        margin: 0 1rem;
        white-space: nowrap;
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
        right: 20px;

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

        .menu_item.logout {
            &:hover {
                color: white;
                background-color: #f07070;
            }
        }
    }
`;
