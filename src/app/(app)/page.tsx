'use client';

import React from "react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"; //npx shadcn@latest add card

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; //npx shadcn@latest add carousel

import Autoplay from "embla-carousel-autoplay";  //npm install embla-carousel-autoplay --save

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";


import messages from '@/messages.json';
import { Separator } from "@radix-ui/react-separator";

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true }) // Adjust delay and stopOnInteraction as needed
  );

  return <>
    <main>
      <section>
        <h1>
          Dive into the World of Anonymous Conversations
        </h1>
        <p>
          Explore Mystery Message - Where your identity remains a secret
        </p>
      </section>

      <Separator />

      <Carousel className="w-full max-w-xs" plugins={[plugin.current]}>
        <CarouselContent>
          {messages.map((message, index) =>
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="flex flex-col justify-between min-h-[220px]">
                  <div className="flex flex-row flex-wrap items-center gap-1">

                    <Avatar className="rounded-lg">
                      <AvatarImage
                        src="https://github.com/evilrabbit.png"
                        alt="@evilrabbit"
                      />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    <CardHeader className="font-semibold text-left">
                      {message.sender}
                    </CardHeader>
                  </div>

                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-base font-medium text-gray-900 break-words">{message.content}</span>
                  </CardContent>
                  <CardFooter className="text-sm text-gray-700 justify-center">
                    {message.received}
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
    <footer>
      © 2025 Mystery Messages. All rights reserved.
    </footer>
  </>;
}