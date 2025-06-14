import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (!code) {
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  }

  // Prepare a response object so we can set cookies on it
  const response = NextResponse.redirect(new URL(next, requestUrl.origin));
  const cookieStore = await cookies();

  // Create the Supabase client with custom cookie handlers
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Exchange the code for a session and set the cookie
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    // Optionally log or handle error
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  }

  // The session cookie is now set on the response
  return response;
} 