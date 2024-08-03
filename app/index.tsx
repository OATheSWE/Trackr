import React, { useEffect, useState } from "react";
import { Onboard, Splash } from "@/src/views";
import { router } from "expo-router";

const Home = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAlaKeyPresent, setIsAlaKeyPresent] = useState(false);

  useEffect(() => {
    // Set a timer to hide the splash screen after 5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    // Check if "first-time" key exists in local storage
    const alaKey = localStorage.getItem("first-time");
    setIsAlaKeyPresent(!!alaKey);

    // Clear the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showSplash && isAlaKeyPresent) {
      router.replace("/student/supervisors");
    }
  }, [showSplash, isAlaKeyPresent, router]);

  return (
    <div className="">
      {showSplash ? <Splash /> : <Onboard />}
    </div>
  );
};

export default Home;
