import ProductCardComponent from '../../_components/ProductCardComponent'
import { defaultSort, sortOption } from '@/lib/constants'
import { getProducts } from '@/lib/shopify'
import React from 'react'

type searchProps = {
    searchParams?: {
        [key: string]: string | string[] | undefined
    }
}

const SearchPage = async ({ searchParams }: searchProps) => {
    const {sort, q: searchValue} = await searchParams as {[key: string]: string};
    const { sortKey, reverse } = sortOption.find(item => item.slug === sort) || defaultSort;
    const products = await getProducts({ sortKey, reverse, query:  searchValue });
    const resultsText = products.length > 1 ? 'results' : 'result';
    console.log('products', products)
  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Search Results</h1>
      <p className='mb-4'>{products.length} {resultsText} found for "{searchValue}"</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {products.map((product) => (
          <div key={product.id} className='col-span-1'>
            <ProductCardComponent product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchPage
