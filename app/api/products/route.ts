import { CreateProductInput } from '@/app/data/types';
import { getProducts, postProduct } from '@/app/lib/queries/products';

export async function GET(): Promise<Response> {
    const products = await getProducts();
    return Response.json(products);
}

export async function POST(req: Request): Promise<Response> {
    const body = (await req.json()) as CreateProductInput;
    const result = await postProduct(body);

    return Response.json(result);
}
