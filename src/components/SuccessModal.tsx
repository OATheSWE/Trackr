///@ts-nocheck
import React, { forwardRef, useImperativeHandle } from "react";
import { Button, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
/// @ts-ignore
import classes from "./modals.module.css";

// Use forwardRef to get a reference to the SuccessModal component
const SuccessModal = forwardRef(({ text }, ref) => {
  // Define the openModal function
  const openModal = () => {
    modals.open({
      size: "sm",
      radius: "md",
      classNames: classes,
      withCloseButton: false,
      title: "Message",
      children: (
        <>
          <Text size="sm" className="text-black">
            {text}
          </Text>
          <Button
            fullWidth
            onClick={() => modals.closeAll()}
            mt="md"
            className="bg-secondary"
            radius={`xl`}
          >
            Ok
          </Button>
        </>
      ),
    });
  };

  // Expose the openModal function to the parent component using useImperativeHandle
  useImperativeHandle(ref, () => ({
    openModal,
  }));

  return null; // No need to render anything in this component
});

export default SuccessModal;
