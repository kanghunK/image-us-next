"use client";

import React, { useState, useEffect } from "react";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/shared/button";
import axios from "@/lib/api";
import useInput from "@/hooks/useInput";
import styles from "./signup.module.scss";

interface ErrorInfo {
    name: { hasError: boolean; errorMessage: string };
    email: { hasError: boolean; errorMessage: string; emailAuth: boolean };
    password: { hasError: boolean; errorMessage: string };
}

export default function Signup() {
    const router = useRouter();

    const [checked, setChecked] = useState<boolean>(false);
    const [errorInfo, setErrorInfo] = useState({
        name: { hasError: true, errorMessage: "이름을 입력해주세요." },
        email: {
            hasError: true,
            errorMessage: "이메일을 입력해주세요.",
            emailAuth: false,
        },
        password: { hasError: true, errorMessage: "비밀번호를 입력해주세요." },
    });
    const [isRequestingAuth, setRequestingAuth] = useState(false);
    const [name, setName, nameHandler] = useInput("");
    const [email, setEmail, emailHandler] = useInput("");
    const [emailAuth, setEmailAuth, emailAuthHandler] = useInput("");
    const [password, setPassword, passwordHandler] = useInput("");
    const [passwordCheck, setPasswordCheck, passwordCheckHandler] =
        useInput("");
    const emailRegex = new RegExp(
        "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
    );
    const [count, setCount] = useState(60);
    const [timeLimitId, setTimeLimitId] = useState<NodeJS.Timeout | null>();

    useEffect(() => {
        if (!name) {
            setErrorInfo((prev) => ({
                ...prev,
                name: { hasError: true, errorMessage: "이름을 입력해주세요." },
            }));
        } else {
            setErrorInfo((prev) => ({
                ...prev,
                name: { hasError: false, errorMessage: "잘 입력하셨습니다!" },
            }));
        }
    }, [name]);

    useEffect(() => {
        if (isRequestingAuth) return;

        if (!email) {
            setErrorInfo((prev) => ({
                ...prev,
                email: {
                    hasError: true,
                    errorMessage: "이메일을 입력해주세요.",
                    emailAuth: false,
                },
            }));
        } else if (!emailRegex.test(email)) {
            setErrorInfo((prev) => ({
                ...prev,
                email: {
                    hasError: true,
                    errorMessage: "이메일 형식에 맞지 않습니다.",
                    emailAuth: false,
                },
            }));
        } else {
            setErrorInfo((prev) => ({
                ...prev,
                email: {
                    hasError: true,
                    errorMessage: "인증 요청버튼을 클릭하세요.",
                    emailAuth: true,
                },
            }));
        }
    }, [email]);

    useEffect(() => {
        if (!password) {
            setErrorInfo((prev) => ({
                ...prev,
                password: {
                    hasError: true,
                    errorMessage: "비밀번호를 입력해주세요.",
                },
            }));
            return;
        } else if (password.length < 8) {
            setErrorInfo((prev) => ({
                ...prev,
                password: {
                    hasError: true,
                    errorMessage: "비밀번호는 8자리 이상입니다.",
                },
            }));
            return;
        } else if (password !== passwordCheck) {
            setErrorInfo((prev) => ({
                ...prev,
                password: {
                    hasError: true,
                    errorMessage: "비밀번호가 일치하지 않습니다.",
                },
            }));
        } else {
            setErrorInfo((prev) => ({
                ...prev,
                password: {
                    hasError: false,
                    errorMessage: "잘 입력하셨습니다!",
                },
            }));
        }
    }, [password, passwordCheck]);

    useEffect(() => {
        if (!timeLimitId) return;
        if (count <= 0) {
            clearInterval(timeLimitId);
            setTimeLimitId(null);
            setCount(60);
            setEmailAuth("");
            setErrorInfo((prev) => ({
                ...prev,
                email: {
                    hasError: true,
                    errorMessage: "만료되었습니다..다시 요청해주세요!",
                    emailAuth: true,
                },
            }));
            setRequestingAuth(false);
        }
    }, [timeLimitId, count]);

    const countTimeLimit = () => {
        if (timeLimitId) return;
        const Id = setInterval(() => {
            setCount((prev) => prev - 1);
        }, 1000);
        setTimeLimitId(Id);
    };

    const requestEmailAuthNum = async () => {
        try {
            await axios.get(`/backapi/user/auth?email=${email}`);
            countTimeLimit();
            setRequestingAuth(true);
            setErrorInfo((prev) => ({
                ...prev,
                email: {
                    hasError: true,
                    errorMessage: "이메일 인증번호를 입력해주세요.",
                    emailAuth: true,
                },
            }));
        } catch (err) {
            if (err instanceof AxiosError) {
                const message = err.response?.data?.message;
                if (err.response?.status === 402) {
                    setErrorInfo((prev) => ({
                        ...prev,
                        email: {
                            hasError: true,
                            errorMessage: message,
                            emailAuth: false,
                        },
                    }));
                } else {
                    alert("인증문자를 발송하지못하였습니다..");
                    location.reload();
                }
            }
        }
    };

    const checkEmailAuth = async () => {
        try {
            if (!emailAuth) {
                setErrorInfo((prev) => ({
                    ...prev,
                    email: {
                        hasError: true,
                        errorMessage: "인증 번호가 입력되지 않았습니다.",
                        emailAuth: true,
                    },
                }));
            } else {
                await axios.post(`/backapi/user/auth?email=${email}`, {
                    auth_password: emailAuth,
                });
                if (timeLimitId) {
                    clearInterval(timeLimitId);
                    setTimeLimitId(null);
                    setCount(60);
                    setEmailAuth("");
                    setRequestingAuth(false);
                    setErrorInfo((prev) => ({
                        ...prev,
                        email: {
                            hasError: false,
                            errorMessage: "인증 되었습니다.",
                            emailAuth: false,
                        },
                    }));
                }
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                const message = err.response?.data?.message;
                if (err.response?.status === 401) {
                    setErrorInfo((prev) => ({
                        ...prev,
                        email: {
                            hasError: true,
                            errorMessage: message,
                            emailAuth: true,
                        },
                    }));
                } else {
                    if (timeLimitId) clearInterval(timeLimitId);
                    alert("인증에 실패하였습니다..");
                    location.reload();
                }
            }
        }
    };

    const cancelEmailAuth = () => {
        if (timeLimitId) clearInterval(timeLimitId);
        setTimeLimitId(null);
        setCount(60);
        setEmailAuth("");
        setRequestingAuth(false);
        setErrorInfo((prev) => ({
            ...prev,
            email: {
                hasError: true,
                errorMessage: "인증 요청버튼을 클릭하세요.",
                emailAuth: true,
            },
        }));
    };

    const checkErrorValue = () => {
        for (const key in errorInfo) {
            if (errorInfo[key as keyof ErrorInfo].hasError) return true;
        }
        return false;
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const hasError = checkErrorValue();
        if (hasError) {
            alert("양식을 다시 확인해 주세요.");
            return;
        }

        await axios
            .post("/backapi/user/sign-up", {
                name,
                email,
                password,
                profile: "test1",
            })
            .then(() => {
                alert("회원가입되었습니다.");
                router.push("/login");
            })
            .catch(() => {
                alert("회원가입 요청을 처리할 수 없습니다..");
            });
    };

    const correctMessageStyle = (hasError: boolean) => {
        if (!hasError) return { color: "dodgerblue" };
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.outer_container}>
                <h1>로그인</h1>
                <div className={styles.inner_container}>
                    <div className={styles.input_container}>
                        <div className={styles.name_box}>
                            <div className={styles.input_box}>
                                <input
                                    className={styles.input_tag}
                                    type="text"
                                    name="name-input"
                                    value={name}
                                    onChange={nameHandler}
                                    placeholder="이름을 입력하세요."
                                />
                            </div>
                            <div className={styles.error_text}>
                                <span
                                    style={correctMessageStyle(
                                        errorInfo.name.hasError
                                    )}
                                >
                                    {errorInfo.name.errorMessage}
                                </span>
                            </div>
                        </div>
                        <div className={styles.email_box}>
                            <div className={styles.input_box}>
                                <input
                                    className={styles.input_tag}
                                    type="text"
                                    name="email-input"
                                    value={email}
                                    onChange={emailHandler}
                                    placeholder="이메일을 입력하세요."
                                />
                            </div>
                            {errorInfo.email.emailAuth &&
                                (isRequestingAuth ? (
                                    <div
                                        className={`${styles.request_authbox} ${styles.input_box}`}
                                    >
                                        <input
                                            className={styles.input_tag}
                                            type="password"
                                            name="email-auth"
                                            value={emailAuth}
                                            onChange={emailAuthHandler}
                                            placeholder="인증번호"
                                        />
                                        <button
                                            type="button"
                                            onClick={checkEmailAuth}
                                        >
                                            확인
                                        </button>
                                        <button
                                            type="button"
                                            onClick={cancelEmailAuth}
                                        >
                                            취소
                                        </button>
                                        <div>
                                            <span>남은 시간: {count}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.email_err_message}>
                                        <button onClick={requestEmailAuthNum}>
                                            인증 요청
                                        </button>
                                    </div>
                                ))}
                            <div className={styles.error_text}>
                                <span
                                    style={correctMessageStyle(
                                        errorInfo.email.hasError
                                    )}
                                >
                                    {errorInfo.email.errorMessage}
                                </span>
                            </div>
                        </div>
                        <div className={styles.password_box}>
                            <div className={styles.wrap_password_input}>
                                <div className={styles.input_box}>
                                    <input
                                        className={styles.input_tag}
                                        type={checked ? "text" : "password"}
                                        name="password-input"
                                        value={password}
                                        onChange={passwordHandler}
                                        placeholder="비밀번호를 입력하세요."
                                    />
                                    <input
                                        className={styles.input_tag}
                                        type={checked ? "text" : "password"}
                                        name="password-check"
                                        value={passwordCheck}
                                        onChange={passwordCheckHandler}
                                        placeholder="한 번 더 입력하세요."
                                    />
                                </div>
                                <div className={styles.error_text}>
                                    <span
                                        style={correctMessageStyle(
                                            errorInfo.password.hasError
                                        )}
                                    >
                                        {errorInfo.password.errorMessage}
                                    </span>
                                </div>
                            </div>
                            <div
                                className={styles.password_checkbox}
                                onClick={() => setChecked((prev) => !prev)}
                            >
                                <input
                                    type="checkbox"
                                    name="show-password"
                                    checked={checked}
                                    readOnly
                                />
                                비밀번호 표시
                            </div>
                        </div>
                        <div className={styles.submit_box}>
                            <Link href={"/login"} className={styles.login_link}>
                                로그인 화면으로 이동
                            </Link>
                            <Button type="button" onClick={handleSubmit}>
                                제출
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
