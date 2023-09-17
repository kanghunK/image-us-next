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
    const { authData } = useAuth();

    console.log("guestLayoutError: ", authData);

    useEffect(() => {
        if (authData?.isLoggedIn) {
            redirect("/room");
        }
    }, [authData]);

    return <main style={{ height: "inherit" }}>{children}</main>;
}
