import Login from "@/component/auth/login";

export const metadata = {
  title: "Authentication - AutoFlow",
  description:
    "Sign in to your AutoFlow account to manage your parts and inventory.",
  robots: "noindex, nofollow",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex min-h-screen items-center justify-center">
        <Login />
      </div>
    </div>
  );
}
