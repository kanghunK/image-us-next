"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useUserData } from "@/states/stores/userData";

import { socialLogin } from "@/utils/userFetcher";

export default function SocialLogIn() {
    const [, setUserData] = useUserData();

    const searchparams = useSearchParams();

    const requestSocialLogin = async (coperation: string, code: string) => {
        const userInfo = await socialLogin(coperation, code);
        setUserData((prev) => ({
            ...prev,
            user_info: userInfo,
        }));
    };

    useEffect(() => {
        const coperationValue = searchparams.get("coperation");
        const codeValue = searchparams.get("code");

        if (coperationValue && codeValue) {
            requestSocialLogin(coperationValue, codeValue);
        }
    }, [searchparams]);

    return <div>로그인 요청 처리중..</div>;
}
