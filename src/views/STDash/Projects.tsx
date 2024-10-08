import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Text,
  Container,
  Group,
  LoadingOverlay,
  Modal,
  Textarea,
  Tabs,
  Card,
  Badge,
  Select,
  TextInput,
} from "@mantine/core";
import { styles } from "@/src/data";
import CryptoJS from "crypto-js";
import { api } from "@/src/api";
import { notifications } from "@mantine/notifications";
import SuccessModal from "@/src/components/SuccessModal";
import { useSpring, animated } from "@react-spring/web";
import { router } from "expo-router";
import { IconImports } from "@/assets";
import { TouchableOpacity } from "react-native";
import classes from "../../components/modals.module.css";
import * as WebBrowser from "expo-web-browser";

interface Topic {
  topic_id: string;
  topic_department: string;
  topic_name: string;
  topic_link: string;
  assigned_to: string | null;
}

interface Proposal {
  proposal_id: string;
  topic_id: string;
  topic_name: string;
  proposal_text: string;
  comment: string;
  status: "pending" | "accepted" | "declined";
}

const Projects = () => {
  const [visible, setVisible] = useState(true);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [modalText, setModalText] = useState("");
  const successModalRef = React.useRef(null);
  const [uniqueId, setUniqueId] = useState("");
  const [projects, setProjects] = useState<Topic[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Topic[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [opened, setOpened] = useState(false);
  const [opened2, setOpened2] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [proposalText, setProposalText] = useState("");
  const [fileLink, setFileLink] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>("projects");

  const toggleVisibility = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  const toggleVisibility2 = () => {
    setVisible2((prevVisible2) => !prevVisible2);
  };

  const toggleVisibility3 = () => {
    setVisible3((prevVisible3) => !prevVisible3);
  };

  const handleSearch = (e: any) => {
    const query = e.target.value.toLowerCase();
    if (query) {
      setFilteredProjects(
        projects.filter((project) =>
          project.topic_name.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredProjects(projects);
    }
  };

  const secretKey =
    "21d1f43eee6a5780499e81575231952e7dd1f88274f72f6d0f78ffe213944aa9";

  useEffect(() => {
    // Retrieve the unique ID from localStorage
    const encryptedUniqueId = localStorage.getItem("ala");
    const decryptedUniqueId = CryptoJS.AES.decrypt(
      encryptedUniqueId,
      secretKey
    );
    const data = {
      student_unique_id: decryptedUniqueId.toString(CryptoJS.enc.Utf8),
    };
    setUniqueId(data.student_unique_id);

    axios
      .post(api.fetchProjects, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        const responseData = response.data;
        setProjects(responseData.projects);
        setFilteredProjects(responseData.projects);
        toggleVisibility();
      })
      .catch((err) => {
        notifications.show({
          message: "A network error occurred",
          color: "#D8BFD8",
        });
      });

    axios
      .post(api.fetchProposalFeedback, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        const responseData = response.data;
        setProposals(responseData.proposals);
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

  const handleProposalSubmit = async () => {
    if (!selectedTopic || !proposalText) return;
    toggleVisibility2();
    axios
      .post(
        api.submitProposals,
        {
          student_unique_id: uniqueId,
          topic_id: selectedTopic,
          proposal_text: proposalText,
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
            router.replace("/student/projects");
          }, 1500);
        }
      })
      .catch(() => {
        toggleVisibility2();
        handleOpenSuccessModal("Failed to submit proposal.");
      });
  };

  const handleProjectUpload = async () => {
    toggleVisibility3();
    axios
      .post(
        api.projectUpload,
        {
          student_unique_id: uniqueId,
          file_link: fileLink,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        toggleVisibility3();
        handleOpenSuccessModal(response.data.message);
        if (response.data.status) {
          setTimeout(() => {
            router.replace("/student/projects");
          }, 1500);
        }
      })
      .catch(() => {
        toggleVisibility3();
        handleOpenSuccessModal("Failed to submit project.");
      });
  };

  // Slide-in animation
  const slideInStyles = useSpring({
    from: { transform: "translateY(100%)" },
    to: { transform: "translateY(0%)" },
    config: { tension: 220, friction: 30 },
  });

  const handlePressProject = async (link: string) => {
    let result = await WebBrowser.openBrowserAsync(link);
    if (result.type === "opened") {
      console.log("Browser opened successfully");
    } else if (result.type === "cancel") {
      console.log("Browser closed by user");
    }
  };

  return (
    <Container className={`py-32 ${styles.body} text-text bg-primary h-[700vh]`}>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ blur: 2 }}
        loaderProps={{ color: "#D8BFD8", type: "bars" }}
      />
      <animated.div style={slideInStyles}>
        <TouchableOpacity onPress={() => setOpened(true)}>
          <Button
            className="bg-secondary h-[45px] px-6 mb-10"
            leftSection={<IconImports.Plus size={24} color="white" />}
          >
            Submit Proposal
          </Button>
        </TouchableOpacity>
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title="Submit Proposal"
          classNames={classes}
        >
          <LoadingOverlay
            visible={visible2}
            zIndex={1000}
            overlayProps={{ blur: 2 }}
            loaderProps={{ color: "#D8BFD8", type: "bars" }}
          />
          <Select
            data={projects.map((project) => ({
              value: project.topic_id,
              label: project.topic_name,
            }))}
            value={selectedTopic}
            onChange={setSelectedTopic}
            placeholder="Select a project"
            required
            size="md"
            mb={"2rem"}
          />
          <Textarea
            value={proposalText}
            onChange={(e) => setProposalText(e.target.value)}
            placeholder="Project Proposal Text"
            autosize
            minRows={6}
            required
            size="md"
            mb={"2rem"}
          />
          <TouchableOpacity>
            <Button
              onClick={handleProposalSubmit}
              disabled={!selectedTopic || !proposalText}
              className="bg-secondary h-[45px] text-white"
            >
              Submit
            </Button>
          </TouchableOpacity>
        </Modal>
        <Tabs
          variant="outline"
          active={activeTab}
          onChange={setActiveTab}
          defaultValue="projects"
        >
          <Tabs.List grow>
            <Tabs.Tab value="projects">Projects</Tabs.Tab>
            <Tabs.Tab value="proposals">Proposals</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="projects">
            <input
              type="text"
              placeholder="Search projects..."
              onChange={handleSearch}
              className="outline-0 w-full px-3 py-2 my-8 rounded-lg bg-text text-black placeholder:text-black"
            />
            <div>
              {filteredProjects.map((project) => (
                <TouchableOpacity
                  ///@ts-ignore
                  onPress={() => handlePressProject(project.topic_link)}
                >
                  <Card
                    key={project.topic_id}
                    shadow="xl"
                    padding="lg"
                    className="mb-4 cursor-pointer bg-text text-black rounded-lg"
                  >
                    <Text className="capitalize">{project.topic_name}</Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="proposals">
            <div>
              {proposals.map((proposal) => {
                return (
                  <Card
                    key={proposal.proposal_id}
                    shadow="sm"
                    padding="lg"
                    className="mb-4 mt-6"
                  >
                    <Group>
                      <Text>{proposal.topic_name}</Text>
                      <Badge
                        color={
                          proposal.status === "pending"
                            ? "gray"
                            : proposal.status === "accepted"
                            ? "green"
                            : "red"
                        }
                      >
                        {proposal.status}
                      </Badge>
                    </Group>
                    <Text className="mt-2">{proposal.comment}</Text>
                    {proposal.status === "accepted" && (
                      <TouchableOpacity onPress={() => setOpened2(true)}>
                        <Button className="bg-secondary mt-4">
                          Upload Project
                        </Button>
                      </TouchableOpacity>
                    )}
                  </Card>
                );
              })}
            </div>
          </Tabs.Panel>
        </Tabs>
      </animated.div>
      <Modal
        opened={opened2}
        onClose={() => setOpened2(false)}
        title="Upload Project"
        classNames={classes}
      >
        <LoadingOverlay
          visible={visible3}
          zIndex={1000}
          overlayProps={{ blur: 2 }}
          loaderProps={{ color: "#D8BFD8", type: "bars" }}
        />
        <TextInput
          value={fileLink}
          onChange={(e) => setFileLink(e.target.value)}
          placeholder="Enter file link"
          required
          size="md"
          mb={"2rem"}
        />
        <TouchableOpacity>
          <Button
            onClick={handleProjectUpload}
            disabled={!fileLink}
            className="bg-secondary h-[45px] text-white"
          >
            Submit
          </Button>
        </TouchableOpacity>
      </Modal>
      <SuccessModal ref={successModalRef} text={modalText} />
    </Container>
  );
};

export default Projects;
