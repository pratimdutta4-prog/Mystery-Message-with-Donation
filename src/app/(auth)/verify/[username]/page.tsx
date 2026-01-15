"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from 'axios';

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { verifyCodeSchema } from "@/schemas/verifyCodeSchema";
import { ApiResponse } from "@/types/ApiResponse";

export default function VerifyAccount() {
    const router = useRouter();
    const params = useParams();

    //zod implementation
    const verifyForm = useForm<z.infer<typeof verifyCodeSchema>>({
        resolver: zodResolver(verifyCodeSchema),
        defaultValues: {
            code: ''
        }
    });

    const onSubmitVerify = async (formData: z.infer<typeof verifyCodeSchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: formData.code
            });
            //console.log('>> Verify form: ', response);
            toast.success(response.data?.message, {
                position: 'top-left'
            });
            router.replace('/sign-in');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message || 'Error in user signup.';
            //console.error(errorMessage);
            toast.error(errorMessage, {
                position: 'top-center'
            });
        }
    }
    return <div className="flex justify-center items-center min-h-screen bg-purple-400">
        <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md bg-white">
            <div className="text-center">
                <h1>Verify your account</h1>
            </div>
            <Form {...verifyForm}>
                <form onSubmit={verifyForm.handleSubmit(onSubmitVerify)} className="space-y-8">
                    <FormField
                        control={verifyForm.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="Code" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter the code that has already been sent to your email.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className='bg-green-400' type="submit">Verify</Button>
                </form>
            </Form>
        </div>

    </div>;
}