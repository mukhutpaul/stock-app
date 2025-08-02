"use client"
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useUser } from '@clerk/nextjs'
import { OrderItem, Product } from '@/type'
import { deductStockWithTransaction, readProduct } from '../actions'
import ProductComponent from '../components/ProductComponent'
import EmptyState from '../components/EmptyState'
import { table } from 'console'
import ProductImage from '../components/ProductImage'
import { Trash } from 'lucide-react'
import { toast } from 'react-toastify'



const page = () => {
    const {user} = useUser()
    const email = user?.primaryEmailAddress?.emailAddress as string
    const [products, setProducts] = useState<Product[]>([])
    const [order,setOrder] = useState<OrderItem []>([])
    const [searchQuery, setSearchQuaery] = useState<string>("")
    const [selectedProductIds,setSelectedProductIds] = useState<string>("")

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

    const handleAddToCart = (product : Product) =>{
        setOrder((prevOrder) =>{
            const existingProduct = prevOrder.find((item) => item.productId === product.id)
            let upatedOrder

            if(existingProduct){
                upatedOrder = prevOrder.map((item) =>
                    item.productId === product.id ?
                    {
                        ...item,
                        quantity : Math.min(item.quantity + 1,product.quantity)
                    } : item
                )
            }else{
                upatedOrder = [
                    ...prevOrder,
                    {
                        productId: product.id,
                        quantity: 1,
                        unit: product.unit,
                        imageUrl: product.imageUrl,
                        name: product.name,
                        availableQuantity: product.quantity
                    }
                ]
            }

            setSelectedProductIds((prevSelected:any) =>
                prevSelected.includes(product.id)
                    ? prevSelected
                    : [...prevSelected, product.id]
            )
            
            return upatedOrder
         
        })
    } 

    const handleQuantityChange = (productId: string, quantity: number) => {
        setOrder((prevOrder) =>
            prevOrder.map((item) =>
                item.productId === productId ? { ...item, quantity } : item
            )
        )
    }

     const handleRemoveFromCart = (productId: string) => {
        setOrder((prevOrder) => {
            const updatedOrder = prevOrder.filter((item) => item.productId !== productId)
            setSelectedProductIds((prevSelectedProductIds) =>
                prevSelectedProductIds.filter((id) => id !== productId)
            )
            return updatedOrder
        })
    }

    const handleSubmit = async () => {
        try {
            if (order.length == 0) {
                toast.error("Veuillez ajouter des produits à la commande.")
                return
            }
            const response = await deductStockWithTransaction(order, email)

            if (response?.success) {
                toast.success("Don confirmé avec succès !")
                setOrder([])
                setSelectedProductIds([])
                fetchProducts();
            } else {
                toast.error(`${response?.message}`)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        fetchProducts()
    },[])

    const filteredAvailableProduct = products
    .filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) => !selectedProductIds.includes(product.id))
    .slice(0,10)



  return (
    <Wrapper>
        <div className='flex md:flex-row flex-col-reverse'>
            <div className='md:w-1/4'>
            <input 
            type="text"
            placeholder='Rechercher un produit...'
            className='input input-bordered w-full mb-4'
            value={searchQuery}
            onChange={(e) =>setSearchQuaery(e.target.value)}
            />

            <div className='space-y-4'>
                {filteredAvailableProduct.length > 0 ? (
                    filteredAvailableProduct.map((product,index)=>(
                        <ProductComponent 
                        key={index}
                        add={true}
                        product={product}
                        handleAddToart={handleAddToCart}
                        />
                    ))

                ):(
             <EmptyState 
               message='Aucun produit disponible'
               IconComponent='PackageSearch'
               />
                )}
            </div>
            </div>

            <div className='md:w-2/3 p-4 md:ml-4 mb-4 md:mb-0 h-fit border-2 borderbase-200 rounded-3xl overflow-x-auto'>
            
               {
                order.length > 0 ? (
                <div>
                  <table className='table w-full scroll-auto'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Image</th>
                            <th>Nom</th>
                            <th>Quantité</th>
                            <th>unité</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {order.map((item,index) =>(
                            <tr key={item.productId}>
                                <th>{index + 1}</th>
                                <td>
                                    <ProductImage 
                                    src={item.imageUrl}
                                    alt={item.imageUrl}
                                    heightClass='h-12'
                                    widthClass='w-12'
                                    />
                                </td>
                                <td>
                                    {item.name}
                                </td>

                                <td>
                                    <input 
                                        type="number"
                                        className='input input-bordered w-20'
                                        value={item.quantity}
                                        min="1"
                                        max={item.availableQuantity}
                                        onChange={(e) =>handleQuantityChange(item.productId,Number(e.target.value))}
                                        />
                                </td>

                                 

                                <td className='capitalize'>
                                    {item.unit}
                                </td>

                                <td>
                                    <button 
                                    onClick={()=>handleRemoveFromCart(item.productId)}
                                    className='btn btn-sm btn-error'>
                                        <Trash className='w-4 h-4'/>
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                  </table>

                  <button
                  onClick={handleSubmit}
                  className='btn btn-primary mt-0 w-fit'
                  >
                    Confirmer le don
                  </button>
                 </div>
                ):(
                <EmptyState 
                 message='Aucun produit dans le panier'
                IconComponent='HandHeart'
                />
            
                )
               }

            </div>
            
        </div>
    </Wrapper>
  )
}

export default page