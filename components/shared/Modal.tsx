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

interface ModalProps {
    children: React.ReactNode;
}

const Modal = ({ children }: ModalProps) => {
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
            {children}
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
`;

export default Modal;
