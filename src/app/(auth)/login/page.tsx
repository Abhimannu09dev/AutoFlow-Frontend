import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata = {
  title: "Login – AutoFlow",
  description: "Sign in to your AutoFlow account.",
  robots: "noindex, nofollow",
};

export default function LoginPage() {
  return <LoginForm />;
}
