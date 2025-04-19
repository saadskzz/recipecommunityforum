import CustomButton from "../CustomButton"
import CustomInput from "../CustomInput"
import "./login.css"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useLoginUserMutation } from '../../Slices/authSlice'
import { useDispatch } from 'react-redux';
import { loginSuccess, verifyToken } from '../../Slices/authverify';
import { useState } from 'react';
import { MdOutlineFoodBank } from 'react-icons/md';

interface LoginForm {
    email: string,
    password: string
}

function Login() {
    const [userLogin] = useLoginUserMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { control, handleSubmit, formState: { isValid } } = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        mode: "onChange"
    })

    const onSubmit: SubmitHandler<LoginForm> = async ({ email, password }: LoginForm) => {
        try {
            const result = await userLogin({ email, password });
            const { data, error } = result;
            if (error) {
                console.error('Login failed:', error);
                setErrorMessage('Email or password is incorrect');
                setSuccessMessage(null);
                return;
            }
            if (data) {
                if (data.token) {
                    dispatch(loginSuccess({ token: data.token, userData: data }));
                    dispatch(verifyToken({ token: data.token }));
                    setSuccessMessage('Logged in successfully');
                    setErrorMessage(null);
                    navigate('/dashboard/home');
                }
            } else {
                console.error('No data received');
                setErrorMessage('Email or password is incorrect');
                setSuccessMessage(null);
            }
        } catch (err) {
            console.error('An unexpected error occurred:', err);
            setErrorMessage('An unexpected error occurred');
            setSuccessMessage(null);
        }
    }
    
    return (
        <div className="auth-input">
            <div className="inp-form-style">
                <div className="logo-container">
                    <MdOutlineFoodBank size={40} color="#e67e22" />
                    <h2 className="logo-text">RecipeCommunity</h2>
                </div>
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Sign in to continue to your account</p>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <CustomInput
                                {...field}
                                type="email"
                                placeholder="Enter your email"
                                error={error?.message}
                                name={field.name}
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        rules={{ required: "Password is required" }}
                        render={({ field, fieldState: { error } }) => (
                            <CustomInput
                                {...field}
                                type="password"
                                placeholder="Enter your password"
                                error={error?.message}
                                name={field.name}
                            />
                        )}
                    />

                    <CustomButton 
                        btnTxt='Login'
                        disabled={!isValid}
                    />
                    
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </form>
                
                <div className='signup-link'>
                    <p>Don't have an account?</p>
                    <Link to={'/signup'}>Register now</Link>
                </div>
            </div>
        </div>
    )
}

export default Login