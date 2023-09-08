"use client";

import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/states/stores/userData";

interface Props {
    children: ReactNode;
}

export default function GuestLayout({ children }: Props) {
    const { authData, loginError } = useAuth();

    if (loginError) throw loginError;

    if (authData === null) {
        return <div>로딩중...</div>;
    }

    if (authData?.isLoggedIn) {
        redirect("/room");
    }

    return <main style={{ height: "inherit" }}>{children}</main>;
}
