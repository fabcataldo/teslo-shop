export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    page?: string;
  }
}

export default async function HomePage({ searchParams }: Props) {
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
