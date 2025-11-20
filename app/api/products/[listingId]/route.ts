import { getSpecificProduct } from '@/app/lib/specificProduct';

export async function GET(req, { params }) {
    const { listingId } = await params;

    console.log(listingId);

    const product = await getSpecificProduct(listingId);

    return Response.json(product);
}
