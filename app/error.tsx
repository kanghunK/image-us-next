"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        if (error.name === "AuthRequiredError") {
            alert(error.message);
            router.push("/login");
        }
    }, []);

    return (
        <div>
            <h2>Something went wrong!</h2>
            <button onClick={() => reset()}>Try again</button>
        </div>
    );
}
