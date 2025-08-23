'use client';

import { useCartStore } from "@/store";
import { currencyFormatter } from "@/utils";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export const OrderSummary = () => {
    const [loaded, setLoaded] = useState(false);
    const summaryInformation = useCartStore(useShallow((state) => state.getSummaryInformation()));
    const { subTotal, tax, total, itemsInCart } = summaryInformation;

    useEffect(() => {
      setLoaded(true);
    }, [])
    
    if(!loaded) return <p>Loading...</p>

    return (
        <div className="grid grid-cols-2">
            <span>No. Productos</span>
            <span className="text-right">{itemsInCart === 1 ? '1 artículo' : `${itemsInCart} artículos`}</span>

            <span>Subtotal</span>
            <span className="text-right">{currencyFormatter(subTotal)}</span>

            <span>Impuestos (15%)</span>
            <span className="text-right">{currencyFormatter(tax)}</span>

            <span className="mt-5 text-2xl">Total:</span>
            <span className="mt-5 text-right text-2xl">{currencyFormatter(total)}</span>
        </div>
    )
}
