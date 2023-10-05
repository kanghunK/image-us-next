import { useUserData } from "@/states/stores/userData";
import { redirect } from "next/navigation";
import { checkAuth, removeLocalStorageData } from "@/utils/userFetcher";
import { useEffect } from "react";

interface WithAuthProps {
    children: React.ReactNode;
    modal: React.ReactNode;
}

function withAuth(
    Component: ({ children, modal }: WithAuthProps) => JSX.Element
) {
    const Auth = (props: WithAuthProps) => {
        const [userData, setUserData] = useUserData();
        const updateLoginState = async () => {
            const userInfo = await checkAuth();

            if (userInfo) {
                await setUserData((prev) => ({
                    ...prev,
                    loginState: "login",
                    user_info: { ...userInfo },
                }));
            } else {
                await setUserData((prev) => ({
                    ...prev,
                    loginState: "logout",
                }));
            }
        };

        useEffect(() => {
            updateLoginState();
        }, []);

        if (userData.loginState === "logout") {
            removeLocalStorageData();
            return redirect("/login");
        }

        return <Component {...props} />;
    };

    return Auth;
}

export default withAuth;
