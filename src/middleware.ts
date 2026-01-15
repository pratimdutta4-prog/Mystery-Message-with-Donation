import { NextResponse, NextRequest } from 'next/server';
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (token &&
    (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/') ||
      url.pathname.startsWith('/verify')
    )
  )
    return NextResponse.redirect(new URL('/dashboard', request.url));

  if (!token && url.pathname.startsWith('/dashboard'))
    return NextResponse.redirect(new URL('/sign-in', request.url));
    
  return NextResponse.next();
}

/*if (token) {
  if (
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/verify') ||
    url.pathname === '/'
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next(); // let them access /dashboard, /home, etc.
}

// ❌ Not logged in
if (url.pathname.startsWith('/dashboard')) {
  return NextResponse.redirect(new URL('/sign-in', request.url));
}

// Allow public pages (/home, /sign-in, /sign-up, /verify)
return NextResponse.next();
}

export const config = {
  matcher: ['/', '/sign-in', '/sign-up', '/verify/:path*', '/dashboard/:path*']
}*/