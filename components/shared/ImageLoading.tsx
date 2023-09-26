import { arvo } from "@/app/fonts";
import React from "react";
import ReactLoading from "react-loading";
import styled from "@emotion/styled";

export default function ImageLoading() {
    return (
        <Container>
            <div className="circle_box">
                <div className="text_box">
                    <span className={`${arvo.className} text`}>Loading...</span>
                    <ReactLoading
                        type="cylon"
                        color="#363745"
                        className="loading"
                    />
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

        .text_box {
            position: relative;

            .text {
                font-size: 1.2rem;
            }

            .loading {
                position: absolute;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
            }
        }
    }
`;
