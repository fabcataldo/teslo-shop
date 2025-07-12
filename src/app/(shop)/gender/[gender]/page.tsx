export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {  
  params: Promise<{ gender: string }>  
  searchParams: Promise<{ page?: string }>
} 
export default async function GenderPage({ params, searchParams }: Props) {
  const realSearchParams = await searchParams;
  const realParams = await params;
  const page = realSearchParams.page ? parseInt(realSearchParams.page) : 1;
  const { gender } = realParams;

  // if (gender.includes("kids")) {
  //   notFound();
  // }

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    gender: gender as Gender
  });

  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }

  const labels: Record<string, string> = {
    men: "Hombres",
    women: "Mujeres",
    kid: "Niños",
    unisex: "Todos",
  };

  return (
    <>
      <Title
        title={`Articulos para ${labels[gender!]}`}
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
