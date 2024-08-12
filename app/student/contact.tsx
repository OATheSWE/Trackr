import { Text } from "@mantine/core";
import { styles } from "@/src/data";
import React from "react";

const Contact = () => {
  return (
    <div className={`${styles.body} text-text bg-primary pt-28 pb-10 h-screen`}>
      <Text className="text-2xl font-bold mb-4">Contact Us</Text>
      <Text className="text-lg mb-2">
        For any inquiries or support, please reach out to us through the
        following channels:
      </Text>
      <Text className="text-lg">
        <strong>Email:</strong> support@trackr.com.ng
      </Text>
      <Text className="text-lg">
        <strong>Phone:</strong> +234 808 420 4157
      </Text>
      <Text className="text-lg">
        <strong>Address:</strong> No 15, ugbomro road, Effurun
      </Text>
      <Text className="text-lg mt-4">
        We are here to assist you with any questions or issues you may have.
        Don't hesitate to contact us for any further information or support.
      </Text>
      <Text className="text-center mt-10 text-sm">
        &copy; {new Date().getFullYear()} Trackr. All rights
        reserved.
      </Text>
    </div>
  );
};

export default Contact;
