import { ProductDetailsContent } from '@/app/_components/ProductDetails';
import { products } from '@/app/data';
import { getMenu } from '@/lib/shopify';
import React from 'react'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const menu = await getMenu("main-menu");
    if (!menu) {
        console.error("Menu not found");
        throw new Error("Menu not found");
    }
    console.log("menu", menu);
    console.log('Ending')
    const id = await params.then(p => p.id);
  return (
    <div>
        {
            products.filter(product => product.id === id).map(product => (
                <ProductDetailsContent key={product.id} product={product} />
            ))
        }
    </div>
  )
}

export default page
