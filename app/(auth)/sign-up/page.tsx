import { redirect } from "next/navigation";

import { SignUpForm } from "@/components/forms/sign-up-form";
import { getCurrentSession } from "@/lib/auth/session";

export default async function SignUpPage() {
  const session = await getCurrentSession();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return <div className="mx-auto flex max-w-5xl justify-center"><SignUpForm /></div>;
}
