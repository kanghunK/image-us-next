"use client";

import useAuth from "@/states/stores/data";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    const { logout } = useAuth();

    if (error.name === "NoToken" || error.name === "InvalidUserData") {
        alert(error.message);
        logout();
    }

    return (
        <div>
            <h2>Something went wrong!</h2>
            <button onClick={() => reset()}>Try again</button>
        </div>
    );
}
