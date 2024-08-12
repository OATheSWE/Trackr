import { Text } from "@mantine/core";
import { styles } from "@/src/data";
import React from "react";

const About = () => {
  return (
    <div className={`${styles.body} text-text bg-primary pt-28 pb-10`}>
      <Text className="text-2xl font-bold mb-4">
        About Trackr
      </Text>
      <Text className="text-lg">
        Trackr is designed to streamline the process of student project
        supervision. It connects students with supervisors, allowing for
        efficient project topic assignments, proposal submissions, and feedback
        management. With trackr, supervisors can easily manage multiple
        students, track their progress, and provide timely guidance. Students
        benefit from a structured environment where they can receive continuous
        support throughout their project journey.
      </Text>
      <Text className="text-lg mt-4">
        Trackr is built with a focus on simplicity and effectiveness,
        ensuring that both students and supervisors have the tools they need to
        succeed. We are committed to enhancing the educational experience by
        bridging the gap between students and their mentors.
      </Text>
      <Text className="text-center mt-10 text-sm">
        &copy; {new Date().getFullYear()} Track. All rights
        reserved.
      </Text>
    </div>
  );
};

export default About;
