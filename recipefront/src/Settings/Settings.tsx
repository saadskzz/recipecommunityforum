import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useChangePasswordMutation, useLogoutMutation } from "../Slices/authSlice";
import { useDispatch } from "react-redux";
import { logout } from "../Slices/authverify";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { 
  Modal, 
  Button, 
  Card, 
  Typography, 
  Divider, 
  message,
  Input,
  Switch
} from "antd";
import { 
  LockOutlined, 
  LogoutOutlined, 
  SecurityScanOutlined
} from "@ant-design/icons";
import './settings.css';

const { Title, Text } = Typography;

interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  passwordConfirm: string;
}

function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { control, handleSubmit, reset, watch } = useForm<PasswordFormData>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      passwordConfirm: "",
    },
  });

  const [changePasswordMutation] = useChangePasswordMutation();
  const [logoutMutation] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const newPassword = watch("newPassword");
  const passwordConfirm = watch("passwordConfirm");
  const passwordsMatch = newPassword === passwordConfirm;

  // Handle password change form submission
  const onSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.passwordConfirm) {
      message.error("New password and confirmation do not match");
      return;
    }
    try {
      await changePasswordMutation({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        passwordConfirm: data.passwordConfirm
      }).unwrap();
      message.success("Password changed successfully");
      reset();
      setIsModalVisible(false);
    } catch (error: any) {
      message.error(`Failed to change password: ${error.data?.message || "Unknown error"}`);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap(); 
      dispatch(logout()); 
      navigate("/login"); 
    } catch (error: any) {
      console.error("Logout failed:", error);
      message.error("Failed to logout. Please try again.");
    }
  };

  return (
    <div className={`settings-container ${theme === 'dark' ? 'dark-theme-settings' : ''}`}>
      <Card className="settings-card">
        <Title level={2} className="settings-title">Account Settings</Title>
        <Text type="secondary" className="settings-subtitle">
          Manage your account preferences and security settings
        </Text>

        <Divider />

        <div className="settings-section">
          <Title level={4}>Appearance</Title>
          <div className="settings-option">
            <div className="option-info">
              <Text strong>Dark Mode</Text>
              <Text type="secondary">Switch between light and dark themes</Text>
            </div>
            <Switch 
              checked={theme === 'dark'} 
              onChange={() => toggleTheme()} 
              className="settings-switch"
            />
          </div>
        </div>

        <Divider />

        <div className="settings-section">
          <Title level={4}>Security</Title>
          <div className="settings-option clickable" onClick={() => setIsModalVisible(true)}>
            <div className="option-info">
              <Text strong><LockOutlined /> Change Password</Text>
              <Text type="secondary">Update your account password</Text>
            </div>
            <Button type="link" icon={<SecurityScanOutlined />}>Change</Button>
          </div>
        </div>

        <Divider />

        <div className="settings-section">
          <Title level={4}>Account</Title>
          <div className="settings-option clickable" onClick={handleLogout}>
            <div className="option-info">
              <Text strong><LogoutOutlined /> Logout</Text>
              <Text type="secondary">Sign out from your account</Text>
            </div>
            <Button danger type="link" icon={<LogoutOutlined />}>Logout</Button>
          </div>
        </div>
      </Card>

      <Modal
        title={
          <div className="modal-title">
            <LockOutlined className="modal-icon" /> 
            <span>Change Password</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        className={`password-modal ${theme === 'dark' ? 'dark-theme-modal' : ''}`}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="password-form">
          <Controller
            name="oldPassword"
            control={control}
            rules={{ required: "Current password is required" }}
            render={({ field, fieldState }) => (
              <div className="password-input-group">
                <Text strong>Current Password</Text>
                <Input.Password
                  {...field}
                  placeholder="Current password"
                  className="password-input"
                  visibilityToggle={{
                    visible: passwordVisible.old,
                    onVisibleChange: (visible) => 
                      setPasswordVisible({ ...passwordVisible, old: visible })
                  }}
                />
                {fieldState.error && (
                  <Text type="danger">{fieldState.error.message}</Text>
                )}
              </div>
            )}
          />
          
          <Controller
            name="newPassword"
            control={control}
            rules={{ 
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters"
              }
            }}
            render={({ field, fieldState }) => (
              <div className="password-input-group">
                <Text strong>New Password</Text>
                <Input.Password
                  {...field}
                  placeholder="New password"
                  className="password-input"
                  visibilityToggle={{
                    visible: passwordVisible.new,
                    onVisibleChange: (visible) => 
                      setPasswordVisible({ ...passwordVisible, new: visible })
                  }}
                />
                {fieldState.error && (
                  <Text type="danger">{fieldState.error.message}</Text>
                )}
              </div>
            )}
          />
          
          <Controller
            name="passwordConfirm"
            control={control}
            rules={{ required: "Please confirm your new password" }}
            render={({ field, fieldState }) => (
              <div className="password-input-group">
                <Text strong>Confirm New Password</Text>
                <Input.Password
                  {...field}
                  placeholder="Confirm new password"
                  className="password-input"
                  status={passwordConfirm && !passwordsMatch ? "error" : ""}
                  visibilityToggle={{
                    visible: passwordVisible.confirm,
                    onVisibleChange: (visible) => 
                      setPasswordVisible({ ...passwordVisible, confirm: visible })
                  }}
                />
                {fieldState.error && (
                  <Text type="danger">{fieldState.error.message}</Text>
                )}
                {passwordConfirm && !passwordsMatch && (
                  <Text type="danger">Passwords don't match</Text>
                )}
              </div>
            )}
          />
          
          <div className="modal-footer">
            <Button onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!passwordsMatch && passwordConfirm !== ""}
            >
              Change Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Settings;