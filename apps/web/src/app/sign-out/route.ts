import { NextResponse } from 'next/server'
import { forget } from '@/session'

export async function POST(request: Request) {
  await forget()
  return NextResponse.redirect(new URL('/', request.url), 303)
}
