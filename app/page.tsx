"use client";

import { useEffect } from "react";
import { useAuth } from "@/states/stores/userData";
import { redirect } from "next/navigation";

export default function HomePage() {
    const { data, loginError } = useAuth();

    useEffect(() => {
        if (data?.isLoggedIn) {
            redirect("/room");
        } else if (data?.isLoggedIn === false) {
            redirect("/login");
        }
    }, [data]);

    if (loginError) throw loginError;

    return <div>로딩중...</div>;
}
