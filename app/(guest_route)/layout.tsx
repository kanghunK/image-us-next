"use client";

import React, { ReactNode, useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingCompoent from "@/components/shared/Loading";
import { useUserData } from "@/states/stores/userData";

interface Props {
    children: ReactNode;
}

export default function GuestLayout({ children }: Props) {
    // const { authData, authError } = useAuth();
    const [userData] = useUserData();

    console.log("guestLayoutError: ", userData);

    useEffect(() => {
        if (userData?.user_info) {
            redirect("/room");
        }
    }, [userData]);

    // if (authError) throw authError;

    return <main style={{ height: "inherit" }}>{children}</main>;
}
