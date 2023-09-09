"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";
import useInput from "@/hooks/useInput";
import { Button } from "@/components/shared/Button";
import { useAuth } from "@/hooks/useAuth";

export default function Mypage() {
    const { authData: userData, changeName } = useAuth();

    const [nameInput, setNameInput, handleNameInput] = useInput("");
    const [nameBoxState, setNameBoxState] = useState(false);

    return (
        <InfoSection>
            <h2>기본 회원정보</h2>
            <InfoTable>
                <colgroup>
                    <col width={"30%"} />
                    <col width={"70%"} />
                </colgroup>
                <tbody>
                    <tr>
                        <th>이름</th>
                        {!nameBoxState ? (
                            <td>
                                <div className="change_name">
                                    <div>
                                        <strong>
                                            {userData?.user_info?.name ??
                                                "USER"}
                                        </strong>
                                    </div>
                                    <div className="btn_group">
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                setNameBoxState(true)
                                            }
                                        >
                                            이름 변경
                                        </Button>
                                    </div>
                                </div>
                            </td>
                        ) : (
                            <td>
                                <div className="change_name">
                                    <div>
                                        <p className="notice">
                                            새로운 이름 입력
                                        </p>
                                        <input
                                            type="text"
                                            id="name_label"
                                            onChange={handleNameInput}
                                            value={nameInput}
                                            placeholder="이름 입력"
                                        />
                                    </div>
                                    <div className="btn_group">
                                        <Button
                                            type="button"
                                            onClick={async () => {
                                                await changeName(nameInput);
                                                setNameBoxState(false);
                                            }}
                                        >
                                            완료
                                        </Button>
                                        <Button
                                            type="button"
                                            className="cancel_btn"
                                            onClick={() =>
                                                setNameBoxState(false)
                                            }
                                        >
                                            취소
                                        </Button>
                                    </div>
                                </div>
                            </td>
                        )}
                    </tr>
                    <tr>
                        <th>이메일</th>
                        <td>
                            <strong>{userData?.user_info?.email}</strong>
                        </td>
                    </tr>
                    <tr>
                        <th>가입 유형</th>
                        <td>
                            <div>{userData?.user_info?.user_type}</div>
                        </td>
                    </tr>
                </tbody>
            </InfoTable>
        </InfoSection>
    );
}

export const InfoSection = styled.section`
    min-width: 370px;

    h2 {
        padding-left: 1.5rem;
        margin-bottom: 1rem;
    }

    @media screen and (min-width: 450px) {
        margin: 0 2rem;
    }
`;

export const InfoTable = styled.table`
    width: 100%;
    table-layout: fixed;

    text-align: center;
    border-collapse: collapse;
    overflow: hidden;
    user-select: text;

    tbody {
        border-top: 3px solid #000000;

        tr td,
        tr th {
            padding: 15px;
        }

        tr {
            height: 85px;

            text-align: left;
            border-bottom: 1px solid #f1f1f1;

            .change_name {
                display: flex;
                align-items: center;

                .notice {
                    margin: 0;
                    margin-bottom: 5px;
                }

                input {
                    width: 130px;
                }

                .btn_group {
                    display: flex;
                    flex-direction: column;
                    align-items: start;
                    justify-content: center;

                    margin-left: auto;
                    gap: 1rem;
                }
            }
        }
    }

    @media screen and (min-width: 600px) {
        tbody {
            tr {
                .change_name {
                    .btn_group {
                        flex-direction: row;
                    }
                }
            }
        }
    }
`;
