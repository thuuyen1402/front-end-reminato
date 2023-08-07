import { ReactNode, forwardRef } from "react"



export function TestComponent() {
    return <div>TESTING COMPONENT</div>
}

export interface TestChildComponent {
    children?: ReactNode;
    className?: string;
}
export function TestChildComponent({ children, className = "" }: TestChildComponent) {
    return <div className={className}>{children}</div>
}


export const TestComponentForwardRef = forwardRef<HTMLDivElement>((_props, ref) => {
    {
        return <div ref={ref}>TESTING COMPONENT</div>
    }
}) 