"use client";
import React from "react";

import Image from "next/image";
import Link from "next/link";

import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {UserAuthForm} from "@/components/forms/UserAuthForm";
import {Icons} from "../ui/icons";

const ForgotPassword = () => {
  return (
    <>
      {/*  mx-auto px-0 h-full md:h-[100vh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 */}
      <div className="container h-[calc(100vh-80px)] md:h-screen  px-0 items-center justify-center md:grid lg:max-w-none lg:grid-cols-2  bg-zinc-900">
        <Link
          href="/sign-up"
          className={cn(
            buttonVariants({variant: "ghost"}),
            "absolute left-2 top-4 md:left-8 md:top-8 z-10 text-white md:hidden"
          )}
        >
          <Icons.backArrow />
        </Link>
        <div className="relative md:h-full flex-col justify-center items-center p-10 text-white lg:flex dark:border-r sm:h-auto">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="hidden relative mx-auto md:flex items-center text-lg font-medium w-[200px] h-[200px] md:w-[300px] md:h-[300px]">
            <Image src="/assets/logo.svg" fill alt="green-thread-logo" />
          </div>
        </div>
        <div className="reltaive p-10 flex flex-col justify-start  md:justify-center rounded-t-[32px] md:rounded-none  md:rounded-l-[32px] bg-white h-full">
          <div className="mx-auto mt-20 md:mt-0 flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-left md:text-center">
              <div className="relative mb-20 md:mb-0 mx-auto flex items-center text-lg font-medium w-[175px] h-[134px] md:w-[200px] md:h-[200px]">
                <Image src="/assets/misc/key.svg" fill alt="key-svg" />
              </div>
              <div className="flex flex-col gap-4 items-center">
                <h1 className="text-2xl text-center font-semibold tracking-tight">
                  Forgot Password?
                </h1>
                <p className="text-sm max-w-56 text-center text-muted-foreground">
                  Enter your email, We will send you the link for reset
                  password.
                </p>
              </div>
            </div>
            <UserAuthForm
              step="FORGOT_PASSWORD"
              ctaText="Submit"
              ctaCallBack={() => {}}
              showPasswordField={false}
            />
            <p className="hidden md:flex  justify-center items-end md:items-start text-center text-sm text-muted-foreground">
              <Link
                href="/sign-in"
                className="underline underline-offset-4 hover:text-primary"
              >
                Log In Now
              </Link>{" "}
            </p>
          </div>
          <p className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden text-center text-sm text-muted-foreground">
            <Link
              href="/sign-in"
              className="underline underline-offset-4 hover:text-primary"
            >
              Log In Now
            </Link>{" "}
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
