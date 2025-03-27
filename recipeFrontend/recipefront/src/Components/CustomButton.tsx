import { Button } from 'antd';
import './customButton.css'
import { ReactNode } from 'react';

interface ButtonProps {
  btnTxt: ReactNode;
  fontSize?: string;
  backgroundColor?: string;
  color?: string; // Add color property
  margin?: string; // Add margin property
  onClick?: () => void; // Make onClick optional
}

function CustomButton({ btnTxt, onClick, fontSize = '20px', backgroundColor = 'transparent', color = 'white', margin = '0' }: ButtonProps) { // Default color to 'white', Default margin to '0'
  return (
    <div className='custom-button' style={{ backgroundColor, margin }}> {/* Apply margin */}
      <Button 
        type="primary" 
        size='large' 
        className='btn' 
        block 
        htmlType='submit' 
        onClick={onClick} 
        ghost 
        style={{ color, border: 'none', fontSize, backgroundColor: 'transparent' }} // Apply color
      >
        {btnTxt}
      </Button>
    </div>
  )
}

export default CustomButton