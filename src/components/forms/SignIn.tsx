"use client";
import Image from "next/image";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {UserAuthForm} from "@/components/forms/UserAuthForm";
import {useSignIn} from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import {Icons} from "@/components/ui/icons";

export default function SignIn() {
  const {isLoaded, signIn, setActive} = useSignIn();
  const router = useRouter();

  return (
    <>
      <div className="container h-[calc(100vh-280px)] md:h-screen mx-auto px-0 flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-zinc-900">
        <Link
          href="/sign-up"
          className={cn(
            buttonVariants({variant: "link"}),
            "flex gap-2 absolute right-4 top-4 md:right-8 md:top-8 z-10 text-white md:text-black"
          )}
        >
          Sign up <Icons.forwardArrow className="font-bold" />
        </Link>
        <div className="relative md:h-full flex-col justify-center  items-center bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative mx-auto z-20 flex items-center text-lg font-medium w-[200px] h-[200px] md:w-[300px] md:h-[300px]">
            <Image src="/assets/logo.svg" fill alt="green-thread-logo" />
          </div>
        </div>
        <div className="px-6  py-8 flex items-start md:items-center rounded-t-[32px] md:rounded-none  md:rounded-l-[32px] bg-white h-full">
          <div className="mx-auto w-full md:max-w-80 flex  flex-col justify-start md:justify-center space-y-8">
            <div className="flex flex-col space-y-2 text-left md:text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome Back,
              </h1>
              <p className="text-sm text-muted-foreground">
                Log in into your account{" "}
              </p>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  );
}
