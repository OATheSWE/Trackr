///@ts-nocheck
import React, { forwardRef, useImperativeHandle } from "react";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
/// @ts-ignore
import classes from "./modals.module.css";

// Use forwardRef to get a reference to the ConfirmModal component
const ConfirmModal = forwardRef(({ text, onConfirm }, ref) => {
  // Define the openModal function
  const openModal = () => {
    modals.openConfirmModal({
      title: "Please confirm your action",
      size: "sm",
      radius: "md",
      classNames: classes,
      withCloseButton: false,
      children: <Text size="sm">{text}</Text>,
      confirmProps: { bg: "red" },
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => {
        modals.close();
        notifications.show({
          color: "red",
          title: "Message",
          message: "Operation Cancelled",
        });
      },
      onConfirm: () => {
        modals.close();
        onConfirm();
        notifications.show({
          title: "Message",
          message: "Operation Confirmed",
        });
      },
    });
  };

  // Expose the openModal function to the parent component using useImperativeHandle
  useImperativeHandle(ref, () => ({
    openModal,
  }));

  return null; // No need to render anything in this component
});

export default ConfirmModal;
