import Modal from "@/components/shared/Modal";
import styles from "./styles.module.css";

export default function Loading() {
    return (
        <Modal>
            <div className={styles.loading_skeleton_container}>
                <div className={styles.react_loading_skeleton}></div>
                <div className={styles.react_loading_skeleton}></div>
                <div className={styles.react_loading_skeleton}></div>
            </div>
        </Modal>
    );
}
