import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Text,
  Container,
  Group,
  LoadingOverlay,
  Radio,
  RadioGroup,
} from "@mantine/core";
import { styles } from "@/src/data";
import CryptoJS from "crypto-js";
import { api } from "@/src/api";
import { TouchableOpacity } from "react-native";
import { notifications } from "@mantine/notifications";
import { router } from "expo-router";
import SuccessModal from "@/src/components/SuccessModal";
import { useSpring, animated } from "@react-spring/web";

interface Supervisor {
  unique_id: string;
  name: string;
  max_students: number;
  current_students: number;
  disabled: boolean;
}

interface StudentStatus {
  status: "pending" | "accepted" | "declined" | "auto_assigned";
  assignedSupervisor?: Supervisor;
  supervisors: Supervisor[];
}

const StudentDashboard = () => {
  const [statusData, setStatusData] = useState<StudentStatus | null>(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(
    null
  );
  const [visible, setVisible] = useState(true);
  const [visible2, setVisible2] = useState(false);
  const [modalText, setModalText] = useState("");
  const successModalRef = React.useRef(null);
  const [uniqueId, setUniqueId] = useState("");
  const secretKey =
    "21d1f43eee6a5780499e81575231952e7dd1f88274f72f6d0f78ffe213944aa9";

  useEffect(() => {
    const firstCheck = localStorage.getItem("ala");
    if (!firstCheck) {
      router.replace("/auth/login");
    }
  }, []);

  useEffect(() => {
    // Retrieve the unique ID from localStorage
    const encryptedUniqueId = localStorage.getItem("ala");
    const decryptedUniqueId = CryptoJS.AES.decrypt(
      encryptedUniqueId,
      secretKey
    );

    // Prepare the data to be sent to the backend
    const data = {
      encrypted_unique_id: decryptedUniqueId.toString(CryptoJS.enc.Utf8),
    };

    setUniqueId(data.encrypted_unique_id);

    // Fetch student status and supervisors
    axios
      .post(api.fetchStudentStatus, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        const responseData = response.data;
        setStatusData(responseData);
        toggleVisibility();

        if (responseData.status === "declined") {
          handleOpenSuccessModal(
            "Supervisor declined request. Another supervisor will be assigned."
          );
          setTimeout(() => {
            toggleVisibility2();
            axios
              .post(
                api.autoAssignSupervisor,
                { encrypted_unique_id: data.encrypted_unique_id },
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
                    router.replace("/student/supervisors");
                  }, 1500);
                }
              })
              .catch(() => {
                toggleVisibility2();
                handleOpenSuccessModal("Failed to auto-assign a supervisor.");
              });
          }, 1500);
        } else if (responseData.status === "accepted") {
          const firstTimeAccepted = localStorage.getItem(`first-time-accepted`);
          if (!firstTimeAccepted) {
            handleOpenSuccessModal("Supervisor accepted request.");
            localStorage.setItem(`first-time-accepted`, "true");
          }
        }
      })
      .catch((err) => {
        notifications.show({
          message: "A network error occurred",
          color: "#D8BFD8",
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

  const handleSelectSupervisor = (supervisorId: string) => {
    if (statusData?.status === "pending") {
      setSelectedSupervisor(supervisorId);
    }
  };

  const handleSubmitSupervisor = () => {
    toggleVisibility2();
    if (selectedSupervisor !== null) {
      axios
        .post(
          api.submitSupervisor,
          {
            supervisor_unique_id: selectedSupervisor,
            encrypted_unique_id: uniqueId,
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
              router.replace("/student/supervisors");
            }, 1500);
          }
        })
        .catch(() => {
          toggleVisibility2();
          handleOpenSuccessModal("Failed to submit supervisor.");
        });
    }
  };

  const handleAutoAssign = () => {
    toggleVisibility2();
    axios
      .post(
        api.autoAssignSupervisor,
        { encrypted_unique_id: uniqueId },
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
            router.replace("/student/supervisors");
          }, 1500);
        }
      })
      .catch(() => {
        toggleVisibility2();
        handleOpenSuccessModal("Failed to auto-assign a supervisor.");
      });
  };

  // Slide-in animation
  const slideInStyles = useSpring({
    from: { transform: "translateY(100%)" },
    to: { transform: "translateY(0%)" },
    config: { tension: 220, friction: 30 },
  });

  return (
    <Container className={`py-32 ${styles.body} text-text bg-primary h-[300vh]`}>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ blur: 2 }}
        loaderProps={{ color: "#D8BFD8", type: "bars" }}
      />
      <LoadingOverlay
        visible={visible2}
        zIndex={1000}
        overlayProps={{ blur: 2 }}
        loaderProps={{ color: "#D8BFD8", type: "bars" }}
      />
      <animated.div style={slideInStyles}>
        <Text className="text-2xl font-bold mb-4 text-center">
          {statusData?.status === "pending"
            ? "Select Your Supervisor"
            : "Your Supervisor"}
        </Text>
        <Group>
          {statusData?.status === "pending" && (
            <TouchableOpacity onPress={handleAutoAssign}>
              <Button className="mb-4 bg-transparent border-[1.5px] border-secondary hover:bg-transparent">
                Auto-Assign Supervisor
              </Button>
            </TouchableOpacity>
          )}
          <RadioGroup
            value={
              statusData?.status === "pending"
                ? selectedSupervisor
                : statusData?.assignedSupervisorId
            }
            onChange={(value) => handleSelectSupervisor(value)}
            className="w-full"
          >
            {statusData?.supervisors.map((supervisor) => {
              const isDisabled =
                supervisor.disabled ||
                (statusData?.status === "accepted" &&
                  supervisor.unique_id !== statusData?.assignedSupervisorId) ||
                statusData?.status === "declined";

              const handleDivClick = () => {
                if (!isDisabled) {
                  handleSelectSupervisor(supervisor.unique_id);
                  console.log(selectedSupervisor);
                }
              };

              return (
                <div
                  key={supervisor.unique_id}
                  className={`bg-secondary rounded-lg p-4 mb-6 w-full text-white ${
                    isDisabled ? "opacity-50 pointer-events-none" : ""
                  }`}
                  onClick={handleDivClick}
                >
                  <Radio
                    value={supervisor.unique_id}
                    label={supervisor.name}
                    disabled={isDisabled}
                    // onChange={() =>
                    //   handleSelectSupervisor(supervisor.unique_id)
                    // }
                    color="#121212"
                  />
                </div>
              );
            })}
          </RadioGroup>
          {statusData?.status === "pending" && (
            <TouchableOpacity onPress={handleSubmitSupervisor}>
              <Button
                disabled={selectedSupervisor === null}
                className="mt-4 bg-transparent border-[1.5px] border-secondary hover:bg-transparent"
              >
                Submit Supervisor
              </Button>
            </TouchableOpacity>
          )}
        </Group>
      </animated.div>
      <SuccessModal ref={successModalRef} text={modalText} />
    </Container>
  );
};

export default StudentDashboard;
