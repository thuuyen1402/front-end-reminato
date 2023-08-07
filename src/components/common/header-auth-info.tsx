import { Button, Icon } from "semantic-ui-react"
import { ButtonPrimary } from "../button/button-primary"
import { useNavigate } from "react-router-dom";
import { authStore } from "@stores/auth-store";
import toast from "react-hot-toast";
import { useCallback } from "react";

export interface HeaderAuthInfo {
    className?: string;
}
export function HeaderAuthInfo({ className = "" }: HeaderAuthInfo) {
    const { isAuth, user, logout } = authStore();
    const navigate = useNavigate()
    const logoutToast = useCallback(() => {
        logout();
        toast.success("Logout succeed", {
            duration: 3000
        })
    }, [])

    const navigateSharingPage = useCallback(() => {
        navigate("/video/sharing")
    }, [])

    if (!isAuth) return null;

    return <div className={` ${className}`}>

        {/* For desktop device */}
        <div className="hidden md:flex flex-row gap-3 justify-center items-center">
            <p>Welcome to <span className="font-bold first-letter:uppercase">{user?.email}</span></p>

            <ButtonPrimary onClick={navigateSharingPage} data-testid='sharing' className="!whitespace-nowrap">
                Share a movie
            </ButtonPrimary>

            <ButtonPrimary data-testid='sign-out' onClick={logoutToast}>Logout</ButtonPrimary>
        </div>
        {/* For mobile device */}
        <div className="flex flex-row gap-2 md:hidden">

            <Button aria-label="sharing-button-mobile" onClick={navigateSharingPage} data-testid='sharing' className="!bg-youtube-primary hover:grayscale-[20%] shadow-md" icon >
                <Icon name="share" className=" text-white" />
            </Button>

            <Button aria-label="logout-button-mobile" data-testid='sign-out' onClick={logoutToast} className="!bg-youtube-primary hover:grayscale-[20%] shadow-md" icon >
                <Icon name="sign out" className=" text-white" />
            </Button>
        </div>
    </div >
}