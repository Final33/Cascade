import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { headers } from "next/headers";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import dynamic from "next/dynamic";
import { UserProvider } from "@/context/UserContext";
import "./prosemirror.css";
// Onborda
import { Onborda, OnbordaProvider } from "onborda";
import { steps } from "@/lib/steps";

import Metrics from "./metrics";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { IdeaProvider } from "@/context/IdeaContext";
// import { DocumentProvider } from "@/context/DocumentContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

import CustomCard from "@/components/CustomCard";
import 'katex/dist/katex.min.css';
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Clusion",
  description:
    "The debate ecosystem.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const CrispWithNoSSR = dynamic(() => import("@/components/Crisp"));
  const headersList = headers();
  const domain = headersList.get("host") || "";
  const fullUrl = headersList.get("referer") || "";

  const supabase = createSupabaseServerComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data } = await supabase
    .from("users")
    .select("email")
    .eq("uid", session?.user.id);

  return (
    <html lang="en">
      <head>
        {/* <CrispWithNoSSR /> */}
        <GoogleAnalytics gaId="G-L3RSSDZ4GH" />
      </head>
      <body className={inter.className}>
        <TooltipProvider>
          <UserProvider>
            <Toaster />
            <OnbordaProvider>
              <Onborda
                steps={steps}
                cardComponent={CustomCard}
                shadowOpacity="0.8"
              >
                <div className="md:hidden sm:flex bg-primary text-white text-center p-2">
                  For the best experience and access to all features,
                  please use a desktop.
                </div>
                {children}
                <SpeedInsights />
              </Onborda>
            </OnbordaProvider>
          </UserProvider>
        </TooltipProvider>

        <Metrics userEmail={session?.user.email ?? ""} />
      </body>
    </html>
  );
}
