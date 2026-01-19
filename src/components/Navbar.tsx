"use client";

import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { Button } from "./ui/button";

import DonateAdv from "@/components/DonateAdv";

export default function NavBar() {
    const { data: session, status } = useSession();
    const user: User = session?.user as User;

    return <nav className="p-4 md:p-6 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <a className="text-xl mb-4 md:mb-0" href="#">Mystery Message</a>
            <DonateAdv />
            {
                session
                    ? <>
                        <span className="mr-4">
                            Welcome, {user?.username || user?.email}
                        </span>
                        <Button className="w-full md:w-auto" onClick={() => signOut()}>Logout</Button>
                    </>
                    : <>
                        <Link href='/sign-in'>
                            {/* <Button className="w-full md:w-auto text-white bg-sky-500">Login</Button> */}
                            <Button className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
                                Login
                            </Button>
                        </Link>
                    </>
            }
        </div>
    </nav>;
}