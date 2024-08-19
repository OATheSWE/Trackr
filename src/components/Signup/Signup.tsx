import React, { useState } from "react";
import axios from "axios";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Select,
  Button,
  Notification,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { styles } from "@/src/data";
import SuccessModal from "../SuccessModal";
import { useSpring, animated } from "@react-spring/web";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { api } from "@/src/api";

const departments = [
  "Computer Science",
  "Electrical Engineering",
  "Business Administration",
  "Law",
];

const Signup = () => {
  const [visible, setVisible] = useState(false);
  const [modalText, setModalText] = React.useState("");
  const successModalRef = React.useRef(null);
  const form = useForm({
    initialValues: {
      name: "",
      department: "",
      email: "",
      strengths: "",
      userType: "",
    },

    validate: {
      name: (value) => (value ? null : "Name is required"),
      department: (value) => (value ? null : "Department is required"),
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email address",
      strengths: (value) => (value ? null : "Strengths is required"),
      userType: (value) => (value ? null : "User type is required"),
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
      const response = await axios.post(api.signup, values, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      if (response.data.status) {
        toggleVisibility();
        handleOpenSuccessModal(response.data.message);
        form.reset();
        setTimeout(() => {
            router.push("/auth/login");
        }, 1500)
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
        <h1 className="text-2xl font-bold mb-4 text-center">
          Create an account
        </h1>
        <Text className="text-[13px] py-2 text-center">
          Create an account to access our services, it takes less than a minute.
        </Text>
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="max-w-[600px] w-full"
        >
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            {...form.getInputProps("name")}
            error={form.errors.name}
            mb={`lg`}
          />
          <Select
            label="Department"
            placeholder="Select your department"
            data={departments}
            {...form.getInputProps("department")}
            error={form.errors.department}
            mb={`lg`}
            rightSectionWidth={0}
            comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
          />
          <TextInput
            label="Email"
            placeholder="Enter your email"
            {...form.getInputProps("email")}
            error={form.errors.email}
            mb={`lg`}
          />
          <TextInput
            label="Core Strengths"
            placeholder="eg AI, ML, Cyber Security, Web3"
            {...form.getInputProps("strengths")}
            error={form.errors.strengths}
            mb={`lg`}
          />
          <Select
            label="User Type"
            placeholder="Select user type"
            data={["student", "supervisor"]}
            {...form.getInputProps("userType")}
            error={form.errors.userType}
            mb={`lg`}
            rightSectionWidth={0}
            comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
          />
          <div className="flex justify-center items-center">
            <Button
              type="submit"
              className="mt-4 bg-secondary border-[1.5px] border-secondary px-14 h-[40px] rounded-md transition duration-300 hover:bg-transparent"
            >
              Signup
            </Button>
          </div>
        </form>
        <div className="text-[13px] font-normal text-center text-text mt-6 flex justify-center items-center max-[360px]:flex-col">
          Already have an account on Trackr?
          <TouchableOpacity
            onPress={() => {
              router.replace("/auth/login");
            }}
          >
            <Text className="text-secondary font-bold pl-1 -mt-1 max-[360px]:mt-3">
              Log In
            </Text>
          </TouchableOpacity>
        </div>
      </animated.div>
      <SuccessModal ref={successModalRef} text={modalText} />
    </div>
  );
};

export default Signup;
