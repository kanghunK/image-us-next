"use client";

import React, { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IconContext } from "react-icons/lib";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";

import { Button } from "@/components/shared/button";
import useAuth from "@/states/stores/data";
import Loading from "../../loading";
import styles from "./login.module.scss";

export default function Login() {
    const searchParams = useSearchParams();
    const emailParam = searchParams.get("email");
    const passwordParam = searchParams.get("password");
    const { login, isLoading } = useAuth();

    const [emailValue, setEmailValue] = useState<string>("");
    const [passwordValue, setPwValue] = useState<string>("");
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
    const [pwErrorMessage, setPwErrorMessage] = useState<string>("");
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const emailRegex = new RegExp(
        "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
    );

    const emailValidation = useCallback((value: string) => {
        if (!value) {
            setEmailErrorMessage("이메일을 입력해주세요.");
            return false;
        } else if (!emailRegex.test(value)) {
            setEmailErrorMessage("이메일 형식에 맞지 않습니다.");
            return false;
        }
        setEmailErrorMessage("");
        return true;
    }, []);

    const pwValidation = useCallback((value: string) => {
        if (!value) {
            setPwErrorMessage("비밀번호를 입력해주세요.");
            return false;
        } else if (value?.length < 8) {
            setPwErrorMessage("비밀번호는 8글자 이상입니다.");
            return false;
        }
        setPwErrorMessage("");
        return true;
    }, []);

    const onChangeEmailInput = (e: { target: { value: string } }) => {
        setEmailValue(e.target.value);
        const inputValue = e.target.value;
        emailValidation(inputValue);
    };

    const onChangePasswordInput = (e: { target: { value: string } }) => {
        setPwValue(e.target.value);
        const inputValue = e.target.value;
        pwValidation(inputValue);
    };

    const onSubmitLoginInfo = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        const emailCheck = emailValidation(emailValue);
        const pwCheck = pwValidation(passwordValue);
        if (!emailCheck && !pwCheck) {
            alert("이메일과 비밀번호를 다시 확인해주세요.");
        } else if (!emailCheck) {
            alert("이메일을 다시 확인해주세요.");
        } else if (!pwCheck) {
            alert("비밀번호를 다시 확인해주세요.");
        } else {
            login({ email: emailValue, password: passwordValue });
        }
    };

    if (emailParam && passwordParam) {
        login({ email: emailParam, password: passwordParam });
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.outer_container}>
                <h1>로그인</h1>
                <div className={styles.inner_container}>
                    <form onSubmit={onSubmitLoginInfo}>
                        <div>
                            <div className={styles.input_box}>
                                <label htmlFor="email-input">
                                    이메일 주소를 입력하세요.
                                </label>
                                <div>
                                    <input
                                        type="text"
                                        id="email-input"
                                        ref={emailRef}
                                        value={emailValue}
                                        onChange={onChangeEmailInput}
                                        placeholder="이메일을 입력하세요."
                                    />
                                </div>
                                <div className={styles.error_message}>
                                    <span>{emailErrorMessage}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className={styles.input_box}>
                                <label htmlFor="password-input">
                                    비밀번호를 입력하세요.
                                </label>
                                <div>
                                    <input
                                        type="password"
                                        id="password-input"
                                        ref={passwordRef}
                                        value={passwordValue}
                                        onChange={onChangePasswordInput}
                                        placeholder="비밀번호를 입력하세요."
                                    />
                                </div>
                                <div className={styles.error_message}>
                                    <span>{pwErrorMessage}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.submit_box}>
                            <Link
                                href={"/signup"}
                                className={styles.signup_link}
                            >
                                계정 만들기
                            </Link>
                            <Button type="submit">확인</Button>
                        </div>
                    </form>
                    <div className={styles.social_box}>
                        <hr className={styles.social_sign_in_line} />
                        <span className={styles.social_sign_in_title}>
                            간편 로그인
                        </span>
                        <div className={styles.social_icon_box}>
                            <a
                                href={`/backapi/oauth-login?coperation=kakao`}
                                className={`${styles.kakao_icon} ${styles.social_icon_a}`}
                            >
                                <IconContext.Provider
                                    value={{
                                        size: "55%",
                                        style: { display: "inline-block" },
                                    }}
                                >
                                    <RiKakaoTalkFill />
                                </IconContext.Provider>
                            </a>
                            <a
                                href="/backapi/oauth-login?coperation=naver"
                                className={`${styles.naver_icon} ${styles.social_icon_a}`}
                            >
                                <IconContext.Provider
                                    value={{
                                        size: "55%",
                                        style: { display: "inline-block" },
                                    }}
                                >
                                    <SiNaver />
                                </IconContext.Provider>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
