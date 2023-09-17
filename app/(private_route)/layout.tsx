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
import { useUserData } from "@/states/stores/userData";
import { PageList } from "@/lib/enumType";
import LoadingCompoent from "@/components/shared/Loading";
import { AuthRequiredError } from "@/lib/exceptions";

interface Props {
    children: ReactNode;
    modal: ReactNode;
}

export default function PrivateLayout({ children, modal }: Props) {
    const [userData] = useUserData();
    const { authData, authError, isLoading: authDataLoading } = useAuth();

    const params = useParams();
    const currentPath = usePathname();
    const [pageTitle, setPageTitle] = useState("unknwon");
    const [pageMatchNum, setPageMatchNum] = useState<number | null>(null);
    const [openedLeftMenu, setOpenedLeftMenu] = useState(false);
    const currentPathArray = currentPath.split("/");

    if (authError) throw authError;

    // if (authData?.isLoggedIn === false) {
    //     redirect("/login");
    // }

    return authDataLoading ? (
        <LoadingCompoent />
    ) : (
        <div
            style={{
                height: "inherit",
            }}
        >
            <NavigationBar />
            <ContentSection>
                {userData.currentPage !== PageList.RoomMain && (
                    <LeftMenu
                        show={openedLeftMenu}
                        setLeftMenu={setOpenedLeftMenu}
                    />
                )}
                <main
                    style={{
                        flex: "1 0 auto",
                        position: "relative",
                    }}
                >
                    {userData.currentPage !== PageList.RoomMain &&
                        !openedLeftMenu && (
                            <MenuIcon
                                onClick={() =>
                                    setOpenedLeftMenu((prev) => !prev)
                                }
                            >
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
