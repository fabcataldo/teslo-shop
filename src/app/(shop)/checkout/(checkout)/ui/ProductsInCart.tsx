'use client';

import Image from "next/image";
import { useCartStore } from "@/store";
import { useEffect, useState } from "react";
import { currencyFormatter } from "@/utils";
import { Spinner } from "@/components";


export const ProductsInCart = () => {
    const [loaded, setLoaded] = useState(false);
    const productsInCart = useCartStore(state => state.cart);

    useEffect(() => {
      setLoaded(true);
    })
    
    if(!loaded){
        return <Spinner position={'left'} showLoadingLabel={true}/>
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
                        <span>
                            {product.size} - {product.title} ({product.quantity})
                        </span>

                        <p className="font-bold">{currencyFormatter(product.price * product.quantity)}</p>
                    </div>
                </div>
            ))
        }
    </>
}
