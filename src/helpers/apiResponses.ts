import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponse";

const statusMessage: Record<number, string> = {
  200: '[Ok] >> ',
  201: '[Created]>> ',
  400: '[Bad Request] >> ',
  401: '[Unauthorized] >>',
  403: '[Forbidden] >> ',
  404: '[Not Found] >> ',
  405: '[Method Not Allowed] >> ',
  410: '[Resourece permanently gone] >> ',
  500: '[Internal Server Error] >> '
};

/**
 * Creates a consistent API JSON response
 * @param success - whether the request succeeded
 * @param message - a human-readable message
 * @param status - optional HTTP status code 
 * @param data - optional additional data
 * @param error - optional complete error object
 **/

export function createResponse<T = unknown>(
  success: boolean,
  message: string,
  status: number = 200,
  data?: T,
  error?: T
) {
  const userMessage = success
    ? `✔ ${message}`
    : `❌ ${message}`;

  const body: ApiResponse = {
    success,
    message: userMessage,
    ...(data && { data }),
    ...(error && { error })
  };

  console.log('>> API Response: ', body, status);

  return NextResponse.json(
    body,
    { status }
  );
}

