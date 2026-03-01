import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "../../Chatbot/Components/Spinner";
import { Switch } from "../../ui/switch";
import { useState } from "react";

export function PricingResubscribe({
  handleSubscribe,
  loading,
}: {
  handleSubscribe: any;
  loading: boolean;
}) {
  const [plan, setPlan] = useState("annual");
  return (
    <div className="flex flex-col md:flex ">
      <div className="px-8 py-6 md:px-48 md:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="max-w-xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Your subscription has ended
              </h1>
              <div className="mt-5 text-xl text-gray-500">
                Resubscribe to gain access and supercharge your college essays.
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8">
            <Card className="w-full border-2 relative border-blue-500">
              <div className="absolute right-5 top-8 z-20">
                <div className="flex flex-row  items-center justify-center  ">
                  Monthly{" "}
                  <div className="px-2 flex flex-row items-center justify-center">
                    <Switch
                      checked={plan === "annual"}
                      onCheckedChange={() => {
                        if (plan === "annual") {
                          setPlan("monthly");
                          console.log("monthly");
                          console.log(plan);
                        } else {
                          setPlan("annual");
                          console.log("annual");
                          console.log(plan);
                        }
                      }}
                    />
                  </div>
                  Full Admission Cycle{" "}
                  <span className="text-primary text-xs pl-2 font-bold">
                    SAVE 30%
                  </span>
                </div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <Badge
                  className="mb-2 bg-blue-500 text-white"
                  variant="outline"
                >
                  Prepsy Premium
                </Badge>
              </div>
              <CardHeader>
                <div className="flex flex-wrap gap-2">
                  <div className="text-5xl tracking-tight font-extrabold">
                    {plan === "monthly" ? "$29" : "$19"}
                  </div>
                  <div className="flex flex-col justify-end mb-[4px]">
                    <div className="text-xs text-base-content/60 uppercase font-semibold">
                      / month
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="text-lg space-y-4 my-4">
                  <li>
                    ✓ Kolly's AI essay generator, editor, and writing assistant
                  </li>
                  <li>✓ Unlimited essays</li>
                  <li>✓ Unlimited ideas</li>
                  <li>✓ Unlimited words</li>
                  <li>✓ Unlimited access to GPT-4o</li>
                  <li>✓ Priority customer support via Discord community</li>
                </ul>
              </CardContent>
              <CardFooter>
                <div className="w-full flex flex-col items-center justify-center">
                  <Button
                    variant={"default"}
                    className="w-full bg-blue-500"
                    onClick={() => {
                      handleSubscribe(plan);
                    }}
                  >
                    {loading ? <Spinner /> : "Resubscribe"}
                  </Button>
                  <div className="text-sm text-center text-gray-500 mt-4">
                    Cancel anytime.
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
