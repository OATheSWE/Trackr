import { BackgroundImage, Button, Text } from "@mantine/core";
import { Pressable, TouchableOpacity } from "react-native";
import { Btn } from "@/src/components";
import { styles } from "@/src/data";
import { Link, router } from "expo-router";

const Screen = ({ data, onNext, index, total }) => {
  const { image, text } = data;

  return (
    <div className="h-screen">
      <div className={`h-full fixed bg-primary w-full`}></div>
      <div
        className={`${styles.body} h-screen pt-14 pb-7 flex flex-col justify-between `}
      >
        <TouchableOpacity
          onPress={() => {
            router.push("/auth/login");
          }}
        >
          <Text className="text-secondary text-right font-bold">Skip</Text>
        </TouchableOpacity>
        <div className="rounded-[32px] h-[340px] px-4 pt-10 bg-secondary z-[9999]">
          <Text className="text-[26px] text-center font-extrabold">{text}</Text>
          <div className="flex space-x-2 justify-center items-center mt-6">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`w-[4px] h-[4px] rounded-full ${
                  i === index ? "bg-primary" : "bg-text"
                }`}
              />
            ))}
          </div>
          <TouchableOpacity onPress={onNext}>
            <Button
              className={`rounded-full h-[45px] bg-primary mt-9 justify-center text-[14px] text-text font-text font-bold w-full`}
              size="md"
            >
              Next
            </Button>
          </TouchableOpacity>
        </div>
      </div>
    </div>
  );
};

export default Screen;
