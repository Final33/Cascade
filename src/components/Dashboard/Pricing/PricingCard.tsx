import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { UpgradeButton } from "@/components/ui/upgrade-button";
import { Spinner } from "../../Chatbot/Components/Spinner";

export function PricingCard({
  plan,
  setPlan,
  handleSubscribe,
  isPremiumLoading,
  className,
}: {
  plan: string;
  setPlan: (value: string) => void;
  handleSubscribe: (plan: string) => void;
  isPremiumLoading: boolean;
  className?: string;
}) {
  return (
    <Card
      className={`w-full border-2 relative border-blue-500 flex flex-col justify-between ${className}`}
    >
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <Badge className="mb-2 bg-blue-500 text-white" variant="outline">
          Prepsy Premium
        </Badge>
      </div>
      <CardHeader>
        <div className="text-3xl font-bold ">
          {plan === "monthly" ? "$0 / month" : "$0 / month"}
        </div>

        <div className="flex flex-wrap gap-2 text-muted-foreground items-center">
          <div className="text-lg font-normal">FREE access until 2025 AP Exams for the first 25 users!</div>
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
          Full Cycle{" "}
          <span className="text-primary text-xs pl-2 font-bold">SAVE 30%</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="text-lg space-y-4 mb-4 text-primary font-bold">
          <li>✓ Unlimited tokens</li>
          <li>✓ Access to 500+ example essays</li>
          <li>✓ Full AI essay writing suite</li>
          <li>✓ Extracurricular recommendation tool</li>
          <li>✓ Priority customer support via Discord community</li>
          <li>✓ Unlimited GPT-4o</li>
        </ul>
      </CardContent>
      <CardFooter>
        <div className="w-full flex flex-col items-center justify-center">
          <UpgradeButton
            onClick={() => handleSubscribe(plan)}
            className="w-full"
            size="lg"
            showIcon={false}
          >
            {isPremiumLoading ? <Spinner /> : "Unlock the Future 🚀"}
          </UpgradeButton>
        </div>
      </CardFooter>
    </Card>
  );
}
