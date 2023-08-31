"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/states/stores/userData";
import NavigationBar from "@/components/NavigationBar";

interface Props {
    children: ReactNode;
    modal: ReactNode;
}

export default function PrivateLayout({ children, modal }: Props) {
    const { data, loginError } = useAuth();

    if (loginError) throw loginError;

    if (data === null) {
        console.log("private_route", data);
        return <div>로딩중...</div>;
    }

    if (data?.isLoggedIn === false) {
        redirect("/login");
    }

    return (
        <div
            style={{
                height: "inherit",
            }}
        >
            <NavigationBar userInfo={data} />
            <main
                style={{
                    height: "calc(100% - 50px)",
                    padding: "0 2rem",
                    overflow: "hidden",
                }}
            >
                {children}
            </main>
            {modal}
        </div>
    );
}
