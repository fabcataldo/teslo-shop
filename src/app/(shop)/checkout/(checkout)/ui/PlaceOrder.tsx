'use client';

import { placeOrder } from "@/actions";
import { Spinner } from "@/components";
import { CustomButton } from "@/components/ui/custom-buttton/CustomButton";
import { useCartStore } from "@/store";
import { useAddressStore } from "@/store/address/address-store";
import { currencyFormatter } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export const PlaceOrder = () => {
    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const address = useAddressStore(state => state.address);
    const cart = useCartStore(state => state.cart);
    const clearCart = useCartStore(state => state.clearCart);

    const summaryInformation = useCartStore(useShallow((state) => state.getSummaryInformation()));
    const { subTotal, tax, total, itemsInCart } = summaryInformation;

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(()=>{
        setLoaded(true);
    }, []);

    const onPlaceOrder = async() => {
        setIsPlacingOrder(true);

        const productsToOrder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size
        }));

        const resp = await placeOrder(productsToOrder, address);

        if(!resp.ok){
            setIsPlacingOrder(false);
            setErrorMessage(resp.message);
            return;
        }
        
        clearCart();

        router.replace('/orders/' + resp.order!.id);
    }

    if(!loaded) {
        return <Spinner position={'left'} showLoadingLabel={true}/>
    }

    return (
        <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
                <p className="text-xl">
                    {address.firstName} {address.lastName}
                </p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>{address.postalCode}</p>
                <p>{address.city}, {address.country}</p>
                <p>{address.phone}</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
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

            <div className="mt-5 mb-2 w-full">
                <p className="mb-5">
                    <span className="text-xs">
                        Al hacer clic en &quot;Colocar orden&quot;, aceptas nuestros <a href="#" className="underline">términos y condiciones</a> y <a href="#" className="underline">política de privacidad</a>
                    </span>
                </p>

                <p className="text-red-500">{errorMessage}</p>
                
                <CustomButton
                    onClick={onPlaceOrder}
                    disabled={isPlacingOrder}
                    label="Colocar orden"
                    >
                </CustomButton>
            </div>
        </div>
    )
}
