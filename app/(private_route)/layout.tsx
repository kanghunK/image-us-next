"use client";
import { ReactNode, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import styled from "@emotion/styled";

import NavigationBar from "@/components/NavigationBar";
import LeftMenu from "@/components/LeftMenu";
import { useUserData } from "@/states/stores/userData";
import { PageList } from "@/lib/enumType";
import withAuth from "@/components/shared/withAuth";

interface Props {
    children: ReactNode;
    modal: ReactNode;
}

const PrivateLayout = ({ children, modal }: Props) => {
    const [userData] = useUserData();
    const [openedLeftMenu, setOpenedLeftMenu] = useState(false);

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
