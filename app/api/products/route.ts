import {getProducts} from '@/app/lib/products';

export async function GET(){
<<<<<<< HEAD
=======
  console.log("GET /api/items HIT");
>>>>>>> d370e076b91b2be690216a72938f3153464dc51c
  const products = await getProducts();
  return Response.json(products);
}