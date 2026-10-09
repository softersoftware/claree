'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { productName } from '@/product'

/** The platform's name, leading to the projects from anywhere but the projects themselves. */
export function ProductName() {
  const className = 'text-sm font-semibold tracking-tight'
  return usePathname() === '/' ? (
    <span className={className}>{productName}</span>
  ) : (
    <Link href="/" className={className}>
      {productName}
    </Link>
  )
}
