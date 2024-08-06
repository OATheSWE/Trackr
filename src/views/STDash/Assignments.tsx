import { api } from "@/src/api";
import { styles } from "@/src/data";
import { Card, Container, LoadingOverlay, Text } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import CryptoJS from "crypto-js";
import { notifications } from "@mantine/notifications";
import { useSpring, animated } from "@react-spring/web";

interface Assignments {
  student_name: string;
  topic_name: string;
  supervisor_name: string;
}

const Assignments = () => {
  const [visible, setVisible] = useState(true);
  const [assignments, setAssignments] = useState<Assignments[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignments[]>(
    []
  );
  const secretKey =
    "21d1f43eee6a5780499e81575231952e7dd1f88274f72f6d0f78ffe213944aa9";

  const toggleVisibility = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  useEffect(() => {
    // Retrieve the unique ID from localStorage
    const encryptedUniqueId = localStorage.getItem("ala");
    const decryptedUniqueId = CryptoJS.AES.decrypt(
      encryptedUniqueId,
      secretKey
    );

    // Prepare the data to be sent to the backend
    const data = {
      student_unique_id: decryptedUniqueId.toString(CryptoJS.enc.Utf8),
    };

    // Fetch student status and supervisors
    axios
      .post(api.fetchAssignments, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        const responseData = response.data;
        setAssignments(responseData.assignments);
        setFilteredAssignments(responseData.assignments);
        toggleVisibility();
      })
      .catch((err) => {
        notifications.show({
          message: "A network error occurred",
          color: "#03DAC5",
        });
      });
  }, []);

  const handleSearch = (e: any) => {
    const query = e.target.value.toLowerCase();
    if (query) {
      setFilteredAssignments(
        assignments.filter((assignment) =>
          assignment.student_name.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredAssignments(assignments);
    }
  };

  // Slide-in animation
  const slideInStyles = useSpring({
    from: { transform: "translateY(100%)" },
    to: { transform: "translateY(0%)" },
    config: { tension: 220, friction: 30 },
  });

  return (
    <Container className={`py-32 ${styles.body} text-text bg-primary h-full`}>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ blur: 2 }}
        loaderProps={{ color: "#03DAC5", type: "bars" }}
      />
      <animated.div style={slideInStyles}>
        <Text className="text-2xl font-bold mb-4 text-center">
          Your Course Mates
        </Text>
        <input
          type="text"
          placeholder="Search course mates..."
          onChange={handleSearch}
          className="outline-0 w-full px-3 py-2 my-8 rounded-lg bg-transparent border-secondary border-[1.5px] text-text placeholder:text-text"
        />
        <div>
          {filteredAssignments.map((assignment, index) => (
            <TouchableOpacity>
              <Card
                key={index}
                shadow="xl"
                padding="lg"
                className="mb-4 cursor-pointer bg-secondary text-white rounded-lg"
              >
                <Text className="font-semibold text-[15px] mb-4">
                  {assignment.student_name}
                </Text>
                <Text className="mb-4">{assignment.topic_name}</Text>
                <Text className="">{assignment.supervisor_name}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </div>
      </animated.div>
    </Container>
  );
};

export default Assignments;
