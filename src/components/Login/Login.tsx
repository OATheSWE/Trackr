import React, { useState } from "react";
import axios from "axios";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Notification,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import SuccessModal from "../SuccessModal";
import { useSpring, animated } from "@react-spring/web";
import { styles } from "@/src/data";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import CryptoJS from "crypto-js";
import { api } from "@/src/api";

const Login = () => {
  const [visible, setVisible] = useState(false);
  const [modalText, setModalText] = React.useState("");
  const successModalRef = React.useRef(null);

  const secretKey =
    "21d1f43eee6a5780499e81575231952e7dd1f88274f72f6d0f78ffe213944aa9";

  const form = useForm({
    initialValues: {
      uniqueId: "",
    },

    validate: {
      uniqueId: (value) => (value ? null : "Unique ID is required"),
    },
  });

  const handleOpenSuccessModal = (text: any) => {
    setModalText(text);
    setTimeout(() => {
      if (successModalRef.current) {
        ///@ts-ignore
        successModalRef.current.openModal();
      }
    }, 0);
  };

  // Function to toggle visibility
  const toggleVisibility = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  const handleSubmit = async (values: typeof form.values) => {
    toggleVisibility();
    try {
      const response = await axios.post(api.login, values, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      if (response.data.status) {
        toggleVisibility();
        handleOpenSuccessModal(response.data.message);
        form.reset();
        const userId = form.values.uniqueId;
        const encryptedUserId = CryptoJS.AES.encrypt(
          userId,
          secretKey
        ).toString();
        localStorage.setItem("ala", encryptedUserId);
        localStorage.setItem("user_type", response.data.user_type);
        setTimeout(() => {
          router.replace(response.data.link);
        }, 1500);
      } else {
        toggleVisibility();
        handleOpenSuccessModal(response.data.message);
        form.reset();
      }
    } catch (error: any) {
      toggleVisibility();
      handleOpenSuccessModal(
        error.response.data.message || "An error occurred"
      );
    }
  };

  // Slide-in animation
  const slideInStyles = useSpring({
    from: { transform: "translateY(100%)" },
    to: { transform: "translateY(0%)" },
    config: { tension: 220, friction: 30 },
  });

  return (
    <div
      className={`w-full bg-primary text-text h-screen flex justify-center items-center flex-col ${styles.body}`}
    >
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ blur: 2 }}
        loaderProps={{ color: "#D8BFD8", type: "bars" }}
      />
      <animated.div style={slideInStyles} className={`max-w-[600px] w-full`}>
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome Back,</h1>
        <Text className="text-[13px] py-2 text-center">
          We’re happy to see you again, Enter your unique ID.
        </Text>
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="max-w-[600px] w-full"
        >
          <TextInput
            label="Unique ID"
            placeholder="Enter your unique ID"
            {...form.getInputProps("uniqueId")}
            error={form.errors.uniqueId}
            mb={`lg`}
          />
          <div className="flex justify-center items-center">
            <Button
              type="submit"
              className="mt-4 bg-secondary border-[1.5px] border-secondary px-14 h-[40px] rounded-md transition duration-300 hover:bg-transparent"
            >
              Login
            </Button>
          </div>
        </form>
        <div className="text-[13px] font-normal text-center text-text mt-6 flex justify-center items-center max-[380px]:flex-col">
          Don’t have an account on Trackr?
          <TouchableOpacity
            onPress={() => {
              router.replace("/auth/signup");
            }}
          >
            <Text className="text-secondary font-bold pl-1 -mt-1 max-[380px]:mt-3">
              Create One
            </Text>
          </TouchableOpacity>
        </div>
      </animated.div>
      <SuccessModal ref={successModalRef} text={modalText} />
    </div>
  );
};

export default Login;
