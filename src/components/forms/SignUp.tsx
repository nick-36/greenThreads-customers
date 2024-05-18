import {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import AccountProfile from "./AccountProfile";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {Icons} from "../ui/icons";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function SignUp() {
  return (
    <>
      <div className="container mx-auto px-0 h-full md:h-[100vh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-zinc-900">
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({variant: "link"}),
            "flex gap-2 absolute right-4 top-4 md:right-8 md:top-8 z-10 text-white md:text-black"
          )}
        >
          Login <Icons.forwardArrow className="font-bold" />
        </Link>
        <div className="relative  md:h-full flex-col justify-center  items-center bg-muted p-10 text-white lg:flex dark:border-r sm:h-auto">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative mx-auto z-20 flex items-center text-lg font-medium w-[200px] h-[200px] md:w-[300px] md:h-[300px]">
            <Image src="/assets/logo.svg" fill alt="green-thread-logo" />
          </div>
        </div>
        <div className="p-6 rounded-t-[32px] md:rounded-none  md:rounded-l-[32px] bg-white h-full">
          <div className="h-full flex flex-col  justify-center">
            <AccountProfile
              ctaText="Sign up"
              showPasswordField={true}
              isSignUpFlow={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}
