'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { productName } from '@/product'

/** A link to the Projects page, except on it. */
export function ProductName() {
  const className = 'text-sm font-semibold tracking-tight'
  return usePathname() === '/projects' ? (
    <span className={className}>{productName}</span>
  ) : (
    <Link href="/projects" className={className}>
      {productName}
    </Link>
  )
}
