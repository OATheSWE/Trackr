import { Text } from "@mantine/core";
import { styles } from "@/src/data";
import React from "react";

const About = () => {
  return (
    <div className={`${styles.body} text-text bg-primary`}>
      <Text className="text-2xl font-bold mb-4">
        About Our Student Supervisor System
      </Text>
      <Text className="text-lg">
        Our platform is designed to streamline the process of student project
        supervision. It connects students with supervisors, allowing for
        efficient project topic assignments, proposal submissions, and feedback
        management. With our system, supervisors can easily manage multiple
        students, track their progress, and provide timely guidance. Students
        benefit from a structured environment where they can receive continuous
        support throughout their project journey.
      </Text>
      <Text className="text-lg mt-4">
        The platform is built with a focus on simplicity and effectiveness,
        ensuring that both students and supervisors have the tools they need to
        succeed. We are committed to enhancing the educational experience by
        bridging the gap between students and their mentors.
      </Text>
      <Text className="text-center mt-10 text-sm">
        &copy; {new Date().getFullYear()} Student Supervisor System. All rights
        reserved.
      </Text>
    </div>
  );
};

export default About;
