"use client";

import { ReactNode, useEffect } from "react";
import { redirect } from "next/navigation";
import { useUserData } from "@/states/stores/userData";

interface Props {
    children: ReactNode;
}

export default function GuestLayout({ children }: Props) {
    const [userData] = useUserData();

    useEffect(() => {
        if (userData?.user_info) {
            redirect("/room");
        }
    }, [userData]);

    return <main style={{ height: "inherit" }}>{children}</main>;
}
