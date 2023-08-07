import { Button, Icon, Popup } from "semantic-ui-react"
import { FormHeaderLogin } from "../form"
import { ModalLogin } from "../modal/modal-login"
import { Link } from "react-router-dom"
import { HeaderAuthInfo } from "./header-auth-info"
import { videoStore } from "@stores/video-store"
import { useCallback } from "react"


export interface Header {
    className?: string
}
export function Header({ className = "" }: Header) {

    const { fetchVideo } = videoStore();

    const refreshVideo = useCallback(() => {
        fetchVideo()
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [])

    return <nav className={` border-b-[3px] bg-white sticky top-0 border-b-red-600 flex flex-row justify-between items-center
    py-3 px-5 md:px-10 w-[90%]
    ${className}`}>
        <Link to="/">
            <div className="flex flex-row gap-1 items-center ">
                <Icon size="huge" className="text-youtube-primary" name="video play"></Icon>
                <h1 className="font-primary text-[24px]"> Funny Movies</h1>
            </div>
        </Link>

        <div className="flex flex-row gap-1">
            {/* Auth info*/}
            <HeaderAuthInfo />
            {/* Not Auth */}
            {/* Login */}
            <ModalLogin className="!block md:!hidden" />
            <FormHeaderLogin className="!hidden md:!block" />
            {/* Refresh feed */}
            <Popup content='Refresh your feed' trigger={
                <Button aria-label="refresh-button" onClick={refreshVideo} className="!bg-youtube-primary hover:grayscale-[20%] shadow-md" icon >
                    <Icon name="refresh" className=" text-white" />
                </Button>
            } />
        </div>
    </nav>
}