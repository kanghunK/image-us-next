"use client";

import React, { FormEvent, useCallback, useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { IconContext } from "react-icons/lib";
import { VscSearchStop } from "react-icons/vsc";

import { useFriend } from "@/hooks/useFriend";
import useInput from "@/hooks/useInput";
import useSearchMember from "@/hooks/useSearchMember";
import { DFriendData } from "@/lib/types";
import styled from "@emotion/styled";
import { Button } from "./shared/Button";

export default function SearchBox() {
    const [searchData, setSearchData] = useState<DFriendData>();
    const [queryParams, setQueryParams] = useState("");
    const [focusSearchBox, setFocusSearchBox] = useState(false);
    const [tmpInputData, setTmpInputData, handleTmpInputData] = useInput("");

    const { addFriend } = useFriend();
    const { data: searchDataList } = useSearchMember(queryParams);

    useEffect(() => {
        const debounce = setTimeout(() => {
            setQueryParams(tmpInputData);
        }, 300);
        return () => clearTimeout(debounce);
    }, [tmpInputData]);

    const onSubmitSearchData = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const clickItemData = searchDataList?.find(
                (data) => data.email === tmpInputData
            );
            setSearchData(clickItemData);
        },
        [tmpInputData, searchDataList]
    );

    const onClickPreviewItem = useCallback(
        (searchEmailData: DFriendData | undefined) => () => {
            if (searchEmailData?.id) {
                setTmpInputData(searchEmailData.email ?? "");
                setFocusSearchBox(false);

                const clickItemData = searchDataList?.find(
                    (data) => data.id === searchEmailData.id
                );
                setSearchData(clickItemData);
            }
        },
        [searchDataList, setTmpInputData]
    );

    const onClickAddFriend = (friendData: DFriendData) => async () => {
        await addFriend(friendData.id);
    };

    return (
        <Wrapper>
            <InputBox>
                <form onSubmit={onSubmitSearchData}>
                    <div className="search_input">
                        <label htmlFor="searchFriend">Search</label>
                        <input
                            type="text"
                            id="searchFriend"
                            name="search"
                            autoComplete="off"
                            placeholder="이메일을 입력하세요.."
                            onChange={handleTmpInputData}
                            onFocus={() => setFocusSearchBox(true)}
                            onBlur={() => setFocusSearchBox(false)}
                            value={tmpInputData}
                        />
                    </div>
                    <div className="search_btn">
                        <Button type="submit">검색</Button>
                    </div>
                </form>
                {focusSearchBox && (
                    <PreviewBox>
                        {searchDataList && searchDataList?.length !== 0 ? (
                            <ul className="preview_data">
                                <Scrollbars>
                                    {searchDataList.map((data: DFriendData) => (
                                        <li
                                            key={data.id}
                                            className="preview_item"
                                            onMouseDown={onClickPreviewItem(
                                                data
                                            )}
                                        >
                                            <div className="search_result_space">
                                                <span>이름: {data.name}</span>
                                                <span>
                                                    이메일: {data.email}
                                                </span>
                                                <span>
                                                    가입유형: {data.user_type}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </Scrollbars>
                            </ul>
                        ) : (
                            <div className="no_data">
                                <p>{`검색 결과가
없습니다.`}</p>
                            </div>
                        )}
                    </PreviewBox>
                )}
            </InputBox>
            <SearchResult>
                <h3>검색결과</h3>
                {searchData ? (
                    <div className="result_box">
                        <div className="result_data">
                            <p>
                                이름:
                                <span className="item">{searchData?.name}</span>
                            </p>
                            <p>
                                이메일:
                                <span className="item">
                                    {searchData?.email}
                                </span>
                            </p>
                        </div>
                        <div className="button_group">
                            <Button
                                type="button"
                                onClick={onClickAddFriend(searchData)}
                            >
                                친구 추가하기
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="not_found">
                        <IconContext.Provider
                            value={{
                                size: "100px",
                                style: { display: "inline-block" },
                            }}
                        >
                            <VscSearchStop />
                        </IconContext.Provider>
                        <div className="not_found_text">
                            <span>검색 결과가 없습니다.</span>
                        </div>
                    </div>
                )}
            </SearchResult>
        </Wrapper>
    );
}

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    height: 100%;
    box-sizing: border-box;

    p {
        margin: 0;
    }

    form {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;

        height: 60px;
        padding: 0 20px;
        border-radius: 30px;

        background: #fff;
        box-shadow: 0px 0px 5px 0px rgb(0 0 0 / 19%);

        .search_btn {
            padding-left: 10px;

            button {
                width: 60px;
                font-size: 0.5rem;
            }
        }
    }

    form .search_input {
        width: 100%;
        margin-left: 10px;

        label {
            position: absolute;
            display: block;
            z-index: 1;

            font-size: 12px;
            font-weight: bold;
        }
        input {
            width: 100%;
            border: 0;
            padding: 20px 0 0;
        }
        input:focus {
            outline: none;
            &::placeholder {
                color: transparent;
            }
        }
    }
`;

export const InputBox = styled.div`
    position: relative;
    top: 5px;

    width: 70%;
    max-width: 700px;
    min-width: 260px;
    margin: 0 1rem;
`;

export const PreviewBox = styled.div`
    position: absolute;

    width: calc(100% - 40px);
    margin-left: 20px;

    border-radius: 5px;
    box-shadow: rgb(0 0 0 / 30%) 0px 8px 12px 0px;
    background-color: white;

    .preview_data {
        height: 200px;
        padding: 0;

        .preview_item {
            padding: 1rem;
            font-size: 1rem;
            border-bottom: 1px solid #e9ecef;

            &:hover {
                background-color: #f7f7f9;
                cursor: pointer;
            }

            .search_result_space {
                display: flex;
                flex-direction: column;
                justify-content: center;

                gap: 0.3rem;
            }
        }
    }

    .no_data {
        height: 40px;

        text-align: center;

        p {
            position: relative;

            top: 50%;
            transform: translateY(-50%);
        }
    }

    @media screen and (max-width: 300px) {
        .no_data {
            height: 50px;
            white-space: pre-line;
        }
    }
`;

export const SearchResult = styled.div`
    width: 100%;
    margin-top: 30px;

    h3 {
        text-align: center;
    }

    .result_box {
        display: flex;
        flex-direction: column;
        align-items: center;

        margin-top: 15px;
        gap: 1.5rem;

        .result_data {
            display: flex;
            flex-direction: column;
            justify-content: center;

            gap: 1rem;

            .item {
                font-weight: bolder;
            }
        }

        .button_group {
            display: flex;
            justify-content: center;
            gap: 1rem;
        }

        @media screen and (max-width: 340px) {
            .button_group {
                flex-direction: column;
            }
        }
    }

    .not_found {
        max-width: 500px;
        padding: 1rem 0;
        margin: auto;
        text-align: center;

        .not_found_text {
            margin-top: 20px;
        }
    }
`;
