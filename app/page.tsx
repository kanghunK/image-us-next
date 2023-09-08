"use client";

import { useEffect } from "react";
import { useAuth, useUserData } from "@/states/stores/userData";
import { redirect } from "next/navigation";

export default function HomePage() {
    const [userData] = useUserData();

    console.log("유저 데이터", userData);

    useEffect(() => {
        if (userData?.isLoggedIn) {
            redirect("/room");
        } else {
            redirect("/login");
        }
    }, [userData]);

    return <div>페이지 이동중...</div>;
}
