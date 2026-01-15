import { createResponse } from '@/helpers/apiResponses';
import { openai } from '@ai-sdk/openai';
import { streamText, /*generateText*/ } from 'ai';
import { OpenAI } from 'openai';

// Let the Edge runtime know we might stream up to 30 seconds
export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        //const { messages }: { messages: UIMessage[] } = await req.json();
        const prompt = "Create a list of three open-ended and engaging question formating as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who could it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curosity, and contribute to a positive and welcoming conversational environment.";
        /*
        You don’t need to manually set the apiKey — it automatically uses your environment variable.
        If needed, you can still set it manually:
        openai('gpt-4o', { apiKey: process.env.OPENAI_API_KEY! })
        */
        const result = streamText({
            model: openai('gpt-4o-mini'),
            prompt
        });
        return result.toUIMessageStreamResponse();

        // for postman test
        /*
        const {text} = await generateText({
            model: openai('gpt-4o-mini'),
            prompt
          });
        return createResponse(
            true,
            'Text generated successfully.',
            200,
            text
        );
        */
    } catch (error) {

        /*
        The official OpenAI SDK (openai package) throws specific error classes, for example:
            OpenAI.APIError → server-side OpenAI error (500s)
            OpenAI.AuthenticationError → invalid API key (401)
            OpenAI.RateLimitError → too many requests (429)
            OpenAI.InvalidRequestError → invalid parameters (400)

        🧾 OpenAI.APIError — All Common Properties

        | **Property** |        **Type**         |        **Description**                |
       ----------------------------------------------------------------------------------- 
        | `name`       | `string`                | Always `"APIError"` 
        | `message`    | `string`                | Human-readable explanation of the error
        | `status`     | `number`                | HTTP status code (e.g. `400`, `401`, `429`, etc.)
        | `type`       | `string`                | OpenAI error type (`invalid_request_error`,      
                                                    `authentication_error`, etc.)
        | `code`       | `string | null`         | Specific error code from API (e.g. `insufficient_quota`, 
                                                    `invalid_api_key`)
        | `param`      | `string | null`         | The input parameter that caused the issue (if applicable)
        | `request_id` | `string | undefined`    | Unique ID for the failing request (helpful for debugging with 
                                                    OpenAI Support)
        | `headers`    | `Record<string, string>`| HTTP headers returned from OpenAI (includes `x-request-id`, 
                                                    `retry-after`, etc.)
        | `error`      | `object`                | Full raw error body returned by the API (for debugging) 
        | `stack`      | `string`                | Stack trace showing where the error occurred (JS standard)
        */

        if (error instanceof OpenAI.APIError) {
            const { name, status, message, headers } = error;
            return createResponse(
                false,
                name + ':' + message,
                status,
                headers,
                error
            );
        } else {
            return createResponse(
                false,
                'An unexpected error occured.',
                500,
                null,
                error
            );
            //throw error;
        }
    }
}