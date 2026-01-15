"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner"; //npx shadcn@latest add sonner
import { Toaster } from "@/components/ui/sonner"; //npx shadcn@latest add sonner

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

import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

export default function signInPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const route = useRouter();

    //zod implementation
    const signInForm = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });
    const onSubmitSignIn = async (formData: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);

        const result = await signIn('credentials', {
            redirect: false,
            identifier: formData.email,
            password: formData.password
        });

        if (result?.error) {
            if (result.error === 'CredentialsSignIn') {
                toast.error('Sign in failed', {
                    description: 'Incorrect username or password.',
                    position: 'top-center'
                });
            } else {
                toast.error('Error in sign in', {
                    description: result.error,
                    position: 'top-center'
                });
            }
        }
        setIsSubmitting(false);
    };

    return <div className="flex justify-center items-center min-h-screen bg-sky-200">
        <Toaster position="top-center" />
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-light lg:text-5xl mb-6">
                    Sign In Mystery Message
                </h1>
                <p className="mb-4">
                    Sign in to start your anonymous adventure
                </p>
            </div>
            <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSubmitSignIn)} className="space-y-8">
                    <FormField
                        control={signInForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email or Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email or Username" autoComplete="off" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={signInForm.control}
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
                                : ('Sign In Here')}
                        </Button>
                    </div>
                </form>
            </Form>
            <div className="text-center mt-4">
                <p>
                    Not a member? {' '}
                    <Link
                        href={'/sign-up'}
                        className="text-blue-600 hover:text-blue-900"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    </div>;
}