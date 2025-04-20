import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpUserMutation } from "../../Slices/authSlice"; 
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import './signup.css';
import { MdOutlineFoodBank } from 'react-icons/md';
import { useState, useEffect } from "react";
import ThemeToggle from '../ThemeToggle';
import { ThemeProvider } from '../../contexts/ThemeContext';

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Set data-theme attribute on the document element
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

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
        const { passwordConfirm, ...signupData } = data;
        
        const response = await signUpUser(signupData).unwrap();
        
        if (response.message === "User registered successfully") {
            setSuccessMessage('Registration successful! Redirecting to login...');
            setErrorMessage(null);
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        }
    } catch (error: any) {
        if (error.data && error.data.message) {
            setErrorMessage(error.data.message);
        } else {
            setErrorMessage('An error occurred during registration');
        }
        setSuccessMessage(null);
    }
};
  return (
   <ThemeProvider>
    <div className="auth-input">
        <div className="inp-form-style">
            <div className="auth-header">
                <div className="logo-container">
                    <MdOutlineFoodBank size={40} color="var(--primary-color)" />
                    <h2 className="logo-text">RecipeCommunity</h2>
                </div>
                <ThemeToggle />
            </div>
            <h1 className="auth-title">Create Your Account</h1>
            <p className="auth-subtitle">Join our community of food enthusiasts</p>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="name-fields">
                    <div className="name-field">
                        <Controller
                            name="firstName"
                            control={control}
                            rules={{ required: "First name is required" }}
                            render={({ field, fieldState: { error } }) => (
                                <CustomInput 
                                    {...field} 
                                    type="text" 
                                    placeholder="First name" 
                                    error={error?.message} 
                                    name={field.name}
                                />
                            )}
                        />
                    </div>
                    <div className="name-field">
                        <Controller
                            name="lastName"
                            control={control}
                            rules={{ required: "Last name is required" }}
                            render={({ field, fieldState: { error } }) => (
                                <CustomInput 
                                    {...field} 
                                    type="text" 
                                    placeholder="Last name" 
                                    error={error?.message} 
                                    name={field.name}
                                />
                            )}
                        />
                    </div>
                </div>
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
                    rules={{
                        required: "Password is required",
                        minLength: { value: 6, message: "Password must be at least 6 characters" }
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <CustomInput 
                            {...field} 
                            type="password" 
                            placeholder="Create a password" 
                            error={error?.message} 
                            name={field.name}
                        />
                    )}
                />
                <Controller
                    name="passwordConfirm"
                    control={control}
                    rules={{
                        required: "Please confirm your password",
                        validate: (value) => value === password || "Passwords do not match"
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <CustomInput 
                            {...field} 
                            type="password" 
                            placeholder="Confirm your password" 
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
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
            
            <div className="signup-link">
                <p>Already have an account?</p>
                <Link to={'/login'}>Sign in</Link>
            </div>
        </div>
    </div>
    </ThemeProvider>
  )
}

export default SignUp