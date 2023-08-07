import { useNavigate } from "react-router-dom";
import { Layout } from "../components/common/layout";
import { ButtonPrimary } from "../components/button/button-primary";

export function NotFound() {
    const navigate = useNavigate();
    const onClickGoHomePage = () => {
        navigate("/")
    }
    return <Layout className="flex justify-center items-center flex-col">
        <h1 className="font-primary font-bold text-[200px] text-youtube-primary">404</h1>
        <p className="font-primary text-[30px] pb-10">Oops, Your page is not here!</p>
        <div>
            <ButtonPrimary onClick={onClickGoHomePage}>Home page</ButtonPrimary>
        </div>
    </Layout>
}