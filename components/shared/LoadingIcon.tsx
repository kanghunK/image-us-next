"use client";

import React from "react";
import styled from "@emotion/styled";
import ReactLoading, { LoadingType } from "react-loading";

interface LoadingProps {
    loadingType: LoadingType;
}

export default function LoadingCompoent({ loadingType }: LoadingProps) {
    return (
        <Wrapper>
            <ReactLoading type={loadingType} color="black" />
        </Wrapper>
    );
}

const Wrapper = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;
