'use client';

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form"; //npm install react-hook-form
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from 'axios';
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";

import { Message, User } from "@/model/User";
import { acceptMessagesSchema } from "@/schemas/acceptMessagesSchema";
import { ApiResponse } from "@/types/ApiResponse";
import MessageCard from "@/components/MessageCard";

export default function UserDashboard() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    const handleMessageDelete = (messageId: string) => {
        setMessages(messages.filter(message => message._id !== messageId));
    };

    const { data: session } = useSession();

    const acceptMessagesForm = useForm<z.infer<typeof acceptMessagesSchema>>({
        resolver: zodResolver(acceptMessagesSchema),
        defaultValues: {
            isAcceptingMessages: false
        }
    });
    // console.log('>> AcceptMessageForm:', acceptMessagesForm);

    const { watch, register, setValue, handleSubmit } = acceptMessagesForm;

    const isAcceptingMessagesWatch = watch('isAcceptingMessages');

    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true);

        try {
            const acceptMessagesResponse = await axios
                .get<ApiResponse<{ isAcceptingMessages: boolean }>>(`/api/accept-messages`);
            const isAcceptingMessagesResponseData = acceptMessagesResponse.data?.data?.isAcceptingMessages ?? false;
            setValue('isAcceptingMessages', isAcceptingMessagesResponseData);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message
                || 'Failed to fetch acceptance messages status';

            console.error(`>> [❌] Error response of fetching acceptance messages' status: `, errorMessage);
            toast.error(errorMessage, {
                position: 'top-center'
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue]);

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(false);

        try {
            const getMessagesRespons = await axios.get<ApiResponse>(`/api/get-messages`);
            setMessages(getMessagesRespons.data?.messages || []);

            if (refresh) {
                toast.success('Showing latest messages.', {
                    position: 'top-center'
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data?.message
                || 'Failed to fetch messages.';

            console.error(`>> [❌] Error response of fetching acceptance messages: `, errorMessage);
            toast.error(errorMessage, {
                position: 'top-center'
            });
        } finally {
            setIsLoading(false);
            setIsSwitchLoading(false);
        }
    }, [setIsLoading, setMessages]);

    useEffect(() => {
        if (!session || !session.user) return;

        fetchMessages();
        fetchAcceptMessages();

    }, [session, toast, fetchAcceptMessages, fetchMessages]);

    const handleSwitchChange = async () => {
        try {
            const acceptMessagesPostResponse = await axios.post<ApiResponse>(`/api/accept-messages`, {
                isAcceptingMessages: !isAcceptingMessagesWatch
            });
            setValue('isAcceptingMessages', !isAcceptingMessagesWatch);

            toast.success(acceptMessagesPostResponse?.data?.message, {
                position: 'top-center'
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data?.message || 'Failed to update message acceptance status.';

            toast.error(errorMessage, {
                position: 'top-center'
            });
        }
    };

    /** 
    | Goal                 | Code                                   | Example Output                |
    | -------------------- | -------------------------------------- | ----------------------------- |
    | Get base origin      | `window.location.origin`               | `https://myapp.com`           |
    | Get full URL         | `window.location.href`                 | `https://myapp.com/dashboard` |
    | Get hostname only    | `window.location.hostname`             | `myapp.com`                   |
    | Get protocol         | `window.location.protocol`             | `https:`                      |
    | From `<base>` tag    | `document.baseURI`                     | `https://myapp.com/`          |
    | Safe in all browsers | `new URL(window.location.href).origin` | `https://myapp.com`           |
    **/

    const username = session?.user as User;

    const baseUrl = window.location.origin;
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success('Profile URL has been copied to clipboard.');
    }

    if (!session || !session.user) return <div>Please login.</div>;

    return <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">
            User Dashboard
        </h1>
        <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
                Copy Your Unique Profile Link
            </h2>{' '}
            <div className="flex items-center">
                <input
                    type="text"
                    value={profileUrl}
                    readOnly
                    className="input input-bordered w-full p-2 mr-2"
                />
                <Button onClick={copyToClipboard}>
                    Copy
                </Button>
            </div>
        </div>
        <div className="mb-4">
            <Switch
                {...register('isAcceptingMessages')}
                checked={isAcceptingMessagesWatch}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
            />
            <span className="ml-2">
                Accept Messages: {isAcceptingMessagesWatch ? 'On' : 'Off'}
            </span>
        </div>

        <Separator />

        <div>
            {
                messages.length > 0
                    ? (
                        messages.map((message, index) =>
                            <MessageCard
                                key={index}
                                message={message}
                                onMessageDelete={handleMessageDelete}
                            />
                        )
                    )
                    : <p>No messages to display.</p>
            }
        </div>
    </div>;
}