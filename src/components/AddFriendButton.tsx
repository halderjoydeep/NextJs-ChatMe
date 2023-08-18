"use client";

import { addFriendValidator } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "./ui/Button";

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton: React.FC = () => {
  const [showSuccessState, setShowSuccessState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    defaultValues: { email: "" },
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (data: FormData) => {
    try {
      setIsLoading(true);
      await axios.post("/api/friends/add", data);
      setShowSuccessState(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data });
        return;
      }

      setError("email", { message: "Something went wrong" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="max-w-sm" onSubmit={handleSubmit(addFriend)}>
      <label
        htmlFor="email"
        className="mb-2 block text-sm font-medium leading-6 text-gray-900"
      >
        Add friend by Email
      </label>
      <div className="flex items-center gap-4">
        <input
          {...register("email")}
          placeholder="you@example.com"
          className="block w-full rounded-md border-none py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        <Button type="submit" isLoading={isLoading}>
          Add
        </Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccessState && (
        <p className="mt-1 text-sm text-green-600">Friend request sent!</p>
      )}
    </form>
  );
};

export default AddFriendButton;
