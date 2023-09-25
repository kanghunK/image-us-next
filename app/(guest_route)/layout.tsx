"use client";

import { ReactNode } from "react";
import checkGuest from "@/components/shared/checkGuest";

interface Props {
    children: ReactNode;
}

const GuestLayout = ({ children }: Props) => {
    return <main style={{ height: "inherit" }}>{children}</main>;
};

export default checkGuest(GuestLayout);
