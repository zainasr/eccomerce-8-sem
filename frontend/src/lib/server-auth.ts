import { cookies } from 'next/headers';

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  return accessToken;
}

export async function getServerUser() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return null;
  }



  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
      headers: {
        Cookie: `access_token=${accessToken}`,
      },
    });


    if (response.ok) {
      const data = await response.json();

      return data.data.user;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting server user:', error);
    return null;
  }
}