import { useState } from "react";
import { useTransition, animated } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import Screen from "./Screen";
import { router } from "expo-router";
import { onBoardD } from "@/src/data";

const Onboard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionConfig, setTransitionConfig] = useState({
    from: { opacity: 0, transform: "translateX(100%)" },
    enter: { opacity: 1, transform: "translateX(0%)" },
    leave: { opacity: 0, transform: "translateX(-100%)" },
    config: { tension: 220, friction: 30 },
  });

  const transitions = useTransition(currentIndex, transitionConfig);

  const handleNext = () => {
    setTransitionConfig({
      from: { opacity: 0, transform: "translateX(100%)" },
      enter: { opacity: 1, transform: "translateX(0%)" },
      leave: { opacity: 0, transform: "translateX(-100%)" },
      config: { tension: 220, friction: 30 },
    });
    if (currentIndex < onBoardD.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace("/auth/login");
    }
  };

  const handlePrev = () => {
    setTransitionConfig({
      from: { opacity: 0, transform: "translateX(-100%)" },
      enter: { opacity: 1, transform: "translateX(0%)" },
      leave: { opacity: 0, transform: "translateX(100%)" },
      config: { tension: 220, friction: 30 },
    });
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const bind = useGesture({
    onDrag: ({ active, movement: [mx], distance: [dx], cancel }) => {
      if (active && Math.abs(dx) > window.innerWidth / 4) {
        if (mx > 0) {
          handlePrev();
        } else {
          handleNext();
        }
        cancel();
      }
    },
  });

  return (
    <div className="flex justify-center items-center h-screen w-full">
      {transitions((style, i) => (
        <animated.div
          {...bind()}
          style={{
            ...style,
            position: "absolute",
            width: "100%",
            touchAction: "none",
          }}
        >
          <Screen
            data={onBoardD[i]}
            onNext={handleNext}
            index={i}
            total={onBoardD.length}
          />
        </animated.div>
      ))}
    </div>
  );
};

export default Onboard;
