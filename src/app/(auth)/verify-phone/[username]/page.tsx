'use client';

import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from 'zod';

import { ApiResponse } from "@/types/ApiResponse";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const otpSchema = z.object({
  otp: z.string()
    .min(6, 'Otp must be exactly 6 digits.')
    .max(6, 'Otp must be exactly 6 digits.')
});

type OtpType = z.infer<typeof otpSchema>;

export default function VerifyPhone() {
  const { username } = useParams();
  const route = useRouter();

  const [phone, setPhone] = useState('');
  const [otpValues, setOtpValues] = useState(Array(6).fill(''));
  const [sendOtpSuccessStatus, setSendOtpSuccessStatus] = useState(false);
  const [otpResendFlag, setOtpResendFlag] = useState(true);
  const [otpExpiryMin, setOtpExpiryMin] = useState(0);
  const [otpExpirySec, setOtpExpirySec] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');

  const inputOtpRef = useRef<Array<HTMLInputElement | null>>([]);

  const form = useForm<OtpType>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ''
    }
  });

  const handleOtpChange = (value: string, index: number) => {
    if (! /^\d+$/.test(value)) {
      toast.error('Only digits are allowed.', {
        position: 'top-center'
      })
      return;
    }
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.slice(-1);
    setOtpValues(newOtpValues);

    if (value && inputOtpRef.current[index + 1]) {
      inputOtpRef.current[index + 1]?.focus();
    }
  };

  const handleClipboardPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const clipboardText = e.clipboardData.getData("text").replace(/\D/g, '');

    if (clipboardText.length !== 6) {
      toast.error('Clipboard OTP is not length of 6 digits.', {
        position: 'top-center'
      });
      return;
    }
    const newOtpValues = clipboardText.split('');
    setOtpValues(newOtpValues);

    newOtpValues.forEach((value, index) => {
      if (inputOtpRef.current[index]) {
        inputOtpRef.current[index]!.value = value;
      }
    });
    inputOtpRef.current[5]?.focus();
  };

  const handleBackSpace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = '';
      setOtpValues(newOtpValues);

      if (index > 0 && !otpValues[index])
        inputOtpRef.current[index - 1]?.focus();
    }
  };

  const getPhone = async () => {
    setAlertMessage('Getting phone number');

    try {
      //call Api using GET method
      const response = await axios.get('/api/get-phone', {
        params: {
          username
        }
      });

      //call Api using POST menthod
      /*const response = await axios.post('/api/get-phone', { username });*/

      //console.log('>> Api get-phone success response: ', response);

      response && setPhone('+91' + response?.data?.data?.phone);

      setAlertMessage(response?.data?.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError?.response?.data?.message || 'Phone no. not found.';

      //console.error('>> Api get-phone error response: ', error);
      setAlertMessage(errorMessage);
    }
  };

  const getSetOtpExpiryMinSecLeft = (otpExpiryStr: string) => {
    const otpExpiryMs = new Date(otpExpiryStr).getTime();
    const nowMs = Date.now();
    let otpExpiryLeftMs = otpExpiryMs - nowMs;
    otpExpiryLeftMs = otpExpiryLeftMs > 0 ? otpExpiryLeftMs : 0;
    const otpExpiryLeftSec = Math.floor(otpExpiryLeftMs / 1000);
    setOtpExpiryMin(Math.floor(otpExpiryLeftSec / 60));
    setOtpExpirySec(otpExpiryLeftSec % 60);
  };

  const sendOtp = async () => {
    setAlertMessage('Sending OTP');

    try {
      const response = await axios.post('/api/send-phone-code', { username, phone });

      //console.log('>> Api send-phone-code success response: ', response);

      setSendOtpSuccessStatus(response?.data?.success);
      getSetOtpExpiryMinSecLeft(response?.data?.data?.otpExpiry);

      inputOtpRef.current[0]?.focus();

      setAlertMessage(response?.data?.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError?.response?.data?.message || 'Failed to sent Phone Verification Code.';

      //console.error('>> Api send-phone-code error response:', error);
      setAlertMessage(errorMessage);
    }
  };

  const verifyOtp = async (otp: string) => {
    try {
      const response = await axios.post('/api/verify-phone-code', { phone, otp });

      //console.log('>> Api verify-phone-code success response: ', response);
      toast.success(response?.data?.message, {
        position: 'top-center'
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError?.response?.data?.message
        || 'Failed to verify phone verification code.';

      //console.error('>> Api verify-phone-code error response:', error);
      toast.error(errorMessage, {
        position: 'top-center'
      });
    }
  };

  const submitOtp = async () => {
    const otp = otpValues.join('');

    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digits OTP.', {
        position: 'top-center'
      });
      return;
    }
    form.setValue('otp', otp); //automatically put the OTP inside the OTP input box
    verifyOtp(otp);
  };

  useEffect(() => {
    if (!username) return;

    getPhone();
  }, [username]);

  useEffect(() => {
    if (!phone) return;

    //sendOtp();
    inputOtpRef.current[0]?.focus();
  }, [phone]);

  const calculateOtpExpiryLeft = () => {
    if (otpExpirySec > 0) {
      setOtpExpirySec(prev => prev - 1);
    }
    else {
      if (otpExpiryMin > 0) {
        setOtpExpiryMin(prev => prev - 1);
        setOtpExpirySec(59);
      }
      else {
        setSendOtpSuccessStatus(false);
        setAlertMessage('Otp expired. Try again.');
        toast.info('OTP expired. Try again.', {
          position: 'top-center'
        });
      }
    }
  };

  useEffect(() => {
    if (!sendOtpSuccessStatus) {
      if (otpResendFlag) {
        sendOtp();

        setOtpValues(Array(6).fill(''));
        inputOtpRef.current[0]?.focus();
      }
      return;
    }

    const otpExpiryLeftTimer = setInterval(() => {
      calculateOtpExpiryLeft();
    }, 1000);

    return () => clearInterval(otpExpiryLeftTimer);
  }, [sendOtpSuccessStatus, otpExpiryMin, otpExpirySec]);

  if (!username)
    return <>Username not found.</>;

  return <div className="min-h-screen flex items-center justify-center">
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex flex-row justify-between">
          Verify your phone
          <div className="flex items-center gap-x-3 font-normal text-sm italic">
            OTP Resend:
            <Switch
              className="
           data-[state=checked]:bg-green-500
           data-[state=unchecked]:bg-gray-300
         "
              id="otp-resend"
              checked={otpResendFlag}
              onCheckedChange={(value: boolean) => setOtpResendFlag(value)}
            />
            <Label htmlFor="otp-resend">
              {
                otpResendFlag
                  ? 'On'
                  : 'Off'
              }
            </Label>
          </div>
        </CardTitle>

        <CardDescription>
          Enter your OTP below to verify your account
        </CardDescription>
        <div className="grid w-full max-w-xl items-start gap-4">
          <Alert>
            <AlertTitle className='flex flex-row items-center justify-center'>
              {alertMessage}
              {(!sendOtpSuccessStatus && otpResendFlag) &&
                <Spinner variant="ellipsis" />}
            </AlertTitle>
          </Alert>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={e => {
          e.preventDefault();
          submitOtp();
        }}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-row gap-2 items-center justify-center">
              {
                otpValues.map((value, index) => <Input
                  className="w-10"
                  key={index}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  value={otpValues[index]}
                  onChange={e => handleOtpChange(e.target.value, index)}
                  onKeyDown={e => handleBackSpace(e, index)}
                  onPaste={handleClipboardPaste}
                  ref={(ele => {
                    if (ele) inputOtpRef.current[index] = ele;
                  })}
                  placeholder="x"
                  required
                />)
              }
            </div>
            {
              (otpExpiryMin || otpExpirySec)
                ? <span>
                  OTP expired in:
                  {' '}
                  {String(otpExpiryMin).padStart(2, '0')}:
                  {String(otpExpirySec).padStart(2, '0')}
                </span>
                : null
            }
          </div>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Verify
            </Button>
            <Button variant='ghost' className="w-full" onClick={sendOtp}>
              Resend OTP
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  </div>;
}