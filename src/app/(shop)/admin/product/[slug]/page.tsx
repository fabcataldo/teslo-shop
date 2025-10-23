import { getCategories, getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export default async function ProductPage(props: PageProps){
    const { slug } = await props.params;

    const [product, categories] = await Promise.all([
        getProductBySlug(slug),
        getCategories()
    ]);

    if(!product && slug !== 'new') {
        redirect('/admin/products');
    }

    const title = (slug === 'new') ? 'Nuevo Producto' : 'Editar Producto';

    return (
        <>
            <Title title={title}/>
            <ProductForm product={product ?? {}} categories={categories}/>
        </>
    )
}