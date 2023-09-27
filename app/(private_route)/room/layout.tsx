"use client";

import React from "react";

interface RoomPageProps {
    children: React.ReactNode;
}

export default function RoomLayout({ children }: RoomPageProps) {
    return <>{children}</>;
}
