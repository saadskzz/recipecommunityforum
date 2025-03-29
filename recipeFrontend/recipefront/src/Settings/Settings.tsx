import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useChangePasswordMutation, useLogoutMutation } from "../Slices/authSlice"; // Adjust path
import { useDispatch } from "react-redux";
import { logout } from "../Slices/authverify"; // Adjust path
import { useNavigate } from "react-router-dom";
import CustomInput from "../Components/CustomInput"; // Adjust path
import CustomButton from "../Components/CustomButton"; // Adjust path
import { Modal } from "antd"; // Import Ant Design Modal
import { LockFilled } from "@ant-design/icons";
import './settings.css'

function Settings() {
  const { control, handleSubmit, reset } = useForm({
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
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

  // Handle password change form submission
  const onSubmit = async (data) => {
    if (data.newPassword !== data.passwordConfirm) {
      alert("New password and confirmation do not match.");
      return;
    }
    try {
      await changePasswordMutation(data).unwrap();
      alert("Password changed successfully"); // Replace with better UI feedback if desired
      reset(); // Clear form after success
      setIsModalVisible(false); // Close modal on success
    } catch (error) {
      alert(`Failed to change password: ${error.data?.message || "Unknown error"}`);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap(); 
      dispatch(logout()); 
      navigate("/login"); 
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <div>
      <h2>Settings</h2>

      {/* Change Password Modal */}
      <div className="style-features">
        <p onClick={() => setIsModalVisible(true)}><LockFilled/> ChangePassword</p>
      </div>
      
      <Modal
        title="Change Password"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="oldPassword"
            control={control}
            render={({ field }) => (
              <CustomInput {...field} type="password" placeholder="Old Password" />
            )}
          />
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <CustomInput {...field} type="password" placeholder="New Password" />
            )}
          />
          <Controller
            name="passwordConfirm"
            control={control}
            render={({ field }) => (
              <CustomInput {...field} type="password" placeholder="Confirm New Password" />
            )}
          />
          <CustomButton btnTxt="Submit" type="submit" backgroundColor="#412168" />
        </form>
      </Modal>

      {/* Logout Button */}
      <div className="style-features">
        <p onClick={handleLogout} >Logout</p>
      </div>
     
    </div>
  );
}

export default Settings;