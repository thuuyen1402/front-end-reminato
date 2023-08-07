
import { ReactNode } from "react";
import { Button, ButtonProps } from "semantic-ui-react";

export interface ButtonPrimary {
    children: ReactNode;
    className?: string | JSX.Element;
}
export const ButtonPrimary = ({ children, className = "", ...props }: ButtonPrimary & ButtonProps) => {
    return <Button
        {...props}
        className={`
        !bg-youtube-primary !shadow-md !text-white  hover:grayscale-[20%]
        ${className}`}
    >
        {children}
    </Button>
}