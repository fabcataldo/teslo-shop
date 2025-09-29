"use client";

import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface Props{
    children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  console.log(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID)
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
        intent: 'capture',
        currency: 'USD'
      }}>
      <SessionProvider>
          {children}
      </SessionProvider>  
    </PayPalScriptProvider> 
  )
}
