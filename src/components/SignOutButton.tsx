"use client";

import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "./ui/Button";

interface SignOutButtonProps extends React.ComponentPropsWithoutRef<"button"> {}

const SignOutButton: React.FC<SignOutButtonProps> = ({ ...props }) => {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOutHandler = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
    } catch (error) {
      toast.error("There was a problem signing out");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Button {...props} variant="ghost" onClick={signOutHandler}>
      {isSigningOut ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <LogOut className="h-5 w-5" />
      )}
    </Button>
  );
};

export default SignOutButton;
