import { api } from "@/src/api";
import SuccessModal from "@/src/components/SuccessModal";
import { styles } from "@/src/data";
import {
  Button,
  Card,
  Container,
  Group,
  LoadingOverlay,
  Modal,
  Tabs,
  Text,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import CryptoJS from "crypto-js";
import { useSpring, animated } from "@react-spring/web";
import * as WebBrowser from "expo-web-browser";
import classes from "../../components/modals.module.css";
import { notifications } from "@mantine/notifications";
import { router } from "expo-router";

interface Proposals {
  student_name: string;
  student_unique_id: string;
  topic_name: string;
  topic_id: string;
  proposal_text: string;
  proposal_id: string;
}

interface Uploads {
  student_name: string;
  student_id: string;
  topic_name: string;
  file_link: string;
}

const SPProjects = () => {
  const [selectedProposal, setSelectedProposal] = useState<Proposals>(null);
  const [proposalModalOpened, setProposalModalOpened] = useState(false);
  const [proposals, setProposals] = useState<Proposals[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposals[]>([]);
  const [uploads, setUploads] = useState<Uploads[]>([]);
  const [status, setStatus] = useState("");
  const [visible, setVisible] = useState(true);
  const [visible2, setVisible2] = useState(false);
  const [modalText, setModalText] = useState("");
  const successModalRef = useRef(null);
  const [uniqueId, setUniqueId] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(
    "pending-proposals"
  );

  const form = useForm({
    initialValues: {
      comment: "",
    },
    validate: {
      comment: (value) => (value.length < 1 ? "Comment is required" : null),
    },
  });

  const toggleVisibility = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  const toggleVisibility2 = () => {
    setVisible2((prevVisible2) => !prevVisible2);
  };

  const handleSearch = (e: any) => {
    const query = e.target.value.toLowerCase();
    if (query) {
      setFilteredProposals(
        proposals.filter((proposal) =>
          proposal.student_name.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredProposals(proposals);
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
      supervisor_unique_id: decryptedUniqueId.toString(CryptoJS.enc.Utf8),
    };

    setUniqueId(data.supervisor_unique_id);

    axios
      .post(api.fetchProposals, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        const responseData = response.data;
        setProposals(responseData.proposals);
        setFilteredProposals(responseData.proposals);
        toggleVisibility();
      })
      .catch((err) => {
        notifications.show({
          message: "A network error occurred",
          color: "#D8BFD8",
        });
      });

    axios
      .post(api.fetchProjectUploads, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        const responseData = response.data;
        setUploads(responseData.projectUploads);
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

  const handleProposalClick = (proposal: any) => {
    setSelectedProposal(proposal);
    setProposalModalOpened(true);
  };

  const handleAccept = () => {
    setStatus("accepted");
  };

  const handleDecline = () => {
    setStatus("declined");
  };

  const handlePressLink = async (link: string) => {
    let result = await WebBrowser.openBrowserAsync(link);
    if (result.type === "opened") {
      console.log("Browser opened successfully");
    } else if (result.type === "cancel") {
      console.log("Browser closed by user");
    }
  };

  // Slide-in animation
  const slideInStyles = useSpring({
    from: { transform: "translateY(100%)" },
    to: { transform: "translateY(0%)" },
    config: { tension: 220, friction: 30 },
  });

  const handleSubmit = async () => {
    if (form.validate().hasErrors || !status) {
      return;
    }
    toggleVisibility2();
    axios
      .post(
        api.recordFeedback,
        {
          proposal_id: selectedProposal.proposal_id,
          supervisor_unique_id: uniqueId,
          student_unique_id: selectedProposal.student_unique_id,
          comment: form.values.comment,
          status: status,
          topic_id: selectedProposal.topic_id,
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
            router.replace("/supervisor/projects");
          }, 1500);
        }
      })
      .catch(() => {
        toggleVisibility2();
        handleOpenSuccessModal("Failed to submit feedback.");
      });
  };

  return (
    <Container className={`py-32 ${styles.body} text-text bg-primary h-[400vh]`}>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ blur: 2 }}
        loaderProps={{ color: "#D8BFD8", type: "bars" }}
      />
      <animated.div style={slideInStyles}>
        <Text className="text-2xl font-bold mb-4 text-center">
          Proposal/Projects
        </Text>
        <Tabs
          defaultValue={"pending-proposals"}
          variant="outline"
          active={activeTab}
          onChange={setActiveTab}
          mt={`lg`}
        >
          <Tabs.List grow>
            <Tabs.Tab value="pending-proposals">Pending Proposals</Tabs.Tab>
            <Tabs.Tab value="project-uploads">Project Uploads</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="pending-proposals">
            <input
              type="text"
              placeholder="Search proposals..."
              onChange={handleSearch}
              className="outline-0 w-full px-3 py-2 my-8 rounded-lg bg-text text-black placeholder:text-black"
            />
            {filteredProposals.map((proposal) => (
              <TouchableOpacity onPress={() => handleProposalClick(proposal)}>
                <Card
                  key={proposal.proposal_id}
                  shadow="xl"
                  padding="lg"
                  className="mb-4 cursor-pointer bg-text text-black rounded-lg"
                >
                  <Text className="text-[14px] font-semibold">
                    {proposal.student_name}
                    <br />
                    {proposal.student_unique_id}
                  </Text>
                  <Text>{proposal.topic_name}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </Tabs.Panel>

          <Tabs.Panel value="project-uploads" className="mt-10">
            {uploads.map((upload) => (
              <Card
                key={upload.file_link}
                shadow="xl"
                padding="lg"
                className="mb-4 cursor-pointer bg-text text-black rounded-lg"
              >
                <Text className="text-[14px] font-semibold">
                  {upload.student_name}
                  <br />
                  {upload.student_id}
                </Text>
                <Text className="my-4">{upload.topic_name}</Text>
                <TouchableOpacity>
                  <Button
                    variant="outline"
                    // className="text-secondary"
                    color={`#D8BFD8`}
                    ///@ts-ignore
                    onClick={() => handlePressLink(upload.file_link)}
                  >
                    Open File
                  </Button>
                </TouchableOpacity>
              </Card>
            ))}
          </Tabs.Panel>
        </Tabs>

        <Modal
          opened={proposalModalOpened}
          onClose={() => setProposalModalOpened(false)}
          title="Proposal Details"
          size="lg"
          classNames={classes}
        >
          <LoadingOverlay
            visible={visible2}
            zIndex={1000}
            overlayProps={{ blur: 2 }}
            loaderProps={{ color: "#D8BFD8", type: "bars" }}
          />
          {selectedProposal && (
            <div>
              <Text className="text-[14px] font-semibold my-4">
                {selectedProposal.student_name}
              </Text>
              <Text>{selectedProposal.topic_name}</Text>
              <Textarea
                value={selectedProposal.proposal_text}
                readOnly
                maxRows={5}
                className="my-4"
              />
              <Textarea
                placeholder="Add your comment"
                {...form.getInputProps("comment")}
                minRows={6}
                mt="md"
                autosize
              />
              <Group className="my-4">
                <TouchableOpacity
                  onPress={handleAccept}
                  disabled={status === "accepted"}
                >
                  <Button variant="outline" color="green">
                    Accept
                  </Button>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDecline}
                  disabled={status === "declined"}
                >
                  <Button variant="outline" color="red">
                    Decline
                  </Button>
                </TouchableOpacity>
              </Group>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!form.values.comment || !status}
              >
                <Button fullWidth className="bg-secondary h-[45px] text-white">
                  Submit
                </Button>
              </TouchableOpacity>
            </div>
          )}
        </Modal>
      </animated.div>
      <SuccessModal ref={successModalRef} text={modalText} />
    </Container>
  );
};

export default SPProjects;
