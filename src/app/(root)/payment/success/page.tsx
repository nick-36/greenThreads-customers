"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
    }
  }, [sessionId, router]);

  return (
    <div className="container mx-auto p-4 h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        
        <p className="text-gray-600">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <div className="space-y-4 pt-4">
          <Button 
            onClick={() => router.push("/orders")} 
            className="w-full"
          >
            View Orders
          </Button>
          
          <Button 
            onClick={() => router.push("/")} 
            variant="outline" 
            className="w-full"
          >
            Continue Shopping
          </Button>
        </div>
      </Card>
    </div>
  );
} 