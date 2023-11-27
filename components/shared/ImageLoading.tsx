import { arvo } from "@/app/fonts";
import React from "react";
import styled from "@emotion/styled";

export default function ImageLoading() {
    return (
        <Container>
            <div className="circle_box">
                <div>
                    <span className={`${arvo.className} text`}>
                        {`이미지
로딩중`}
                    </span>
                </div>
            </div>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;

    color: #363745;

    .circle_box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        width: 100px;
        height: 100px;

        padding: 2rem;
        border-radius: 50%;
        background-color: #f8f8ff;

        .text {
            font-size: 1.2rem;
            line-height: 1.8rem;
            white-space: pre;
            text-align: center;
        }
    }
`;
