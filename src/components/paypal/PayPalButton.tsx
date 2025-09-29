"use client";

import { setTransactionId } from '@/actions/payments/set-transaction-id';
import { CreateOrderActions, CreateOrderData } from '@paypal/paypal-js';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'

interface Props {
    orderId: string;
    amount: number;
}


export const PayPalButton = ({orderId, amount}: Props) => {
    const [{ isPending }] = usePayPalScriptReducer();

    const roundedAmount = (Math.round(amount * 100)) / 100;

    if(isPending){
        return(
            <div className='animate-puls mb-16'>
                <div className='h-11 bg-gray-300 rounded'></div>
                <div className='h-11 bg-gray-300 rounded mt-2'></div>
            </div>
        )
    }

    const createOrder = async (
        data: CreateOrderData,
        actions: CreateOrderActions
    ): Promise<string> => {
        const transactionId = await actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        value: `${roundedAmount}`,
                        currency_code: 'USD'
                    }
                }
            ]
        });

        const resp = await setTransactionId(transactionId, orderId);

        if(!resp.ok) {
            throw new Error(resp.message);
        }

        return transactionId;
    }


    return (
        <PayPalButtons
            createOrder={createOrder}
        />
    )
}
