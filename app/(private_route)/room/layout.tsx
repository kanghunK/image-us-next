import React from "react";

interface RoomPageProps {
    children: React.ReactNode;
    modal: React.ReactNode;
}

export default function RoomLayout({ children, modal }: RoomPageProps) {
    return (
        <>
            {children}
            {modal}
        </>
    );
}
