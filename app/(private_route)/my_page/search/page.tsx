import styled from "@emotion/styled";
import SearchBox from "@/components/SearchBox";

export default function SearchFriend() {
    return <SearchBox />;
}

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    height: 100%;
    box-sizing: border-box;

    p {
        margin: 0;
    }

    form {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;

        height: 60px;
        padding: 0 20px;
        border-radius: 30px;

        background: #fff;
        box-shadow: 0px 0px 5px 0px rgb(0 0 0 / 19%);

        .search_btn {
            padding-left: 10px;

            button {
                width: 60px;
                font-size: 0.5rem;
            }
        }
    }

    form .search_input {
        width: 100%;
        margin-left: 10px;

        label {
            position: absolute;
            display: block;
            z-index: 1;

            font-size: 12px;
            font-weight: bold;
        }
        input {
            width: 100%;
            border: 0;
            padding: 20px 0 0;
        }
        input:focus {
            outline: none;
            &::placeholder {
                color: transparent;
            }
        }
    }
`;

export const InputBox = styled.div`
    position: relative;

    width: 70%;
    max-width: 700px;
    min-width: 260px;
    margin: 0 1rem;
`;

export const PreviewBox = styled.div`
    position: absolute;

    width: calc(100% - 40px);
    margin-left: 20px;

    border-radius: 5px;
    box-shadow: rgb(0 0 0 / 30%) 0px 8px 12px 0px;
    background-color: white;

    .preview_data {
        height: 200px;
        padding: 0;

        .preview_item {
            padding: 1rem;
            font-size: 1rem;
            border-bottom: 1px solid #e9ecef;

            &:hover {
                background-color: #f7f7f9;
                cursor: pointer;
            }

            .search_result_space {
                display: flex;
                flex-direction: column;
                justify-content: center;

                gap: 0.3rem;
            }
        }
    }

    .no_data {
        height: 40px;

        text-align: center;

        p {
            position: relative;

            top: 50%;
            transform: translateY(-50%);
        }
    }

    @media screen and (max-width: 300px) {
        .no_data {
            height: 50px;
            white-space: pre-line;
        }
    }
`;

export const SearchResult = styled.div`
    width: 100%;
    margin-top: 30px;

    h3 {
        text-align: center;
    }

    .result_box {
        display: flex;
        flex-direction: column;
        align-items: center;

        margin-top: 15px;
        gap: 1.5rem;

        .result_data {
            display: flex;
            flex-direction: column;
            justify-content: center;

            gap: 1rem;

            .item {
                font-weight: bolder;
            }
        }

        .button_group {
            display: flex;
            justify-content: center;
            gap: 1rem;
        }

        @media screen and (max-width: 340px) {
            .button_group {
                flex-direction: column;
            }
        }
    }

    .not_found {
        max-width: 500px;
        padding: 1rem 0;
        margin: auto;
        text-align: center;

        .not_found_text {
            margin-top: 20px;
        }
    }
`;
