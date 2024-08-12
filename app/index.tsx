import React, { useEffect, useState } from "react";
import { Onboard, Splash } from "@/src/views";
import { router } from "expo-router";

const Home = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Set a timer to hide the splash screen after 5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    // Clear the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showSplash) {
      // Check if "user-type" exists in local storage after splash screen is hidden
      const storedUserType = localStorage.getItem("user_type");
      ///@ts-ignore
      setUserType(storedUserType);

      // Route based on the user type
      if (storedUserType === "student") {
        router.replace("/student/supervisors"); // Adjust the route as needed
      } else if (storedUserType === "supervisor") {
        router.replace("/supervisor/students"); // Adjust the route as needed
      }
    }
  }, [showSplash, router]);

  return (
    <div>
      {showSplash ? (
        <Splash />
      ) : userType ? null : (
        <Onboard />
      )}
    </div>
  );
};

export default Home;
