import { useUserData } from "@/states/stores/userData";
import { redirect } from "next/navigation";
import LoadingCompoent from "./Loading";
import { useEffect } from "react";
import { checkAuth, removeLocalStorageData } from "@/utils/userFetcher";

interface CheckGuestProps {
    children: React.ReactNode;
}

const checkGuest = (
    Component: ({ children }: CheckGuestProps) => JSX.Element
) => {
    const CheckState = (props: CheckGuestProps) => {
        const [userData, setUserData] = useUserData();

        const updateLoginState = async () => {
            const userInfo = await checkAuth();

            if (userInfo) {
                setUserData((prev) => ({ ...prev, loginState: "login" }));
            } else {
                setUserData((prev) => ({ ...prev, loginState: "logout" }));
                removeLocalStorageData();
            }
        };

        useEffect(() => {
            updateLoginState();
        }, []);

        if (userData.loginState === "login") {
            return redirect("/room");
        }

        if (userData.loginState === "loading") return <LoadingCompoent />;

        return <Component {...props} />;
    };

    return CheckState;
};

export default checkGuest;
