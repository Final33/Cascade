import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "../../Chatbot/Components/Spinner";
import { Toggle } from "../../ui/toggle";
import { Switch } from "../../ui/switch";
import { useState } from "react";

export function PricingOnboarding({
  handleSubscribe,
  handleFreeClick,
  isPremiumLoading,
  isFreeLoading,
}: {
  handleSubscribe: any;
  handleFreeClick: any;
  isPremiumLoading: boolean;
  isFreeLoading: boolean;
}) {
  const [plan, setPlan] = useState("annual");
  return (
    <div className="flex flex-col md:flex ">
      <div className="px-8 py-6 md:px-48 md:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="max-w-xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight pb-6 sm:text-5xl">
                Try it for 7 days. Risk-free
              </h1>
              <div className="mt-10 md:my-0 my-10 text-xl text-gray-500">
                Supercharge your college essays and get into your dream
                university.
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="w-full border-2 relative border-blue-500 flex flex-col justify-between">
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <Badge
                  className="mb-2 bg-blue-500 text-white"
                  variant="outline"
                >
                  Prepsy Premium
                </Badge>
              </div>
              <CardHeader>
                <div className="text-3xl font-bold ">7 days free</div>

                <div className="flex flex-wrap gap-2 text-muted-foreground items-center">
                  <div className="text-lg font-normal">
                    Then{" "}
                    {plan === "monthly" ? "$00.00 / month" : "$00.00 / month"}
                  </div>
                </div>
                <div className="flex flex-row  items-center pt-2 justify-left  ">
                  Monthly{" "}
                  <div className="px-2 flex flex-row items-center justify-center">
                    <Switch
                      checked={plan === "annual"}
                      onCheckedChange={() => {
                        if (plan === "annual") {
                          setPlan("monthly");
                          console.log("monthly");
                        } else {
                          setPlan("annual");
                          console.log("annual");
                        }
                      }}
                    />
                  </div>
                  Annual{" "}
                  <span className="text-primary text-xs pl-2 font-bold">
                    SAVE 30%
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="text-lg space-y-4 mb-4">
                  <li>✓ Kolly's AI Essay generator and editor</li>
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
                    onClick={() => handleSubscribe(plan)}
                  >
                    {isPremiumLoading ? <Spinner /> : "Start for free"}
                  </Button>
                  <div className="text-sm text-center text-gray-500 mt-4">
                    Cancel anytime. You won't be charged until your trial
                    expires.
                  </div>
                </div>
              </CardFooter>
            </Card>
            <Card className="w-full border-2 relative border-muted flex flex-col justify-between">
              <div>
                <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <Badge className="mb-2 bg-muted text-black" variant="outline">
                    Free Plan
                  </Badge>
                </div>
                <CardHeader>
                  <div className="text-3xl font-bold ">
                    Get a feel for Kolly
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="text-lg space-y-4 my-4">
                    <li>✓ 3,000 Tokens</li>
                    <li>✓ 3 Essays</li>
                    <li>✓ 3 Ideas</li>
                    <li>✓ Access to GPT-4o</li>
                    <br />
                    <br />
                  </ul>
                </CardContent>
              </div>
              <CardFooter>
                <div className="w-full flex flex-col items-center justify-center">
                  <Button
                    variant={"outline"}
                    className="w-full "
                    onClick={() => handleFreeClick()}
                  >
                    {isFreeLoading ? <Spinner /> : "Continue for free"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
