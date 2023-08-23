"use client";

import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import useAuth from "@/states/stores/data";
import NavigationBar from "@/components/NavigationBar";
import localStoragePersistor from "@/states/persistors/local-storage";

interface Props {
    children: ReactNode;
}

export default function PrivateLayout({ children }: Props) {
    const { data } = useAuth();
    const userInfo = localStoragePersistor.onGet("@user/auth");

    if (!data?.isLoggedIn) {
        redirect("/login");
    }

    return (
        <>
            <NavigationBar userInfo={userInfo} />
            <main style={{ height: "inherit" }}>{children}</main>
        </>
    );
}
