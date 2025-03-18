import { Button } from 'antd';
import './customButton.css'
import { ReactNode } from 'react';

interface ButtonProps {
  btnTxt: ReactNode;
  fontSize?: string; // Add fontSize property
}

function CustomButton({btnTxt, fontSize = '20px'}:ButtonProps) { // Default fontSize to '16px'
  return (
    <div className='custom-button'>
      <Button 
        type="primary" 
        size='large' 
        className='btn' 
        block 
        htmlType='submit' 
        ghost 
        style={{ color: 'white', border: 'none', fontSize }} // Apply fontSize
      >
        {btnTxt}
      </Button>
    </div>
  )
}

export default CustomButton