"use client";

import useAuth from "@/states/stores/data";
import { redirect } from "next/navigation";

export default function HomePage() {
    const { data } = useAuth();

    if (data?.isLoggedIn) {
        redirect("/room");
    } else {
        redirect("/login");
    }
}
