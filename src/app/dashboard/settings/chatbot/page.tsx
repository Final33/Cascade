import { Separator } from "@/components/ui/separator";
import { ChatbotForm } from "./chatbot-form";

export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Chatbot</h3>
        <p className="text-sm text-muted-foreground">
          Personalize your responses to match your writing style.
        </p>
      </div>

      <Separator />
      <ChatbotForm />
    </div>
  );
}
