import React, { useEffect, useState } from "react";
import { Splash } from "@/src/views";
import { Login } from "@/src/components";

const Home = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Set a timer to hide the splash screen after 5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    // Clear the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  return <div className="">{showSplash ? <Splash /> : <Login />}</div>;
};

export default Home;
