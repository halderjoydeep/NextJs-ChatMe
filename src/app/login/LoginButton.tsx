"use client";

import { Icons } from "@/components/Icons";
import Button from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

const LoginButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const res = await signIn("google");
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      isLoading={isLoading}
      className="mx-auto w-full max-w-sm"
      onClick={loginWithGoogle}
    >
      {!isLoading && <Icons.Google className="mr-2 h-4 w-4" />} Google
    </Button>
  );
};

export default LoginButton;
