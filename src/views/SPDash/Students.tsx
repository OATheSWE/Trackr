import { api } from "@/src/api";
import { styles } from "@/src/data";
import CryptoJS from "crypto-js";
import {
  Button,
  Card,
  Container,
  Group,
  LoadingOverlay,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { router } from "expo-router";
import SuccessModal from "@/src/components/SuccessModal";
import { TouchableOpacity } from "react-native";

interface Students {
  student_name: string;
  student_unique_id: string;
}

const Students = () => {
  const [students, setStudents] = useState<Students[]>([]);
  const [visible, setVisible] = useState(true);
  const [visible2, setVisible2] = useState(false);
  const [modalText, setModalText] = useState("");
  const successModalRef = useRef(null);

  const secretKey =
    "21d1f43eee6a5780499e81575231952e7dd1f88274f72f6d0f78ffe213944aa9";

  useEffect(() => {
    // Retrieve the unique ID from localStorage
    const encryptedUniqueId = localStorage.getItem("ala");
    const decryptedUniqueId = CryptoJS.AES.decrypt(
      encryptedUniqueId,
      secretKey
    );

    // Prepare the data to be sent to the backend
    const data = {
      supervisor_unique_id: decryptedUniqueId.toString(CryptoJS.enc.Utf8),
    };

    // Fetch student status and supervisors
    axios
      .post(api.fetchStudentRequest, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        const responseData = response.data;
        setStudents(responseData.students);
        toggleVisibility();
      })
      .catch((err) => {
        notifications.show({
          message: "A network error occurred",
          color: "#03DAC5",
        });
      });
  }, []);

  const handleOpenSuccessModal = (text: string) => {
    setModalText(text);
    setTimeout(() => {
      if (successModalRef.current) {
        //@ts-ignore
        successModalRef.current.openModal();
      }
    }, 0);
  };

  const toggleVisibility = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  const toggleVisibility2 = () => {
    setVisible2((prevVisible2) => !prevVisible2);
  };

  // Slide-in animation
  const slideInStyles = useSpring({
    from: { transform: "translateY(100%)" },
    to: { transform: "translateY(0%)" },
    config: { tension: 220, friction: 30 },
  });

  ///@ts-ignore
  const updateStudentStatus = async (studentUniqueId, status) => {
    toggleVisibility2();
    axios
      .post(
        api.respondRequest,
        {
          student_unique_id: studentUniqueId,
          status: status,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        toggleVisibility2();
        handleOpenSuccessModal(response.data.message);
        if (response.data.status) {
          setTimeout(() => {
            router.replace("/supervisor/students");
          }, 1500);
        }
      })
      .catch(() => {
        toggleVisibility2();
        handleOpenSuccessModal("Failed to update student status.");
      });
  };

  return (
    <div className={`py-32 ${styles.body} text-text bg-primary h-[400vh]`}>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ blur: 2 }}
        loaderProps={{ color: "#03DAC5", type: "bars" }}
      />
      <LoadingOverlay
        visible={visible2}
        zIndex={1000}
        overlayProps={{ blur: 2 }}
        loaderProps={{ color: "#03DAC5", type: "bars" }}
      />
      <animated.div style={slideInStyles}>
        <Text className="text-2xl font-bold mb-4 text-center">
          Student Requests
        </Text>
        <div className="mt-10">
          {!students.length && <Text className="text-text">No requests at this time</Text>}  
          {students.length > 0 && students.map((student) => (
            <Card
              key={student.student_unique_id}
              shadow="xl"
              padding="lg"
              className="mb-4 cursor-pointer bg-text text-black rounded-lg"
            >
              <Text size="lg">{student.student_name}<br />{student.student_unique_id}</Text>
              <Group mt="md">
                <TouchableOpacity
                  onPress={() =>
                    updateStudentStatus(student.student_unique_id, "accepted")
                  }
                >
                  <Button variant="outline" color="green">
                    Accept
                  </Button>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    updateStudentStatus(student.student_unique_id, "declined")
                  }
                >
                  <Button
                    variant="outline"
                    color="red"
                  >
                    Decline
                  </Button>
                </TouchableOpacity>
              </Group>
            </Card>
          ))}
        </div>
      </animated.div>
      <SuccessModal ref={successModalRef} text={modalText} />
    </div>
  );
};

export default Students;
