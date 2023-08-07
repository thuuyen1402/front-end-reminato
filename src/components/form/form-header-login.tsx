import { useFormik } from 'formik'
import { FormView } from './form-view';
import { Button, Input } from 'semantic-ui-react';
import toast from 'react-hot-toast';
import { getError } from '@utils/error';
import serviceAuth from '@services/auth';
import { useFormikErrorSubscribe } from '@hooks';
import { signInValidation } from '@validations/auth';
import { authStore } from '@stores/auth-store';
import { videoStore } from '@stores/video-store';

export interface FormHeaderLogin {
    className?: string;
}
export function FormHeaderLogin({ className = "" }: FormHeaderLogin) {
    const { isAuth, setAuth } = authStore();
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
                setAuth(data.user as UserSimpleInfo);
                await fetchVideo();
                toast.success("Sign in success");
                formik.setValues({
                    email: "",
                    password: ""
                })
             
            } catch (err) {

                toast.error(getError(err))
            }
        }
    })
    const { isError } = useFormikErrorSubscribe({ formik })
    if (isAuth) return null

    return <FormView className={`${className}`} formik={formik}>
        <div className="flex flex-row gap-2">
            <Input
                value={formik.values.email}
                className="font-primary"
                loading={false}
                icon='mail'
                placeholder='email'
                name="email"
                onChange={formik.handleChange}
                iconPosition='left'
            />

            <Input
                value={formik.values.password}
                type='password'
                className="font-primary"
                loading={false}
                icon='lock'
                placeholder='password'
                name="password"
                onChange={formik.handleChange}
                iconPosition='left' />

            <Button type="submit"
                disabled={isError}
                className="!bg-youtube-primary !shadow-md !text-white  hover:grayscale-[20%]"
            >
                Login / Register
            </Button>
        </div>
    </FormView>
}