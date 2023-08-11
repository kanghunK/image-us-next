import React from "react";
import RootLayout from "./layout";
import Login from "./login/page";
import Room from "./room/page";

export default function Homepage() {
    const isLoggedIn = true;

    return <RootLayout>{isLoggedIn ? <Room /> : <Login />}</RootLayout>;
}
