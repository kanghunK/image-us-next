import styled from "@emotion/styled";

const buttonColor = {
    warning: "#212529",
    default: "#ffffff",
};
const buttonBgColor = {
    success: "#28a745",
    error: "#dc3545",
    warning: "#ffc107",
    default: "#2364d2",
};
const buttonHoverBgColor = {
    success: "#218838",
    error: "#c82333",
    warning: "#e0a800",
    default: "#025ce2",
};

const Button = styled.button`
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    background: ${buttonBgColor.default};
    color: ${buttonColor.default};

    margin: 0;
    padding: 0.5rem 1rem;

    font-size: 1rem;
    font-weight: 400;
    text-align: center;
    text-decoration: none;

    border: none;
    border-radius: 4px;

    display: inline-block;
    width: auto;

    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);

    cursor: pointer;

    transition: 0.5s;

    &.success {
        background: ${buttonBgColor.success};

        &:hover,
        &:active,
        &:focus {
            background: ${buttonHoverBgColor.success};
            outline: 0;
        }
        &:disabled {
            opacity: 0.5;
        }
    }

    &.error {
        background: ${buttonBgColor.error};

        &:hover,
        &:active,
        &:focus {
            background: ${buttonHoverBgColor.error};
            outline: 0;
        }
        &:disabled {
            opacity: 0.5;
        }
    }

    &.warning {
        color: ${buttonColor.warning};
        background: ${buttonBgColor.warning};

        &:hover,
        &:active,
        &:focus {
            background: ${buttonHoverBgColor.warning};
            outline: 0;
        }
        &:disabled {
            opacity: 0.5;
        }
    }
`;

export { Button };
