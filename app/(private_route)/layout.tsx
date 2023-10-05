"use client";
import { ReactNode, useState, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import styled from "@emotion/styled";

import NavigationBar from "@/components/NavigationBar";
import LeftMenu from "@/components/LeftMenu";
import { useUserData } from "@/states/stores/userData";
import withAuth from "@/components/shared/withAuth";
import { usePathname } from "next/navigation";

interface Props {
    children: ReactNode;
    modal: ReactNode;
}

const PrivateLayout = ({ children, modal }: Props) => {
    const [userData] = useUserData();
    const currentPath = usePathname();
    const [navTitle, setNavTitle] = useState("");
    const [openedLeftMenu, setOpenedLeftMenu] = useState(false);

    useEffect(() => {
        const pathArr = currentPath.split("/");
        if (
            pathArr.includes("create_room") ||
            pathArr.includes("invite_member")
        )
            return;

        if (pathArr[1] === "room") {
            if (pathArr[2]) {
                const currentRoom = userData?.roomList?.find(
                    (e) => "" + e.id === pathArr[2]
                );
                setNavTitle(currentRoom?.title ?? "");
                return;
            }
            setNavTitle("방 목록");
        } else if (pathArr[1] === "my_page") {
            setNavTitle("마이 페이지");
        } else {
            setNavTitle("");
        }
    }, [currentPath, userData]);

    return (
        <div
            style={{
                height: "inherit",
            }}
        >
            <NavigationBar navTitle={navTitle} />
            <ContentSection>
                {navTitle !== "방 목록" && (
                    <LeftMenu
                        show={openedLeftMenu}
                        navTitle={navTitle}
                        setLeftMenu={setOpenedLeftMenu}
                    />
                )}
                <main
                    style={{
                        flex: "1 0 auto",
                        position: "relative",
                    }}
                >
                    {navTitle !== "방 목록" && !openedLeftMenu && (
                        <MenuIcon
                            onClick={() => setOpenedLeftMenu((prev) => !prev)}
                        >
                            <AiOutlineMenuUnfold />
                        </MenuIcon>
                    )}
                    <Scrollbars universal={true}>{children}</Scrollbars>
                </main>
            </ContentSection>
            {modal}
        </div>
    );
};

export default withAuth(PrivateLayout);

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
