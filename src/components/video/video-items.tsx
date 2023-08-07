import { LegacyRef, ReactNode, forwardRef } from "react";

export interface VideoItems {
    className?: string;
    children: ReactNode
}
export const VideoItems = forwardRef(function VideoItems({
    className = "",
    children
}: VideoItems, ref: LegacyRef<HTMLDivElement>) {
    return <div
        ref={ref}
        className={`flex flex-col gap-[60px] justify-center items-center ${className}`}>
        {children}
    </div>
})