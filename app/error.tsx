"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "@/states/stores/userData";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    const router = useRouter();
    const [, setUserData] = useUserData();

    useEffect(() => {
        if (error.name === "AuthRequiredError") {
            alert(error.message);
            setUserData({
                loginState: "logout",
            });
            router.push("/login");
        } else if (error.name === "alertErrorMessage") {
            alert(error.message);
        } else if (error.name === "ServerError") {
            alert(error.message);
        }
    }, []);

    return (
        <div>
            <h2>{error.name}</h2>
            <button onClick={() => reset()}>새로 고침하기</button>
            <button onClick={() => reset()}>홈으로 가기기</button>
        </div>
    );
}
