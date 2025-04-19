import { Button } from 'antd';
import './customButton.css'
import { ReactNode } from 'react';

interface ButtonProps {
  btnTxt: ReactNode;
  fontSize?: string;
  backgroundColor?: string;
  color?: string;
  margin?: string;
  onClick?: () => void;
  disabled?: boolean;
  htmlType?: "button" | "submit" | "reset";
  type?: "primary" | "default" | "dashed" | "link" | "text";
  icon?: ReactNode;
}

function CustomButton({
  btnTxt,
  onClick,
  disabled = false,
  htmlType = 'submit',
  icon,
}: ButtonProps) {
  return (
    <div className={`custom-button ${disabled ? 'disabled-btn' : ''}`}>
      <Button
        type="primary"
        size="large"
        className="btn"
        block
        htmlType={htmlType}
        onClick={onClick}
        disabled={disabled}
        icon={icon}
      >
        {btnTxt}
      </Button>
    </div>
  );
}

export default CustomButton