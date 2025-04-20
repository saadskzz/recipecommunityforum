import { useState, useEffect } from 'react';
import { Switch } from 'antd';
import { useTheme } from '../contexts/ThemeContext';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [checked, setChecked] = useState(theme === 'dark');

  useEffect(() => {
    setChecked(theme === 'dark');
  }, [theme]);

  const handleChange = (checked: boolean) => {
    setChecked(checked);
    toggleTheme();
  };

  return (
    <div className="theme-toggle">
      <SunOutlined className="theme-icon light-icon" />
      <Switch 
        checked={checked}
        onChange={handleChange}
        className={`theme-switch ${theme === 'dark' ? 'dark-switch' : 'light-switch'}`}
      />
      <MoonOutlined className="theme-icon dark-icon" />
    </div>
  );
};

export default ThemeToggle; 