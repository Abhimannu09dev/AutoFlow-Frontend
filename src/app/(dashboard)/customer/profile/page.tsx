import { redirect } from "next/navigation";

export const metadata = { title: "My Profile – AutoFlow" };

export default function CustomerProfileRoutePage() {
  redirect("/customer/settings");
}
