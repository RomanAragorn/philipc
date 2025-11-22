import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";

export async function GET(){
  const cookie = await cookies();

  const session = cookie.get('session')?.value;

  if (!session) {
    return Response.json({ loggedIn: false });
  }

  const payload = await decrypt(session);

  return Response.json({
    success: true,
    message: 'Logged in',
    data: {
      loggedIn: !!payload,
      userId: payload?.userId ?? null,
    },
  });
}