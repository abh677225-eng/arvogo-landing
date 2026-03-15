import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buying Your First Home in Australia — Get Oriented",
  description: "Not sure where to start with buying a home in Australia? Answer 4 quick questions to understand where you are in the process, what comes next, and what you can safely ignore for now.",
  keywords: [
    "buying first home Australia",
    "should I buy a house now Australia",
    "am I ready to buy a home Australia",
    "first home buyer guide Australia",
    "home buying process Australia",
    "first home buyer checklist Australia",
  ],
  openGraph: {
    title: "Thinking About Buying a Home in Australia?",
    description: "Get oriented in under 2 minutes. Understand where you are, what comes next, and what you can safely ignore for now.",
    url: "https://www.arvogo.com/house",
  },
  alternates: { canonical: "https://www.arvogo.com/house" },
};

export default function HouseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
