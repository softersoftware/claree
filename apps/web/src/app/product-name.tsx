'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { productName } from '@/product'

/** A link to the Projects page, except where it would lead nowhere new. */
export function ProductName() {
  const className = 'text-sm font-semibold tracking-tight'
  return ['/', '/projects'].includes(usePathname()) ? (
    <span className={className}>{productName}</span>
  ) : (
    <Link href="/projects" className={className}>
      {productName}
    </Link>
  )
}
