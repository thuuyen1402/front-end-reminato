import { ReactNode } from "react"
import { Header } from "./header";
import { BackToTop } from "../back-to-top";

export interface Layout {
    children: ReactNode;
    title?: string;
    content?: string;
    faviconUrl?: string;
    mainClassName?: string;
    className?: string;
    activePage?: string
}

export function Layout({
    children,
    mainClassName = "",
    className = "",
}: Layout) {

    return <>
        <div aria-label="layout" className={`flex min-h-screen flex-col items-center justify-center ${mainClassName}`}>
            <Header />
            <div className={`flex-grow  ${className}`}>
                {children}
            </div>
            <BackToTop />
        </div>
    </>

}