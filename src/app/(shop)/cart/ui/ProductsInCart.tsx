'use client';

import Image from "next/image";
import { useCartStore } from "@/store";
import { QuantitySelector } from "@/components";
import { useEffect, useState } from "react";
import Link from "next/link";


export const ProductsInCart = () => {
    const [loaded, setLoaded] = useState(false);
    const productsInCart = useCartStore(state => state.cart);
    const updateProductQuantity = useCartStore(state => state.updateProductQuantity);
    const removeProduct = useCartStore(state => state.removeProduct);

    useEffect(() => {
      setLoaded(true);
    })
    
    if(!loaded){
        return <p>loading...</p>
    }

    return <>
        {
            productsInCart.map(product => (
                <div key={`${product.slug}-${product.id}-${product.size}`} className="flex mb-5">
                    <Image
                        style={{
                            width: '100px',
                            height: '100px'
                        }}
                        src={`/products/${product.image}`}
                        width={100}
                        height={100}
                        alt={product.title}
                        className="mr-5 rounded"
                    />

                    <div>
                        <Link href={`/product/${product.slug}`} className="hover:underline cursor-auto">
                            {product.size} - {product.title}
                        </Link>

                        <p>${product.price}</p>

                        <QuantitySelector 
                            quantity={product.quantity}
                            onQuantityChanged={
                                value => updateProductQuantity(product, value)    
                            }
                        />
                        <button
                            className="underline mt-3"
                            onClick={() => removeProduct(product)}
                        >Remover</button>
                    </div>
                </div>
            ))
        }
    </>
}
