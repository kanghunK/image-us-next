"use client";

import { useEffect } from "react";
import { useUserData } from "@/states/stores/userData";
import { redirect } from "next/navigation";
import LoadingCompoent from "@/components/shared/Loading";

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

    return <LoadingCompoent />;
}
