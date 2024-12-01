"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

interface CartSummary {
  id: string;
  totalAmount: number;
  discount: number;
  tax: number;
  cartItems: Array<{
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    sku: {
      product: {
        productName: string;
        discountedPrice: number;
      };
      color: { name: string };
      size: { name: string };
    };
  }>;
}

const CheckoutPage = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const axiosPrivate = useAxiosPrivate();
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartSummary = async () => {
      try {
        const response = await axiosPrivate.get(
          `/api/v1/cart/${userId}/cart-summary`
        );
        setCartSummary(response.data.data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load cart summary",
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCartSummary();
    }
  }, [userId, axiosPrivate]);

  const handleCheckout = async () => {
    if (!cartSummary) return;

    try {
      const response = await axiosPrivate.get(
        `/webhook/checkout/checkout-session/${cartSummary.id}`
      );
      // Redirect to Stripe checkout
      window.location.href = response.data.url;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initiate checkout",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!cartSummary || cartSummary.cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-center">Your cart is empty</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Checkout Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cart Items */}
          <div className="space-y-4">
            {cartSummary.cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-4"
              >
                <div>
                  <p className="font-medium">{item.sku.product.productName}</p>
                  <p className="text-sm text-gray-500">
                    {item.sku.size.name} / {item.sku.color.name}
                  </p>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">₹{item.totalPrice}</p>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{cartSummary.totalAmount}</span>
            </div>
            {cartSummary.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{cartSummary.discount}</span>
              </div>
            )}
            {cartSummary.tax > 0 && (
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{cartSummary.tax}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>
                ₹
                {cartSummary.totalAmount -
                  cartSummary.discount +
                  cartSummary.tax}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button onClick={handleCheckout} className="w-full" size="lg">
            Proceed to Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutPage;
