import './Auth/custominput.css'
import { Input } from 'antd';
interface inpProps { onChange: (...event: any[]) => void, value: string; disabled?: boolean | undefined; name: string; type?: string;placeholder:string }
const CustomInput = ({type,value,placeholder,onChange}:inpProps) => (
  <div className='custom-inp'>
    <Input size="large" placeholder={placeholder} value={value} onChange={onChange} type={type} className='ant-inp'  />
  
  </div>
);

export default CustomInput;