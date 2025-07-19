"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignUpUser } from "@/lib/actions/user.actions";
import { SIGN_UP_DEFAULT_VALUES } from "@/lib/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const SignUpForm = () => {
  const [data, action] = useActionState(SignUpUser, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignUpButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full" variant={"default"}>
        {pending ? "Submiting..." : "Sign Up"}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div className="">
          <Label className="pb-4" htmlFor="name">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={SIGN_UP_DEFAULT_VALUES.name}
          />
        </div>
        <div className="">
          <Label className="pb-4" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={SIGN_UP_DEFAULT_VALUES.email}
          />
        </div>
        <div className="">
          <Label className="pb-4" htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue={SIGN_UP_DEFAULT_VALUES.password}
          />
        </div>
        <div className="">
          <Label className="pb-4" htmlFor="confirmPassword">
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="confirmPassword"
            defaultValue={SIGN_UP_DEFAULT_VALUES.confirmPassword}
          />
        </div>
        <div className="">
          <SignUpButton />
        </div>
        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
        <Link href={"/sign-in"} target="_self" className="link">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account? Sign In!
          </div>
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
