import { SignUpForm } from "@/features/auth/components/SignUpForm";

export const metadata = {
  title: "Sign Up – AutoFlow",
  description: "Create your AutoFlow account.",
  robots: "noindex, nofollow",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
