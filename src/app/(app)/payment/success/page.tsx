'use client';

import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const sessionId = params.get('session_id');
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">
        Payment successfull.
      </h1>
      <p>
        You will receive confirmation shortly.
      </p>
      {
        sessionId &&
        <p>
          <strong>Session Id: </strong>{sessionId}
        </p>
      }
    </div>
  );
}