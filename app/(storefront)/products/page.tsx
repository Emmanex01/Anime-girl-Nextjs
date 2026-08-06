import { ProductProvider } from '@/app/_components/product/product-context'
import { ProductsPage } from '@/app/_components/ProductsPage'
import React from 'react'

const page = () => {
  return (
    <div>
      <ProductProvider>
        <ProductsPage/>
      </ProductProvider>
    </div>
  )
}

export default page
