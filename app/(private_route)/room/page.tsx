"use client";

import Image from "next/image";
import { Button } from "@/components/shared/button";
import { useRouter } from "next/navigation";
import { lobster } from "../../fonts";

import cameraImage from "../public/camera_image.png";
import styles from "./room.module.scss";
import RootLayout from "../../layout";

export default function Room() {
    const router = useRouter();

    return (
        <div>룸 목록 페이지</div>
        // <div className={styles.main_background}>
        //     <Image alt="camera image" src={cameraImage} height={130} />
        //     <h1 className={`${styles.logo_text} ${lobster.className}`}>
        //         ImageUs
        //     </h1>
        //     <div className={styles.btn_group}>
        //         <Button
        //             style={{ backgroundColor: "#00A3EC" }}
        //             onClick={() => router.push("/login")}
        //         >
        //             로그인 하기
        //         </Button>
        //         <Button
        //             style={{ backgroundColor: "#00A3EC" }}
        //             onClick={() => router.push("/signup")}
        //         >
        //             회원가입 하기
        //         </Button>
        //     </div>
        // </div>
    );
}
