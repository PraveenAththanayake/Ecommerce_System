"use client";

import { useEffect, useState } from "react";
import { IProduct } from "@/types";
import { getProducts } from "@/services";

const ProductsPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        console.log("Fetched Products:", data);
        setProducts(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id ?? product.name}>{product.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsPage;
