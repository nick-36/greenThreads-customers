"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";

interface SKU {
  id: string;
  skuId: string;
  title: string;
  sizeId: string;
  colorId: string;
  availableStock: number;
}

interface ProductData {
  productName: string;
  description: string;
  discountedPrice: number;
  originalPrice: number;
  skus: SKU[];
  previewImage: string;
  deliveryRange: string;
  isNextDayDelivery: boolean;
}

import { useAuth } from "@clerk/nextjs";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const ProductDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { userId } = useAuth();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedSKU, setSelectedSKU] = useState<SKU | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/v1/products/${id}`);
        setProduct(response.data.data);
      } catch (err) {
        setError("Failed to load product details");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product details",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to add items to cart",
      });
      return;
    }

    if (!selectedSKU) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select size and color",
      });
      return;
    }

    try {
      await axiosPrivate.post(
        `/api/v1/cart/${userId}/add-item`,
        {
          skuId: selectedSKU.id,
          quantity: 1,
        }
      );
      
      toast({
        title: "Success",
        description: "Item added to cart",
      });
      
      // Redirect to checkout page
      router.push('/checkout');
      
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart",
      });
    }
  };

  if (loading)
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <Alert variant="destructive" className="max-w-6xl mx-auto m-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );

  if (!product)
    return (
      <Alert className="max-w-6xl mx-auto m-4">
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>Product not found</AlertDescription>
      </Alert>
    );

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-gray-100 rounded-lg h-96 relative">
              {product.previewImage && (
                <Image
                  src={product.previewImage}
                  alt={product.productName}
                  fill
                  className="object-cover rounded-lg"
                />
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{product.productName}</h1>
                <p className="text-gray-500 mt-2">{product.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  ₹{product.discountedPrice}
                </span>
                {product.originalPrice > product.discountedPrice && (
                  <>
                    <span className="text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                    <Badge variant="secondary">
                      {Math.round(
                        ((product.originalPrice - product.discountedPrice) /
                          product.originalPrice) *
                          100
                      )}
                      % OFF
                    </Badge>
                  </>
                )}
              </div>

              {/* Size/Color Selection */}
              <div>
                <h3 className="font-semibold mb-3">Available Options:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.skus.map((sku) => (
                    <Button
                      key={sku.id}
                      variant={
                        selectedSKU?.id === sku.id ? "default" : "outline"
                      }
                      onClick={() => setSelectedSKU(sku)}
                      disabled={sku.availableStock === 0}
                      className="relative"
                    >
                      {sku.title}
                      {sku.availableStock === 0 && (
                        <Badge
                          variant="secondary"
                          className="absolute -top-2 -right-2"
                        >
                          Out of Stock
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={!selectedSKU}
                className="w-full"
                size="lg"
              >
                Add to Cart
              </Button>

              {/* Additional Product Info */}
              {product.deliveryRange && (
                <Alert>
                  <AlertTitle>Delivery Information</AlertTitle>
                  <AlertDescription>
                    {product.isNextDayDelivery
                      ? "Eligible for Next Day Delivery"
                      : `Delivery in ${product.deliveryRange
                          .toLowerCase()
                          .replace(/_/g, " ")}`}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;
