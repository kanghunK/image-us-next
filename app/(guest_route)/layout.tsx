"use client";

import { ReactNode, useEffect } from "react";
import { redirect } from "next/navigation";
import { useUserData } from "@/states/stores/userData";
import LoadingCompoent from "@/components/shared/Loading";

interface Props {
    children: ReactNode;
}

export default function GuestLayout({ children }: Props) {
    const [userData] = useUserData();

    useEffect(() => {
        if (userData.loginState === "loading") {
            return;
        } else if (userData.loginState === "login") {
            redirect("/room");
        }
    }, [userData]);

    if (userData.loginState === "loading") return <LoadingCompoent />;

    return <main style={{ height: "inherit" }}>{children}</main>;
}
