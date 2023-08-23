"use client";

import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import useAuth from "@/states/stores/data";
import NavigationBar from "@/components/NavigationBar";

interface Props {
    children: ReactNode;
}

export default function PrivateLayout({ children }: Props) {
    const { data } = useAuth();

    if (!data?.isLoggedIn) {
        redirect("/login");
    }

    return (
        <>
            <NavigationBar />
            <main style={{ height: "inherit" }}>{children}</main>
        </>
    );
}
