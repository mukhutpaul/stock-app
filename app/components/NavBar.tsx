import { UserButton, useUser } from '@clerk/nextjs'
import { ListTree,Icon, PackagePlus, Menu, X, ShoppingBasket } from 'lucide-react'
import Link from 'next/link'

import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { checkAndAddAssociation } from '../actions'



const NavBar = () => {
    const [menuOpen,setMenuOpen] = useState(false)
    const {user} = useUser()
    const email = user?.primaryEmailAddress?.emailAddress

    const navLinks =[
    {href:"/products",label:"Produits",icon:ShoppingBasket},
    {href:"/categorie",label:"Categorie",icon:ListTree},
    {href:"/new-product",label:"Nouveau Produit",icon:PackagePlus}
] 

useEffect(() =>{
    if(email && user.fullName){
      checkAndAddAssociation(email,user.fullName)
    }

},[user])

 const pathname = usePathname()

const renderLinks  = (baseClasse : string) => (

    <>
    {navLinks.map(({href,label,icon:Icon}) =>{

        const isActive = pathname === href
        const activeClass = isActive ? 'btn-primary':'btn-ghost'

        return (
            <Link href={href} key={href}
            className={`${baseClasse} ${activeClass} btn-sm flex gap-2 items-center`}
            >
                <Icon className='w-4 h-4'/>
                {label}
            </Link>
        )

    })}
    </>
)
  return (
    <div className='border-b border-base-300 px-5 md:px-[10%] py-4 relative'>
        <div className='flex justify-between items-center'>
            <div className='flex items-center'>
                <div className='p-2'>
                    <PackagePlus className='w-6 h-6 text-primary'/>
                </div>
                <span className='font-bold text-xl'>
                    AssoStock
                </span>
            </div>

            <button className='btn w-fit sm:hidden btn-sm'
            onClick={() => setMenuOpen(!menuOpen)}
            >
                <Menu className='w-4 h-4'/>

            </button>
            <div className='hidden space-x-2 sm:flex items-center'>
                {renderLinks('btn')}
                 <UserButton />

            </div>

        </div>

        <div className={`absolute top-0 w-full bg-base-100 h-screen flex flex-col gap-2 p-4 transition-all duration-300 sm:hidden z-50 ${menuOpen ? 'left-0':'-left-full'}`}>
          <div className='flex justify-between'>
            <UserButton />
            <button className='btn w-fit sm:hidden btn-sm'
            onClick={() => setMenuOpen(!menuOpen)}
            >
                <X className='w-4 h-4'/>

            </button>
          </div>
          {renderLinks('btn')}
          
          
        </div>
    </div>
  )
}

export default NavBar