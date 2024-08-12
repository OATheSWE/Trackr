import React, { useState, useEffect, useRef } from "react";
import {
  Group,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, router } from "expo-router";
import { styles } from "@/src/data";
import { api } from "@/src/api";
import axios from "axios";
import CryptoJS from "crypto-js";
import ConfirmModal from "../ConfirmModal";
import "./aside.css";
import { IconImports } from "@/assets";

export default function Aside({ asideLinks }) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [visible, setVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [userStatus, setUserStatus] = useState({ status: "", user_type: "" });
  const [isLinksDisabled, setIsLinksDisabled] = useState(false);

  const confirmModalRef = useRef(null); // Ref for ConfirmModal

  const handleLogout = () => {
    toggleDrawer();
    if (confirmModalRef.current) {
      confirmModalRef.current.openModal();
    }
  };

  const handleConfirmLogout = () => {
    toggleVisibility();
    localStorage.removeItem("ala");
    localStorage.removeItem("first-time-accepted");
    localStorage.removeItem("user_type");
    setTimeout(() => {
      router.replace("/auth/login");
    }, 2000);
  };

  const toggleVisibility = () => {
    setVisible((prevVisible) => !prevVisible);
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
      encrypted_unique_id: decryptedUniqueId.toString(CryptoJS.enc.Utf8),
    };

    const string = decryptedUniqueId.toString(CryptoJS.enc.Utf8);

    // Fetch user details
    axios
      .post(api.getName, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        const responseData = response.data;
        if (responseData.success) {
          setUserName(responseData.name);
        } else {
          console.error("Error:", responseData.error);
          setUserName("User");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setUserName("User");
      });

    // Fetch user status
    axios
      .post(api.fetchStudentStatus, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        const responseData = response.data;
        const search = "ST";
        const containsLetters = string.includes(search);
        if (responseData.status === "pending" && containsLetters) {
          setIsLinksDisabled(true);
        } else {
          console.error("Error:", responseData.error);
          setIsLinksDisabled(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ blur: 2 }}
        loaderProps={{ color: "#03DAC5", type: "bars" }}
      />
      <Box className="fixed z-[9999999999999] w-full">
        <nav
          className={`flex justify-between items-center shadow-[0_4px_6px_-1px_rgba(3,218,197,0.1),0_2px_4px_-1px_rgba(3,218,197,0.1)] bg-primary md:px-8 text-white font-sans h-[80px] ${styles.body}`}
        >
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            size={23}
            color="#E0E0E0"
          />
          <Group h="100%" className="flex items-center">
            <Text className="text-text">{userName}</Text>
          </Group>
        </nav>

        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="60%"
          zIndex={1000000}
          className="font-sans text-text p-0 m-0"
          position="left"
        >
          <ScrollArea
            h={`91vh`}
            mx="-md"
            className="block mx-auto"
            bg={`#141c26`}
          >
            <div className="mt-4">
              {asideLinks
                .slice(0, asideLinks.length === 6 ? 5 : 4)
                .map((link, index) => (
                  <Link
                    key={index}
                    href={`${link.href}`}
                    className={`font-sans flex text-[17px] text-white transition duration-300 py-3 border-t justify-between border-white px-4 ${
                      isLinksDisabled && index !== 0
                        ? "opacity-50 pointer-events-none"
                        : "hover:text-gray-300"
                    }`}
                    onPress={
                      index === 0 || !isLinksDisabled ? toggleDrawer : undefined
                    }
                  >
                    {link.text}
                    <br />
                    <span className="mt-[1px]">
                      <IconImports.RightArrow size={`15px`} color={`#fff`} />
                    </span>
                  </Link>
                ))}
              {asideLinks.length > 0 && (
                <Link
                  href={`${asideLinks[asideLinks.length - 1].href}`}
                  className={`font-sans text-[19px] text-secondary transition pl-[30%] duration-300 uppercase`}
                  onPress={handleLogout}
                >
                  {asideLinks[asideLinks.length - 1].text}
                </Link>
              )}
            </div>
          </ScrollArea>
        </Drawer>
      </Box>

      {/* ConfirmModal component instance */}
      <ConfirmModal
        ref={confirmModalRef}
        onConfirm={handleConfirmLogout}
        text={"Are you sure you want to logout?"}
      />
    </>
  );
}
