"use client";

import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useUserData } from "@/states/stores/userData";
import { getMyPageInfo } from "@/utils/getMyPageInfo";
import { MyPageInfo } from "@/lib/types";

interface MyPageLayoutProps {
    children: React.ReactNode;
}

export default function MyPageLayout({ children }: MyPageLayoutProps) {
    const [userData] = useUserData();
    const [myPageInfo, setMyPageInfo] = useState<MyPageInfo>();

    const excuteGetMyPageData = useCallback(async () => {
        if (userData.user_info) {
            const data = await getMyPageInfo(userData.user_info.id);
            setMyPageInfo(data);
        }
    }, [userData]);

    useEffect(() => {
        excuteGetMyPageData();
    }, [excuteGetMyPageData]);

    return (
        <WrapperBox>
            <ContentBox>
                <ProfileInfo>
                    <div>
                        <span className="user_name">
                            {userData.user_info?.name}
                        </span>
                        님
                    </div>
                    <ul className="info_ul">
                        <li>
                            <div>
                                저장된 사진
                                <span>{myPageInfo?.imageLen ?? 0}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                등록된 방
                                <span>{myPageInfo?.roomListLen ?? 0}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                친구수
                                <span>{myPageInfo?.friendlistLen ?? 0}</span>
                            </div>
                        </li>
                    </ul>
                </ProfileInfo>
                {children}
            </ContentBox>
        </WrapperBox>
    );
}

export const WrapperBox = styled.section`
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;

    box-sizing: border-box;

    .nav_box {
        position: fixed;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 10;

        width: 100%;
        padding: 0.5rem 9rem;
        box-sizing: border-box;

        .goback_room_btn {
            display: flex;
            align-items: center;

            gap: 0.5rem;

            border: 1px solid black;
            border-radius: 6px;
            background-color: darkgray;
            text-decoration: none;
        }
    }
`;

export const ContentBox = styled.div`
    box-sizing: border-box;

    height: 100%;

    li {
        list-style: none;
    }

    .info_ul {
        margin: 0;
        padding: 0;
    }

    .nav_icon {
        position: absolute;
        left: 1.5rem;
        top: 0.5rem;
        display: inline-flex;
        justify-content: center;
        align-items: center;

        width: 50px;
        height: 50px;

        border-radius: 20px;
        cursor: pointer;

        &:hover {
            background-color: rgba(212, 211, 213, 0.59);
        }
    }

    .upload_image {
        text-align: center;
        margin-bottom: 50px;
    }

    .content {
        margin-top: 2rem;
    }
`;

export const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;

    height: 150px;
    padding-left: 5rem;
    margin-bottom: 2rem;
    gap: 1rem;

    .user_name {
        font-size: 2rem;
        font-weight: bolder;
    }

    ul {
        display: flex;
        gap: 1rem;
    }

    @media screen and (max-width: 600px) {
        align-items: center;

        margin: 2rem 0;
        padding: 0;

        ul {
            flex-direction: column;
        }
    }
`;
