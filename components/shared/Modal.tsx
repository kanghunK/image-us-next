"use client";

import React, {
    useEffect,
    useRef,
    useMemo,
    useState,
    useCallback,
    MouseEventHandler,
} from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import Scrollbars from "react-custom-scrollbars-2";

interface ModalProps {
    children: React.ReactNode;
    scroll?: boolean;
    height?: string;
}

const Modal = ({ children, scroll = true, height }: ModalProps) => {
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
            <Container height={height}>
                {scroll ? <Scrollbars>{children}</Scrollbars> : children}
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
`;

const Container = styled.div<{ height?: string }>`
    position: relative;
    width: 70%;
    height: ${({ height }) => height ?? "70%"};
    max-width: 600px;
    box-sizing: border-box;

    border-radius: 10px;
    background: #fff;
    box-shadow: 0 30px 60px 0 rgba(90, 116, 148, 0.4);
`;

export default Modal;
