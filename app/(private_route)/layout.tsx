"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { redirect, useParams, usePathname } from "next/navigation";
import { Scrollbars } from "react-custom-scrollbars-2";
import NavigationBar from "@/components/NavigationBar";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import styled from "@emotion/styled";
import LeftMenu from "@/components/LeftMenu";
import { useAuth } from "@/hooks/useAuth";
import { useRoom } from "@/hooks/useRoom";

interface Props {
    children: ReactNode;
    modal: ReactNode;
}

export default function PrivateLayout({ children, modal }: Props) {
    const params = useParams();
    const { authData, loginError } = useAuth();
    const { data: roomlist } = useRoom();
    const currentPath = usePathname();

    const [pageTitle, setPageTitle] = useState("unknwon");

    /*
        페이지 별로 번호로 구분
        0: 마이페이지
        1: 방 목록
        2: 이미지 방
    */

    const [pageMatchNum, setPageMatchNum] = useState<number | null>(null);
    const [openedLeftMenu, setOpenedLeftMenu] = useState(false);
    const currentPathArray = currentPath.split("/");

    useEffect(() => {
        if (currentPathArray.includes("room")) {
            if (
                currentPathArray.includes("invite_member") ||
                currentPathArray.includes("upload_image") ||
                currentPathArray.includes("create_room")
            ) {
                return;
            }
            if (params.id) {
                const roomName = roomlist?.find(
                    (data) => "" + data.id === params.id
                )?.title as string;
                setPageTitle(roomName);
                setPageMatchNum(2);
            } else {
                setPageTitle("방 목록");
                setPageMatchNum(1);
            }
        } else if (currentPathArray.includes("my_page")) {
            setPageTitle("마이 페이지");
            setPageMatchNum(0);
        } else {
            setPageTitle("unknown");
            setPageMatchNum(null);
        }
    }, [currentPathArray, params, roomlist]);

    const onClickLeftMenu = () => {
        setOpenedLeftMenu((prev) => !prev);
    };

    if (loginError) throw loginError;

    if (authData === null) {
        return <div>로딩중...</div>;
    }

    if (authData?.isLoggedIn === false) {
        redirect("/login");
    }

    return (
        <div
            style={{
                height: "inherit",
            }}
        >
            <NavigationBar
                userInfo={authData}
                pageTitle={pageTitle}
                pageMatchNum={pageMatchNum}
            />
            <ContentSection>
                {(pageMatchNum === 2 || pageMatchNum === 0) && (
                    <LeftMenu
                        show={openedLeftMenu}
                        setLeftMenu={setOpenedLeftMenu}
                        pageMatchNum={pageMatchNum}
                    />
                )}
                <main
                    style={{
                        flex: "1 0 auto",
                        position: "relative",
                    }}
                >
                    {pageMatchNum === 2 && !openedLeftMenu && (
                        <MenuIcon onClick={onClickLeftMenu}>
                            <AiOutlineMenuUnfold />
                        </MenuIcon>
                    )}
                    <Scrollbars>{children}</Scrollbars>
                </main>
            </ContentSection>
            {modal}
        </div>
    );
}

const ContentSection = styled.div`
    display: flex;

    height: calc(100% - 50px);
`;

const MenuIcon = styled.div`
    position: absolute;
    z-index: 1;
    left: 20px;
    top: 10px;

    padding: 7px;
    border-radius: 50%;
    background-color: lightgray;
    cursor: pointer;

    &:hover {
        background-color: darkgray;
    }
`;
