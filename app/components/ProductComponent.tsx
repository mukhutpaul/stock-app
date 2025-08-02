import { Product } from '@/type'
import React, { FC } from 'react'
import ProductImage from './ProductImage'
import { Plus } from 'lucide-react'

interface productComponentProps {
    product ? : Product | null
    add? : boolean,
    handleAddToart?: (product : Product) => void
}



const ProductComponent : FC<productComponentProps> = ({product,add,handleAddToart}) => {
  if(!product) {
    return(
        <div className='border-2 border-base-200 p-4 rounded-3xl w-fll flex items-center'>
            Séléctionner un produit pour voir le détails
        </div>
    )
   }



return (
    <div className='border-2 border-base-200 p-4 rounded-3xl w-fll flex items-center'>

        <div>
            <ProductImage 
                src={product.imageUrl}
                alt={product.imageUrl}
                heightClass='h-30'
                widthClass='w-30'
            />
        </div>

        <div className='ml-4 space-y-2 flex flex-col'>
            <h2 className='text-lg font-bold'>
             {product.name}
            </h2>

            <div className='badge bdge-warning badge-soft'>
                {product.categoryName}
            </div>

            <div className='badge bdge-warning badge-soft'>
                {product.quantity} {product.unit}
            </div>

            {add && handleAddToart &&(
                <button
                onClick={() => handleAddToart(product)}
                className='btn btn-sm btn-circle btn-primary'
                >
                    <Plus className='w-4 h-4' />

                </button>
            )}
            

        </div>

    </div>
  )
}

export default ProductComponent