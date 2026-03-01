"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("62a323d0-4f9d-4ea6-a4cc-37942f1e591f");
  });

  return null;
};

export default CrispChat;
