"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Link from "next/link";

interface Product {
  id: string;
  productName: string;
  description: string;
  previewImage: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  deliveryRange: string;
  productImages: Array<{ url: string }>;
}

const ProductsPage = () => {
  const axiosPrivate = useAxiosPrivate();

  const fetchProducts = async () => {
    const { data } = await axiosPrivate.get("/api/v1/products/all");
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-red-500">Error loading products</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Our Products</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.data.map((product: Product) => (
          <Link
            href={`/products/${product.id}`}
            key={product.id}
            className="overflow-hidden rounded-lg border bg-white shadow-sm transition-transform hover:scale-[1.02]"
          >
            <div className="relative h-48 w-full">
              <Image
                src={
                  product.previewImage ||
                  product.productImages[0]?.url ||
                  "/assets/placeholder.svg"
                }
                alt={product.productName}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.productName}</h3>
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold">
                    ₹{product.discountedPrice}
                  </span>
                  {product.discountPercentage > 0 && (
                    <>
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                      <span className="ml-2 text-sm text-green-600">
                        {product.discountPercentage}% off
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Delivery:{" "}
                {product.deliveryRange.replace(/_/g, " ").toLowerCase()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
