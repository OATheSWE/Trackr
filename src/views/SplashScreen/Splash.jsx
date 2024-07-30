import { Image, Text } from "@mantine/core";
import { styles } from "../../data";

const Splash = () => {
  return (
    <div
      className={`w-full bg-primary text-text h-screen flex flex-col justify-center items-center font-sans ${styles.body}`}
    >
      {/* <Image src={ImageCollection.logo2} className="max-w-[240px] w-full" /> */}
      <Text className="text-[30px] font-bold text-center text-text font-sans">
        Trackr
      </Text>
    </div>
  );
};

export default Splash;
