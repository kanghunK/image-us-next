"use client";

import Link from "next/link";
import styled from "@emotion/styled";
import { arvo } from "./fonts";

export default function NotFound() {
    return (
        <Wrapper className={arvo.className}>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 ">
                        <div className="col-sm-10 col-sm-offset-1  text-center">
                            <div className="four_zero_four_bg">
                                <h1 className="text-center ">404</h1>
                            </div>

                            <div className="contant_box_404">
                                <h3 className="h2">
                                    페이지를 찾을수 없습니다.
                                </h3>

                                <p>접속하려는 주소를 다시 확인해주세요!</p>

                                <Link href="/" className="link_404">
                                    홈으로 돌어가기
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.section`
    padding: 40px 0;
    background: #fff;
    text-align: center;

    img {
        width: 100%;
    }

    .four_zero_four_bg {
        background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
        height: 400px;
        background-position: center;

        h1,
        h3 {
            font-size: 80px;
        }
    }

    .contant_box_404 {
        margin-top: -50px;

        .link_404 {
            color: #fff !important;
            padding: 10px 20px;
            background: #39ac31;
            margin: 20px 0;
            display: inline-block;
            text-decoration: none;
        }
    }
`;
