"use client";

import { useEffect } from "react";
import styled from "@emotion/styled";
import { useUserData } from "@/states/stores/userData";
import { redirect } from "next/navigation";
import { roboto } from "./fonts";

export default function HomePage() {
    const [userData] = useUserData();

    useEffect(() => {
        if (userData?.user_info) {
            redirect("/room");
        } else {
            redirect("/login");
        }
    }, [userData]);

    return (
        <Container>
            <LoadingCircle>
                <div className={`${roboto.className} text`}>{`페이지
전환중`}</div>
            </LoadingCircle>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100%;
`;

const LoadingCircle = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100px;
    height: 100px;

    padding: 2rem;
    border-radius: 50%;
    background-color: #f8f8ff;

    .text {
        font-size: 1.2rem;
        line-height: 1.8rem;
        white-space: pre;
        text-align: center;
    }
`;
