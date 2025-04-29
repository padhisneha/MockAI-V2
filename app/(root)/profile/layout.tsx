import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - MockAI",
  description: "View and manage your MockAI profile"
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}