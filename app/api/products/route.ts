import { getProducts } from '@/app/lib/products';

export async function GET() {
    console.log('GET /api/items HIT');
    const products = await getProducts();
    return Response.json(products);
}
