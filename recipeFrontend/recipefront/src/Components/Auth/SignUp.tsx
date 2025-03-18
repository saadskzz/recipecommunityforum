import { useForm, Controller, SubmitHandler } from "react-hook-form"
import CustomButton from "../CustomButton"
import CustomInput from "../CustomInput"

import Authrec from "../../../authrec.png"
import './signup.css'
//firstName //lastName //email/ password/passwordConfirm
interface SignUpForm{
    firstName:String,
    lastName:String,
    email:String,
    password:String,
    passwordConfirm:String
}
function SignUp() {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            firstName:"",
            lastName:"",
            email:"",
            password:"",
            passwordConfirm:""
        },
      })
      const onSubmit: SubmitHandler<SignUpForm> = (data) => {
        console.log(data)
   
      }
  return (
    <div>
      <div className="auth-image-div">
      <img src={Authrec} alt="rectangle in auth" className="rec-image-div"/> 
      </div>
<div className="signup-input">
    <div className="inp-form-style">
    <form onSubmit={handleSubmit(onSubmit)}>
    <Controller
        name="firstName"
        control={control}
        render={({ field }) => <CustomInput {...field} type="text" placeholder="enter first name"/>}
      />
         <Controller
        name="lastName"
        control={control}
        render={({ field }) => <CustomInput {...field} type="text" placeholder="enter last name"/>}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => <CustomInput {...field} type="email" placeholder="enter email"/>}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => <CustomInput {...field} type="password" placeholder="password enter"/>}
      />
       <Controller
        name="passwordConfirm"
        control={control}
        render={({ field }) => <CustomInput {...field} type="password" placeholder="enter password again"/>}
      />
      <CustomButton btnTxt='sign up'/>
      
    </form>
    </div>
    
    </div>
    </div>
  )
}

export default SignUp