import { Box, Image, Text } from "@mantine/core";
import React from "react";
///@ts-ignore
import classes from './index.module.css';
import { ImageCollection } from "@/assets";
import { styles } from "@/src/data";


const home = () => {
  return (
      <Box className={`flex items-center justify-center bg-black flex-col h-full w-full overflow-x-hidden ${styles.body}`}>
        <Text className={`font-semibold text-[20px] ${classes.style}`} ta={`center`} >
          Open up index.tsx in your app folder to start working on your website, web app or app!
        </Text>
        <Image src={ImageCollection.logo} className={`object-cover w-[30%] mt-8`} />
      </Box>
  );
};

export default home;
