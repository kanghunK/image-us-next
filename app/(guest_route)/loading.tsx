"use client";

import React from "react";
import styled from "@emotion/styled";
import LoadingCompoent from "@/components/shared/LoadingIcon";
import { roboto } from "../fonts";

export default function Loading() {
    return (
        <LoadingContainer>
            <div className={`${roboto.className} loading_text`}>
                <span className="text">페이지 로딩중</span>
            </div>
            <LoadingCompoent loadingType="spokes" />
        </LoadingContainer>
    );
}

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;

    .loading_text {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);

        .text {
            font-size: 1.2rem;
        }
    }
`;
