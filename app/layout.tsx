import Head from "next/head";
import Link from "next/link";
import { ReactChildren } from "@/lib/types";
import "./globals.css";

export default function RootLayout({ children }: ReactChildren) {
    const isLoggedIn = true;

    return (
        <html lang="en">
            <body>
                <main style={{ height: "inherit" }}>{children}</main>
            </body>
        </html>
    );
}
