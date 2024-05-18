"use client";

import * as React from "react";

import {cn} from "@/lib/utils";
import {Icons} from "@/components/ui/icons";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SignInValidation} from "@/lib/validation/userValidation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {useSignIn} from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import {useToast} from "../ui/use-toast";
import {Separator} from "../ui/separator";
import Image from "next/image";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  step?: "SIGN_IN" | "SIGN_UP" | "FORGOT_PASSWORD";
  ctaText?: string;
  ctaCallBack?: (data?: any) => void;
  showPasswordField?: boolean;
}

export function UserAuthForm({className, ...props}: UserAuthFormProps) {
  const {
    step = "SIGN_IN",
    ctaCallBack = () => {},
    ctaText = "Login",
    showPasswordField = true,
  } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const {isLoaded, signIn, setActive} = useSignIn();
  const router = useRouter();
  const {toast} = useToast();

  // async function onSubmit(formValues: any) {
  //   ctaCallBack(formValues);
  // }

  const form = useForm({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      _step: step,
      email: "",
      password: "",
    },
  });

  // form.setValue("_step", "SIGN_IN");

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    if (!isLoaded) {
      return;
    }

    try {
      const result = await signIn.create({
        identifier: values?.email,
        password: values.password,
      });

      if (result.status === "complete") {
        console.log(result);
        await setActive({session: result.createdSessionId});
        router.push("/");
      } else {
        /*Investigate why the sign-in hasn't completed */
        console.log(result);
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: err.errors[0].message ?? "",
        duration: 2000,
      });
      console.error("error", err.errors[0].longMessage);
    }
    setIsLoading(false);
  };

  const signInWithGoogle = () => {
    if (!isLoaded) return;

    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      // redirectUrl:
      // "https://welcome-macaw-8.clerk.accounts.dev/v1/oauth_callback",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-10 md:gap-4">
            <div className="grid gap-6">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({field}) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Email (e.g.,name@example.com)"
                          className="placeholder:text-gray-300 placeholder:font-light"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {showPasswordField && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                      <FormItem className="flex w-full flex-col">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            id="password"
                            placeholder="******"
                            type="password"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            className="placeholder:text-gray-300 placeholder:font-light"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
            <Button disabled={isLoading} onClick={ctaCallBack}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {ctaText}
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex items-center gap-x-2">
        <Separator className="shrink" />
        <span className="text-xs">OR</span>
        <Separator className="shrink" />
      </div>
      <Button
        variant="outline"
        className="w-full flex items-center gap-x-2 justify-center"
        onClick={signInWithGoogle}
      >
        <Image
          src="/assets/misc/google.svg"
          alt="Google logo"
          width={24}
          height={24}
        />
        {ctaText} with Google
      </Button>
      <div className="relative">
        {/* <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div> */}
        {step === "SIGN_IN" && (
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              <Link href="/forgot-password">Forgot Password?</Link>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
