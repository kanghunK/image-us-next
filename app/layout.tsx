"use client";

import { RootLayoutChildren } from "@/lib/types";
import "./globals.css";
import { Suspense } from "react";
import LoadingCompoent from "@/components/shared/Loading";

export default function RootLayout({ children }: RootLayoutChildren) {
    return (
        <html lang="en">
            <head>
                <link rel="shortcut icon" href="/favicon.ico" />
            </head>
            <body>
                <Suspense fallback={<LoadingCompoent />}>{children}</Suspense>
            </body>
        </html>
    );
}
