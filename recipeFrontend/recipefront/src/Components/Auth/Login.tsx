import CustomButton from "../CustomButton"
import CustomInput from "../CustomInput"
import "./login.css"
import '../../../authrec.png'
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import {useLoginUserMutation} from '../../Slices/authSlice'
import AuthRec from '../../../authrec.png'
import { useDispatch } from 'react-redux';
import { loginSuccess,verifyToken } from '../../Slices/authverify';

interface LoginForm {
    email:String,
    password:String
}
function Login() {
const [userLogin] = useLoginUserMutation();
const navigate = useNavigate();
const dispatch = useDispatch();

    const { control, handleSubmit } = useForm({
        defaultValues: {
        email:"",
        password:""
        },
      })
      const onSubmit: SubmitHandler<LoginForm> = async ({ email, password }: LoginForm) => {
        try {
          const result = await userLogin({ email, password });
          const { data, error } = result;
          if (error) {
            console.error('Login failed:', error);
            return;
          }
          if (data) {
            if(data.token){
           
              dispatch(loginSuccess({ token: data.token, userData: data }));
              dispatch(verifyToken({token:data.token}))

              navigate('/dashboard/forum/allposts'); // Navigate to the protected route
            }
          } else {
            console.error('No data received');
          }
        } catch (err) {
          console.error('An unexpected error occurred:', err);
        }
      }
  return (
    <div>
      <div className="auth-image-div">
      <img src={AuthRec} alt="rectangle in auth" className="rec-image-div"/> 
      </div>
<div className="auth-input">
    <div className="inp-form-style">
    <form onSubmit={handleSubmit(onSubmit)}>
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
  <CustomButton btnTxt='login'/>
      
    </form>
    </div>
    
    </div>
    </div>
  )
}

export default Login