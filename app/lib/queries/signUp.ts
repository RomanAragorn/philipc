import { pool } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";

interface GetSignUpResponse {
  success: boolean;
  userId?: number;
}

export async function signUp(first_name: string, last_name: string, email: string, contact_no: string, username: string, password: string, fb_link: string): Promise<GetSignUpResponse> {

  let result;

  try {
      [result]= await pool.execute<ResultSetHeader>(`INSERT INTO users
                                    (first_name, last_name, email, contact_no, username, password, fb_link)
                                    VALUES
                                      (?, ?, ?, ?, ?, ?, ?);`, [first_name, last_name, email, contact_no, username, password, fb_link]);
  } catch (error: any) {
    return {
      success: false,
      userId: undefined,
    }
  }
  
  return {
    success: true,
    userId: result.insertId,
  }
}