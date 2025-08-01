import React from 'react'
import { Product } from '../generated/prisma'
import Image from 'next/image'

interface productImageProps {
    src: string,
    alt:string,
    heightClass ? : string,
    widthClass ? : string
}

const ProductImage : React.FC<productImageProps> = (
    {
        src,
        alt,
        heightClass,
        widthClass
    }) => {
  return (
    <div className='avatar'>
        <div className={`mask mask-squircle ${Highlight} ${widthClass}`}>
            <Image 
              src={src}
              alt={alt}
              quality={100}
              className='object-cover'
              height={500}
              width={500}
            />

        </div>

    </div>
  )
}

export default ProductImage