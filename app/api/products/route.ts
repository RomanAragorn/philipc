import { getProducts } from '@/app/lib/queries/products';

export async function GET(): Promise<Response> {
    const products = await getProducts();
    return Response.json(products);
}
