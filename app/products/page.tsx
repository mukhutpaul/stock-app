"use client"
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useUser } from '@clerk/nextjs'
import { Product } from '@/type'
import { deleteProduct, readProduct } from '../actions'
import EmptyState from '../components/EmptyState'
import ProductImage from '../components/ProductImage'
import Link from 'next/link'
import { Pencil, Trash } from 'lucide-react'
import { toast } from 'react-toastify'

const page = () => {
    const {user} = useUser()
    const email = user?.primaryEmailAddress?.emailAddress as string

    const [products,setProducts] = useState<Product[]>([])

    const fetchProducts = async () =>{
        try {
            if(email){
                const products = await readProduct(email)
                if(products){
                    setProducts(products)
                }
                
            }
            
        } catch (error) {
            console.error(error)
        }
    }
    

    const handleDeletePrduct = async (product:Product)=>{

        const confirmDelete = confirm("Vaoulez-vous supprimer ce produi?")

        if(!confirmDelete) return;

        try {
            if(product.imageUrl){
                const resDelete = await fetch("/api/upload",{
                    method: "DELETE",
                    body: JSON.stringify({path:product.imageUrl}),
                    headers: {'content-type': 'application/json'}
                })

                const dataDelete = await resDelete.json()

                if(!dataDelete.success) {
                    throw new Error("Erreur lors de la suppression de l'image")
                }else{
                    if(email){
                        await deleteProduct(product.id,email)
                        await fetchProducts()
                        toast.success("Produit supprimé avec succès")
                        
                    }
                }

            }
        } catch (error) {
            console.error(error)
        }

    }

    useEffect(() => {
        if(email){
            fetchProducts()
        }
        
    },[email])

  return (
    <Wrapper>
        <div className='overflow-x-auto'>
            {products.length ===0 ? (
               <EmptyState 
               message='Aucun produit disponible'
               IconComponent='PackageSearch'
               />
            ):(
                <table className='table'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Image</th>
                            <th>Nom</th>
                            <th>Description</th>
                            <th>Prix</th>
                            <th>Quantité</th>
                            <th>Unité</th>
                            <th>Categorie</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product,index) =>(
                            <tr key={product.id}>
                                <th>{index + 1}</th>
                                <td>
                                    <ProductImage 
                                    src={product.imageUrl}
                                    alt={product.imageUrl}
                                    heightClass='h-12'
                                    widthClass='w-12'
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.price} $</td>
                                <td className='capitalize'>{product.quantity}</td>
                                <td>{product.unit}</td>
                                <td>{product.categoryName}</td>
                                <td className='flex gap-2 flex-col'>
                                    <Link className='btn btn-sm w-fit btn-primary' href={`/update-product/${product.id}`}>
                                    Modifier
                                    </Link>
                                    <button className={`btn btn-sm w-fit`}
                                    onClick={()=>handleDeletePrduct(product)}
                                    >
                                     <Trash className='w-4 h-4'/>
                                    </button>

                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>

            )}

        </div>
    </Wrapper>
  )
}

export default page