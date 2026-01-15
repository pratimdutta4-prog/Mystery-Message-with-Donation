// import React from 'react';

// export default function Page() {
//     return <>page</>;
// }


/*'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button
        className="bg-red-500 text-white p-3 px-3 py-1 m-4 rounded"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </>
  )
}*/



"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";  //npm i usehooks-ts
import { toast } from "sonner"; //npx shadcn@latest add sonner
import { Toaster } from "@/components/ui/sonner"; //npx shadcn@latest add sonner
import axios, { AxiosError } from 'axios';  //npm i axios
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"; //npx shadcn@latest add input
import { Button } from "@/components/ui/button";
import { Spinner } from '@/components/ui/shadcn-io/spinner';
//npx shadcn@latest add https://www.shadcn.io/registry/spinner.json

import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";

export default function signUp() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [usernameStatus, setUsernameStatus] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setDebouncedUsername = useDebounceCallback(setUsername, 300);
  const route = useRouter();

  //zod implementation
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      password: ''
    }
  });

  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        setUsernameStatus(false);

        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          const { data } = response;
          console.log('>> Sign-up form:', response);
          setUsernameMessage(data.message);
          setUsernameStatus(data.success);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          console.log(axiosError);
          setUsernameMessage(axiosError.response?.data?.message
            || 'Error found in the process of checking username uniqueness.');
          setUsernameStatus(axiosError.response?.data?.success || false);
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUniqueness();
  }, [username])

  const onSubmitSignUp = async (formData: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const { data: responseData } = await axios.post<ApiResponse>(`/api/sign-up`, formData);

      if (responseData.success) {
        toast.success(responseData.message);
      } else {
        toast.error(responseData.message);
      }
      route.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError?.response?.data?.message || 'Error in user signup.';
      console.error('>> Api sign-up error: ', error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="flex justify-center items-center min-h-screen bg-sky-200">
    <Toaster position="top-center" />
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-light lg:text-5xl mb-6">
          Join Mystery Message
        </h1>
        <p className="mb-4">
          Sign up to start your anonymous adventure
        </p>
      </div>
      <Form {...signUpForm}>
        <form onSubmit={signUpForm.handleSubmit(onSubmitSignUp)} className="space-y-8">
          <FormField
            control={signUpForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    autoComplete="off"
                    autoFocus
                    {...field}
                    onChange={e => {
                      field.onChange(e);
                      setDebouncedUsername(e.target.value);
                    }}
                  />
                </FormControl>

                {
                  isCheckingUsername
                  && <div className="flex text-sm text-yellow-600">
                    ⚠️Checking Userame<Spinner variant="ellipsis" />
                  </div>
                }

                <FormMessage className={`text-sm ${usernameStatus
                  ? 'text-green-500'
                  : 'text-red-500'}`}
                >
                  {usernameMessage}
                </FormMessage>

              </FormItem>
            )}
          />
          <FormField
            control={signUpForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={signUpForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 text-sm">+91</span>
                    <Input
                      placeholder="xxxxxxxxxx"
                      autoComplete="off"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={signUpForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded w-full"
            >
              {isSubmitting
                ? (<>
                  <Spinner variant="circle-filled" />Submitting...
                </>
                )
                : ('Sign Up Here')}
            </Button>
          </div>
        </form>
      </Form>
      <div className="text-center mt-4">
        <p>
          Already a member? {' '}
          <Link
            href={'/sign-in'}
            className="text-blue-600 hover:text-blue-900"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  </div>;
}