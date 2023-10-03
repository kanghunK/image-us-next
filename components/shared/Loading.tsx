"use client";

import React from "react";
import styled from "@emotion/styled";
import ReactLoading from "react-loading";

export default function LoadingCompoent() {
    return (
        <Wrapper>
            <ReactLoading type="spinningBubbles" color="black" />
        </Wrapper>
    );
}

const Wrapper = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;
