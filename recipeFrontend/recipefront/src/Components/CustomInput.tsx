import './Auth/custominput.css'
import { Input } from 'antd';

interface inpProps { 
  onChange: (...event: any[]) => void, 
  value: string; 
  disabled?: boolean | undefined; 
  name: string; 
  type?: string;
  placeholder: string;
  error?: string;
}

const CustomInput = ({ type, value, placeholder, onChange, name, error }: inpProps) => (
  <div className='custom-inp'>
    <Input 
      size="large" 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange} 
      type={type} 
      name={name} 
      className='ant-inp'  
    />
    {error && <p style={{ color: 'red' }}>{error}</p>}
  </div>
);

export default CustomInput;