import type { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SummaryInformation {
    subTotal: number;
    tax: number;
    total: number;
    itemsInCart: number;
}

interface State {
    cart: CartProduct[];

    getTotalItems: () => number;
    getSummaryInformation: () => SummaryInformation;

    addProductToCart: (product: CartProduct) => void;
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    removeProduct: (product: CartProduct) => void;
}

export const useCartStore = create<State>()(
    //zustand con esta función guarda el store en el localstorage
    //y lo mantiene actualizado

    persist(
        (set, get) => ({
            cart: [],
            addProductToCart: (product: CartProduct) => {
                const { cart } = get();

                //1. revisar si el producto existe en el carrito con la talla seleccionada
                const productInCart = cart.some(
                    (item) => (item.id === product.id && item.size === product.size)
                );

                if(!productInCart) {
                    set({ cart: [... cart, product]});
                    return;
                }

                //2. sé que el producto existe por talla... tengo que incrementar su cantidad
                const updatedCartProducts = cart.map( (item) => {
                    if(item.id === product.id && item.size === product.size) {
                        return {...item, quantity: item.quantity + product.quantity}
                    }

                    return item;
                });

                set( { cart: updatedCartProducts } );
            },
            getTotalItems: () => {
                const {cart} = get();
                return cart.reduce((total, item) => total + item.quantity, 0);
            },
            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get();
    
                const newCart = cart.map((currentProduct) => {
                    if(currentProduct.id === product.id && currentProduct.size === product.size) {
                        return {
                            ...currentProduct,
                            quantity
                        }
                    } else {
                        return currentProduct;
                    }
                });

                set({ cart: newCart });
            },
            removeProduct: (product: CartProduct) => {
                const { cart } = get();
                const updatedCartProducts = cart.filter(p => p.id !== product.id && p.size !== product.size);

                set({cart: updatedCartProducts});
            },
            getSummaryInformation: () => {
                const { cart, getTotalItems }  = get();
                const subTotal = cart.reduce((subTotal, product) => (product.quantity * product.price) + subTotal,
                0);

                const tax = subTotal * 0.15;
                const total = subTotal + tax;
                const itemsInCart = getTotalItems();

                return {
                    subTotal, tax, total, itemsInCart
                }
            }
        }),
        {
            name: 'shopping-cart'
        }
    )
)