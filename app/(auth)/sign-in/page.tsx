import { redirect } from "next/navigation";

import { SignInForm } from "@/components/forms/sign-in-form";
import { getCurrentSession } from "@/lib/auth/session";

export default async function SignInPage() {
  const session = await getCurrentSession();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return <div className="mx-auto flex max-w-5xl justify-center"><SignInForm /></div>;
}
