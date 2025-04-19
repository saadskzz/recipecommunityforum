import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpUserMutation } from "../../Slices/authSlice"; 
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import './signup.css';
import { MdOutlineFoodBank } from 'react-icons/md';
import { useState } from "react";

//firstName //lastName //email/ password/passwordConfirm
interface SignUpForm {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    passwordConfirm: string
}

function SignUp() {
  const navigate = useNavigate();
  const [signUpUser, { isLoading }] = useSignUpUserMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { control, handleSubmit, watch, formState: { isValid } } = useForm<SignUpForm>({
      mode: "onChange", 
      defaultValues: {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          passwordConfirm: ""
      },
  });
  
  
  const password = watch("password");
  const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
    try {
        await signUpUser(data).unwrap(); 
        navigate('/login'); 
    } catch (err: any) {
        console.error("Sign-up failed:", err);
        setErrorMessage(err.data?.message || "An error occurred during sign-up");
    }
};
  return (
   <div className="signup-input">
            <div className="inp-form-style">
                <div className="logo-container">
                    <MdOutlineFoodBank size={40} color="#e67e22" />
                    <h2 className="logo-text">RecipeCommunity</h2>
                </div>
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Join our community of food enthusiasts</p>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="firstName"
                        control={control}
                        rules={{ required: "First name is required" }}
                        render={({ field, fieldState: { error } }) => (
                            <CustomInput 
                                {...field} 
                                type="text" 
                                placeholder="Enter first name" 
                                error={error?.message} 
                                name={field.name}
                            />
                        )}
                    />
                    <Controller
                        name="lastName"
                        control={control}
                        rules={{ required: "Last name is required" }}
                        render={({ field, fieldState: { error } }) => (
                            <CustomInput 
                                {...field} 
                                type="text" 
                                placeholder="Enter last name" 
                                error={error?.message} 
                                name={field.name}
                            />
                        )}
                    />
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
                                placeholder="Enter email" 
                                error={error?.message} 
                                name={field.name}
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" }
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <CustomInput 
                                {...field} 
                                type="password" 
                                placeholder="Create password" 
                                error={error?.message} 
                                name={field.name}
                            />
                        )}
                    />
                    <Controller
                        name="passwordConfirm"
                        control={control}
                        rules={{
                            required: "Password confirmation is required",
                            validate: (value) => value === password || "Passwords do not match"
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <CustomInput 
                                {...field} 
                                type="password" 
                                placeholder="Confirm password" 
                                error={error?.message} 
                                name={field.name}
                            />
                        )}
                    />
                    <CustomButton 
                        btnTxt={isLoading ? "Signing up..." : "Create Account"} 
                        disabled={!isValid || isLoading}
                    />
                    
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
                
                <div className="login-link">
                    <p>Already have an account?</p>
                    <Link to={'/login'}>Log in</Link>
                </div>
            </div>
        </div>
  )
}

export default SignUp