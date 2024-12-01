"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";

export default function PaymentFailed() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (!error) {
      router.push("/");
    }
  }, [error, router]);

  return (
    <div className="container mx-auto p-4 h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        <div className="flex justify-center">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold">Payment Failed</h1>
        
        <p className="text-gray-600">
          Sorry, your payment was not successful. Please try again.
        </p>

        <div className="space-y-4 pt-4">
          <Button 
            onClick={() => router.push("/checkout")} 
            className="w-full"
          >
            Try Again
          </Button>
          
          <Button 
            onClick={() => router.push("/")} 
            variant="outline" 
            className="w-full"
          >
            Return to Home
          </Button>
        </div>
      </Card>
    </div>
  );
} 