"use client";
import React, { useContext } from "react";
import type { CardComponentProps } from "onborda";
import { useOnborda } from "onborda";
import { XIcon } from "lucide-react";

import confetti from "canvas-confetti";

// Shadcn
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { UserContext } from "@/context/UserContext";

const CustomCard: React.FC<CardComponentProps> = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}) => {
  // Onborda hooks
  const { closeOnborda } = useOnborda();

  const { refreshUserData } = useContext(UserContext);

  async function updateUserData() {
    const supabase = createSupabaseBrowserClient();
    const session = await supabase.auth.getSession();

    //update the user data
    const { data, error } = await supabase
      .from("users")
      .update({
        toured: true,
      })
      .eq("uid", session.data.session?.user.id);

    console.log(data);
    console.log(error);
    console.log("updated");
    refreshUserData();
  }

  function handleConfetti() {
    closeOnborda();

    updateUserData();

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  return (
    <Card className="border-0 rounded-3xl max-w-vw  ">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between w-full">
          <div>
            <CardTitle className="mb-2 text-lg">
              {step.icon} {step.title}
            </CardTitle>
            <CardDescription>
              {currentStep + 1} of {totalSteps}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              closeOnborda();
              updateUserData();
            }}
          >
            <XIcon size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">{step.content}</CardContent>
      <CardFooter className="pb-3">
        <div className="flex justify-between w-full">
          {step.showControls && (
            <>
              {currentStep + 1 !== totalSteps && (
                <Button onClick={() => nextStep()} className="ml-auto">
                  Next
                </Button>
              )}
              {currentStep + 1 === totalSteps && (
                <Button onClick={() => handleConfetti()} className="ml-auto">
                  🎉 Finish!
                </Button>
              )}
            </>
          )}
        </div>
      </CardFooter>
      <span className="text-card">{arrow}</span>
    </Card>
  );
};

export default CustomCard;
