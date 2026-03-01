"use client";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UpgradeButton } from "@/components/ui/upgrade-button";
import { useRouter } from "next/navigation";
export default function UserProfilePage() {
  function submitProfileForm() {
    console.log("Submitting form");
  }

  const router = useRouter();

  const { userData, refreshUserData } = useContext(UserContext);

  async function manageSubscription() {
    const response = await fetch("/api/create-billing-portal", {
      method: "POST",
      body: JSON.stringify({ customerId: userData?.stripe_customer_id }),
    });
    const data = await response.json();
    router.push(data.url);
  }

  //get the time left for the subscription in days left
  const daysLeft = userData?.stripe_current_period_end && userData.stripe_current_period_end !== null
    ? Math.ceil(
        (new Date(userData.stripe_current_period_end).getTime() - Date.now()) /
          (1000 * 86400)
      )
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Your Information</h3>
        <div className="flex flex-col mt-4 gap-1">
          <Label>Email</Label>
          <div className="font-semibold ">{userData?.email}</div>
        </div>
        <div className="flex flex-col mt-4 gap-1">
          <Label>Plan</Label>
          <div className="font-semibold ">{userData?.plan}</div>
        </div>
        <div className="flex flex-col mt-4 gap-1">
          <Label>Tokens Used / Total Tokens</Label>
          <div className="font-semibold ">
            {userData?.tokens_used} /{" "}
            {userData?.plan === "pro" ? "Unlimited" : "10,000"}
          </div>
        </div>
        {userData?.plan === "free" && (
          <>
            <UpgradeButton
              onClick={() => {
                router.push("/upgrade-new");
              }}
              className="mt-4"
              size="md"
            />
          </>
        )}
        {userData?.plan === "pro" && (
          <>
            <div className="flex flex-col mt-4 gap-1">
              <Label>Subscription Status</Label>
              <div className="font-semibold ">{daysLeft} days left</div>
            </div>

            <Button
              onClick={() => {
                manageSubscription();
              }}
              className="mt-4"
            >
              Manage Subscription
            </Button>
          </>
        )}
      </div>

      <Separator />
      <ProfileForm submitProfileForm={submitProfileForm} />
    </div>
  );
}
