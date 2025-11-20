import { createConnection } from "@/app/lib/db";

export async function getSpecificProduct(listingId){
  const db = await createConnection();
  const product = await db.query(`SELECT products.*, CONCAT(users.first_name, " ", users.last_name) AS full_name 
                                  FROM products 
                                  JOIN users 
                                  ON products.seller_id = users.user_id 
                                  WHERE listing_id = ?`, [listingId]);
return product[0];
}