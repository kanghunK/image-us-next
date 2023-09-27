"use client";

import React from "react";
import styled from "@emotion/styled";
import { Button } from "@/components/shared/Button";
import { DFriendData } from "@/lib/types";
import { useFriend } from "@/hooks/useFriend";

export default function Friends() {
    const { data: friendList, deleteMember } = useFriend();

    const deleteFriend = (friendId: number) => async () => {
        await deleteMember(friendId);
    };

    return (
        <Wrapper>
            <table>
                <colgroup>
                    <col span={1} style={{ width: "15%" }} />
                    <col span={1} style={{ width: "40%" }} />
                    <col span={1} style={{ width: "25%" }} />
                    <col span={1} style={{ width: "20%" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col">이름</th>
                        <th scope="col">이메일</th>
                        <th scope="col">가입 유형</th>
                        <th scope="col">목록 삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {!friendList ? (
                        <tr>
                            <td colSpan={4}>
                                <div>loading...</div>
                            </td>
                        </tr>
                    ) : friendList.length !== 0 ? (
                        friendList.map((data: DFriendData) => (
                            <tr key={data.id}>
                                <td>{data.name}</td>
                                <td>{data.email}</td>
                                <td>{data.user_type}</td>
                                <td>
                                    <div className="delete_btn">
                                        <Button onClick={deleteFriend(data.id)}>
                                            삭제
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>등록된 친구가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    min-width: 500px;

    border: none;
    overflow: hidden;

    table {
        width: 100%;
        margin: auto;

        text-align: center;
        border-collapse: collapse;
        border-spacing: 0;

        thead {
            background-color: #8c9cb2;
            color: white;

            tr {
                height: 50px;

                border-bottom: 1px solid #f1f1f1;

                th {
                    padding: 1rem;
                }
            }
        }

        tbody {
            tr {
                height: 100px;

                border-bottom: 1px solid #f1f1f1;
            }
        }
    }

    @media screen and (min-width: 550px) {
        margin: 0 2rem;

        border: 1px solid #f1f1f1;
        border-radius: 10px;
    }
`;
