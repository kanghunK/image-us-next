"use client";

import React from "react";
import styled from "@emotion/styled";
import { roboto } from "@/app/fonts";
import LoadingCompoent from "@/components/shared/Loading";

export default function Loading() {
    return (
        <LoadingContainer>
            <div className={`${roboto.className} loading_text`}>
                <span className="text">정보 불러오는중</span>
            </div>
            <LoadingCompoent loadingType="balls" />
        </LoadingContainer>
    );
}

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;

    .text {
        font-size: 1.2rem;
    }
`;
