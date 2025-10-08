export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { CustomSearchParams } from "@/interfaces/custom-search-params.interface";
import { redirect } from "next/navigation";

export default async function HomePage({ searchParams }: CustomSearchParams) {
  const realSearchParams = await searchParams;
  const page = realSearchParams.page ? parseInt(realSearchParams.page) : 1;
  const { products, totalPages } = await getPaginatedProductsWithImages({ page });

  if(products.length === 0){
    redirect('/');
  }

  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" className="mb-2" />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages}/>
    </>
  );
}
