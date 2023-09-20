"use client";

import { useEffect } from "react";
import { useUserData } from "@/states/stores/userData";
import { redirect } from "next/navigation";
import LoadingCompoent from "@/components/shared/Loading";

export default function HomePage() {
    const [userData] = useUserData();

    useEffect(() => {
        if (userData?.user_info) {
            redirect("/room");
        } else {
            redirect("/login");
        }
    }, [userData]);

    return <LoadingCompoent />;
}
