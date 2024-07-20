import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "../../components/auth/submit-button";

export default async function ForgotPassword({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const sendResetEmail = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return redirect("/forgot-password?message=Could not send reset email");
    }

    return redirect("/login?message=Check your email for reset instructions");
  };

  // Check if the user is already logged in
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <form
          className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
          action={sendResetEmail}
        >
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            placeholder="you@example.com"
            required
          />
          <SubmitButton
            formAction={sendResetEmail}
            className="bg-green-500 hover:bg-green-600 rounded-md px-4 py-2 text-foreground mb-2"
            pendingText="Sending..."
          >
            Send Reset Email
          </SubmitButton>
          <Link
            href="/login"
            className="text-blue-600 underline text-center mb-2"
          >
            Remembered your password? Sign In
          </Link>
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
