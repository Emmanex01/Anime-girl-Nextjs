import { ProductDetailsContent } from '@/app/_components/ProductDetails';
import { products } from '@/app/data';
import React from 'react'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = await params.then(p => p.id);
  return (
    <div>
        <h1>Product Page</h1>
        {
            products.filter(product => product.id === id).map(product => (
                <ProductDetailsContent key={product.id} product={product} />
            ))
        }
    </div>
  )
}

export default page
