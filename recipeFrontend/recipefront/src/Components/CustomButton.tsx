import { Button } from 'antd';
import './customButton.css'
import { ReactNode } from 'react';

interface ButtonProps {
  btnTxt: ReactNode;
  fontSize?: string; // Add fontSize property
  backgroundColor?: string; // Fix typo
  onClick: () => void; // Change onsubmit to onClick
}

function CustomButton({ btnTxt, onClick, fontSize = '20px', backgroundColor = 'transparent' }: ButtonProps) { // Default fontSize to '20px' and backgroundColor to 'transparent'
  return (
    <div className='custom-button'>
      <Button 
        type="primary" 
        size='large' 
        className='btn' 
        block 
        htmlType='submit' 
        onClick={onClick} 
        ghost 
        style={{ color: 'white', border: 'none', fontSize, backgroundColor }} // Apply fontSize and backgroundColor
      >
        {btnTxt}
      </Button>
    </div>
  )
}

export default CustomButton