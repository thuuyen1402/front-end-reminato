import { Button, Icon, Input, Modal } from "semantic-ui-react";
import { FormView } from "../form";
import { useFormik } from "formik";
import serviceAuth from "@services/auth";
import { authStore } from "@stores/auth-store";
import toast from "react-hot-toast";
import { getError } from "@utils/error";
import { useFormikErrorSubscribe } from "@hooks";
import { signInValidation } from "@validations/auth";
import { videoStore } from "@stores/video-store";

export interface ModalLogin {
    className?: string;
}

export function ModalLogin({
    className = ""
}: ModalLogin) {
    const { isAuth, setAuth, isOpen, onOpen, onClose } = authStore();
    const { fetchVideo } = videoStore();
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: signInValidation,
        onSubmit: async (values) => {
            try {
                const res = await serviceAuth.authSignIn({ data: values });
                const data = res.data.data;
                if (data.user == null)
                    throw new Error("User isn't exist")
                setAuth(data.user as UserSimpleInfo);

                onClose();
                formik.setValues({
                    email: "",
                    password: ""
                });
                await fetchVideo();
                toast.success("Sign in success");
            } catch (err) {

                toast.error(getError(err))
            }
        }
    })
    const { isError } = useFormikErrorSubscribe({ formik })
    if (isAuth) return null

    return <FormView formik={formik} className={` ${className}`}>
        <Modal
            onOpen={onOpen}
            onClose={onClose}
            open={isOpen}
            className="!max-w-[400px]"
            trigger={
                <Button data-testid="modal-login" type="button" className="!bg-youtube-primary hover:grayscale-[20%] !shadow-lg" icon >
                    <Icon size="large" className="text-white" name='meh' />
                </Button>
            }
        >
            <Modal.Header>Hi there!</Modal.Header>
            <Modal.Content className="!flex justify-center gap-2 items-center flex-col px-5 ">
                <Input
                    value={formik.values.email}
                    aria-label="email-mobile"
                    className="font-primary w-full"
                    loading={false}
                    icon='mail'
                    placeholder='email'
                    name="email"
                    onChange={formik.handleChange}
                    iconPosition='left'
                />
                <Input
                    value={formik.values.password}
                    aria-label="password-mobile"
                    type='password'
                    className="font-primary w-full"
                    loading={false}
                    icon='lock'
                    placeholder='password'
                    name="password"
                    onChange={formik.handleChange}
                    iconPosition='left' />
            </Modal.Content>
            <Modal.Actions className="!flex flex-row gap-2 justify-center items-center">
                <Button

                    type="button"
                    className="!shadow-md"
                    color='black'
                    onClick={onClose}>
                    Close
                </Button>
                <Button
                    aria-label="login-button-mobile"
                    disabled={isError}
                    onClick={() => {
                        formik.submitForm()
                    }} 
                    type="button" 
                    className="!bg-youtube-primary !text-white  hover:grayscale-[20%] !shadow-md">Login / Register</Button>
            </Modal.Actions>
        </Modal>
    </FormView>
}