"use client";
import UserProfilePage from "@/app/dashboard/settings/page";
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";

export default function Profile() {
  const userContext = useContext(UserContext);
  const userData = userContext;

  return (
    <div>
      <UserProfilePage userData={userData} />
    </div>
  );
}
