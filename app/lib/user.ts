import {createConnection} from '@/app/lib/db';

export async function getUser(username) {
  const db = await createConnection();

  const [user] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

  const { user_id } = user[0];

  const [listings] = await db.query('SELECT * FROM products WHERE seller_id = ?', [user_id]);

  const [reviews] = await db.query(`SELECT *
                                    FROM reviews
                                    WHERE transac_id IN 
                                      (
                                        SELECT transac_id 
                                            FROM transactions t
                                            JOIN products p
                                            ON t.listing_id = p.listing_id
                                            WHERE t.listing_id IN 
                                          (
                                            SELECT listing_id
                                                    FROM products 
                                                    WHERE seller_id = 1 AND is_avail = 0
                                                )
                                        );`, [user_id]);

  console.log(reviews);

  user[0]['listings'] = listings;
  user[0]['reviews'] = reviews;

  return user[0];
}