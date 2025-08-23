"use client";

import { titleFont } from "@/config/fonts";
import { useCartStore, useUIStore } from "@/store";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";

export const TopMenu = () => {
  const openMenu = useUIStore((state) => state.openSideMenu);
  const totalItemsInCart = useCartStore(state => state.getTotalItems());

  //para resolver el problema de hidratación relacionado a zustand
  //porque resulta que con el persist() de zustand estamos guardando
  //el store del cart en localstorage, luego, para que el servidor
  //y el cliente tengan lo mismo a la hora de hidratar
  //se implementa esto
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, [])
  

  return (
    <nav className="flex px-5 justify-between items-center w-full">
      {/* Logo */}
      <div>
        <Link href="/">
          <span className={`${titleFont.className} antialiased font-bold`}>
            Teslo
          </span>
          <span>| Shop</span>
        </Link>
      </div>

      {/* Center Menu */}
      <div className="hidden sm:block">
        <Link
          href="/gender/men"
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Hombres
        </Link>
        <Link
          href="/gender/women"
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Mujeres
        </Link>
        <Link
          href="/gender/kid"
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Niños
        </Link>
      </div>

      {/* Search, Cart, Menu */}
      <div className="flex items-center">
        <Link href="/search" className="mx-2">
          <IoSearchOutline className="w-5 h-5" />
        </Link>

        <Link href={(totalItemsInCart === 0) && loaded ? '/empty' : '/cart'}
           className="mx-2">
          <div className="relative">
            {
              (loaded && totalItemsInCart > 0) && (
                <span className="fade-in absolute text-xs px-1 rounded-full font-bold -top-2 bg-blue-700 text-white -right-2">
                  {totalItemsInCart}
                </span>
              )
            }
            <IoCartOutline />
          </div>
        </Link>

        <button
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          onClick={openMenu}
        >
          Menú
        </button>
      </div>
    </nav>
  );
};
