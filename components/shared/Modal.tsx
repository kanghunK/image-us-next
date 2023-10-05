"use client";

import React, { useRef, useCallback, MouseEventHandler } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import Scrollbars from "react-custom-scrollbars-2";

interface ModalProps {
    children: React.ReactNode;
    scroll?: boolean;
    width?: string;
    height?: string;
}

const Modal = ({ children, scroll = true, width, height }: ModalProps) => {
    const wrapperEl = useRef(null);
    const router = useRouter();

    const onDismiss = useCallback(() => {
        router.back();
    }, [router]);

    const onClickWrapper: MouseEventHandler = useCallback(
        (e) => {
            if (e.target === wrapperEl.current) {
                if (onDismiss) {
                    onDismiss();
                }
            }
        },
        [onDismiss, wrapperEl]
    );

    return (
        <Wrapper ref={wrapperEl} onClick={onClickWrapper}>
            <Container width={width} height={height}>
                {scroll ? (
                    <Scrollbars universal={true}>{children}</Scrollbars>
                ) : (
                    children
                )}
            </Container>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    overflow: hidden;
    background-color: rgb(0, 0, 0, 0.65);
`;

const Container = styled.div<{ width?: string; height?: string }>`
    position: relative;
    width: ${({ width }) => width ?? "70%"};
    height: ${({ height }) => height ?? "70%"};
    max-width: 550px;
    box-sizing: border-box;

    border-radius: 10px;
    background: #fff;
    box-shadow: 0 30px 60px 0 rgba(90, 116, 148, 0.4);
`;

export default Modal;
