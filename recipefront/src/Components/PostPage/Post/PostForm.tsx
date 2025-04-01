import './addpost.css'
import { Input } from 'antd';

interface inpProps { 
  onChange: (...event: any[]) => void; 
  value: string; 
  disabled?: boolean | undefined; 
  name: string; 
  type?: string;
  placeholder: string;
  title: string;
  instructions:String;
  ingredients: string[];
  discussionCategory: string;
}

const PostForm = ({value, placeholder, onChange}: inpProps) => (
  <div className='custom-inp'>
    <Input size="large" placeholder={placeholder} value={value} onChange={onChange}  className='ant-inp' />
  
  </div>
);

export default PostForm;