"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/states/stores/userData";
import NavigationBar from "@/components/NavigationBar";
import localStoragePersistor from "@/states/persistors/local-storage";
import { UserInfo } from "@/lib/types";

interface Props {
    children: ReactNode;
}

export default function PrivateLayout({ children }: Props) {
    const { data } = useAuth();

    // const userInfoData = localStoragePersistor.onGet("@user/auth");

    // const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    // useEffect(() => {
    //     const userInfoData = localStoragePersistor.onGet("@user/auth");
    //     setUserInfo(userInfoData);
    // }, []);

    if (data === null) {
        console.log("private_route", data);
        return <div>로딩중...</div>;
    }

    if (data?.isLoggedIn === false) {
        redirect("/login");
    }

    return (
        <>
            <NavigationBar userInfo={data} />
            <main style={{ height: "inherit" }}>{children}</main>
        </>
    );
}
