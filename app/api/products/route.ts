import { CreateProductInput } from '@/app/data/types';
import { getProducts, postProduct, filterProducts } from '@/app/lib/queries/products';
import { verifySession } from '@/app/lib/session';

export async function GET(req: Request): Promise<Response> {
    const { searchParams } = new URL(req.url);

    const session = await verifySession();
    const excludeSellerId = session?.userId ? Number(session.userId) : undefined;

    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const condition = searchParams.get('condition') || '';
    const minPrice = searchParams.get('minPrice') || ''; //'0';
    const maxPrice = searchParams.get('maxPrice') || ''; //'50000';
    const sort = searchParams.get('sort') || '';

    const filters = {
        category,
        search,
        condition,
        minPrice,
        maxPrice,
        sort,
        excludeSellerId,
    };

    if (category || search || condition || minPrice || maxPrice || sort) {
        const products = await filterProducts(filters);
        return Response.json(products);
    }

    const products = await getProducts(excludeSellerId);
    return Response.json(products);
}

export async function POST(req: Request): Promise<Response> {
    const body = (await req.json()) as CreateProductInput;
    const result = await postProduct(body);

    return Response.json(result);
}
