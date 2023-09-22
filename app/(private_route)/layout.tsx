"use client";
import { ReactNode, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Scrollbars } from "react-custom-scrollbars-2";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import styled from "@emotion/styled";

import NavigationBar from "@/components/NavigationBar";
import LeftMenu from "@/components/LeftMenu";
import { useUserData } from "@/states/stores/userData";
import { PageList } from "@/lib/enumType";
import { checkAuth } from "@/utils/userFetcher";
import LoadingCompoent from "@/components/shared/Loading";

interface Props {
    children: ReactNode;
    modal: ReactNode;
}

export default function PrivateLayout({ children, modal }: Props) {
    const [userData] = useUserData();

    const [openedLeftMenu, setOpenedLeftMenu] = useState(false);

    const requestCheckAuth = async () => {
        const checked = await checkAuth();

        if (!checked) {
            redirect("/login");
        }
    };

    useEffect(() => {
        if (userData.loginState === "loading") {
            return;
        } else if (userData.loginState === "logout") {
            redirect("/login");
        } else {
            requestCheckAuth();
        }
    }, [userData]);

    if (userData.loginState === "loading") return <LoadingCompoent />;

    return (
        <div
            style={{
                height: "inherit",
            }}
        >
            <NavigationBar />
            <ContentSection>
                {userData?.currentPage !== PageList.RoomMain && (
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
                    {userData?.currentPage !== PageList.RoomMain &&
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
