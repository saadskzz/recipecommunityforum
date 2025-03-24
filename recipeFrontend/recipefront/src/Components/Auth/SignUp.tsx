import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSignUpUserMutation } from "../../Slices/authSlice"; // Adjust the path to where authApi is defined
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import Authrec from "../../../authrec.png";
import './signup.css';



//firstName //lastName //email/ password/passwordConfirm
interface SignUpForm{
    firstName:String,
    lastName:String,
    email:String,
    password:String,
    passwordConfirm:String
}
function SignUp() {
  const navigate = useNavigate();
  const [signUpUser, { isLoading, isError, error }] = useSignUpUserMutation();

  const { control, handleSubmit, watch, formState: { isValid } } = useForm<SignUpForm>({
      mode: "onChange", // Validate on every change for real-time feedback
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
    console.log("Form data before submission:", {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm
  });
    try {
        await signUpUser(data).unwrap(); // Send data to backend and unwrap the result
        navigate('/login'); // Redirect to login page on success
        console.log('submitting')
    } catch (err) {
        // Errors are automatically caught and reflected in isError and error
        console.error("Sign-up failed:", err);
    }
};
  return (
   <div>
            <div className="auth-image-div">
                <img src={Authrec} alt="rectangle in auth" className="rec-image-div" />
            </div>
            <div className="signup-input">
                <div className="inp-form-style">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="firstName"
                            control={control}
                            rules={{ required: "First name is required" }}
                            render={({ field, fieldState: { error } }) => (
                                <CustomInput 
                                    {...field} 
                                    type="text" 
                                    placeholder="enter first name" 
                                    error={error?.message} 
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
                                    placeholder="enter last name" 
                                    error={error?.message} 
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
                                    placeholder="enter email" 
                                    error={error?.message} 
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
                                    placeholder="enter password" 
                                    error={error?.message} 
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
                                    placeholder="enter password again" 
                                    error={error?.message} 
                                />
                            )}
                        />
                        <CustomButton 
                            btnTxt={isLoading ? "Signing up..." : "sign up"} 
                            disabled={!isValid || isLoading}  onClick={onSubmit}
                            backgroundColor="green"
                        />
                        {isError && (
                            <p style={{ color: 'red' }}>
                                {error?.data?.message || "An error occurred during sign-up"}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
  )
}

export default SignUp