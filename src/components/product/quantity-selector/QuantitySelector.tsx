"use client";

import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
    quantity: number;
    onQuantityChanged: (value: number) => void;
}

export const QuantitySelector = ({ quantity, onQuantityChanged }: Props) => {
    const onValueChanged = (value: number) => {
        if(quantity + value < 1) return;

        onQuantityChanged(quantity + value);
    }

    return (
        <div className="flex">
            <button onClick={()=>onValueChanged(-1)}>
                <IoRemoveCircleOutline size={50} />
            </button>

            <span className="flex justify-center items-center w-20 mx-1 px-6 bg-gray-100 text-center rounded">
                {quantity}
            </span>

            <button onClick={()=>onValueChanged(1)}>
                <IoAddCircleOutline size={50} />
            </button>
        </div>
    )
}
