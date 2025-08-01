"use server"

import prisma from "@/lib/prisma"
import { Category } from "./generated/prisma"
import { FormDataType, Product } from "@/type"

export async function checkAndAddAssociation(email: string,name:string){
    if(!email) return

    try {

        const existingAssociation = await prisma.association.findUnique({
            where : {
                email: email
            }
        })

        if(!existingAssociation && name){
            await prisma.association.create({
                data: {
                    email,name
                }
            })
        }
        
    } catch (error) {
        console.error(error)
    }
}

export async function getAssociation(email: string){
    if(!email) return

    try {

        const existingAssociation = await prisma.association.findUnique({
            where : {
                email: email
            }
        })

        return existingAssociation
        
    } catch (error) {
        console.error(error)
    }
}

export async function createCategorie(
    name: string,
    email:string,
    description?: string
){
    if(!name) return

    try {

        const association = await getAssociation(email)

        if(!association){
            throw new Error("Aucune Association trouvée cet email.")
        }

        await prisma.category.create({
            data: {
            name,
            description : description || "",
            associationId : association.id
            }
        })

        
    } catch (error) {
        console.error(error)
    }
}

export async function updateCategorie(
    id:string,
    name: string,
    email:string,
    description?: string
){
    if(!name) return

    try {

        const association = await getAssociation(email)

        if(!id || !email || !email){
            throw new Error("L'Id,email de l'association et le nom de la catégorie sont requis pour la mise à jour.")
        }

        await prisma.category.update({
            where : {
                id:id,
                associationId: association?.id
            },
            data: {
            name,
            description : description || "",
            }
        })

        
    } catch (error) {
        console.error(error)
    }
}

export async function deleteCategorie(
    id:string,
    email:string
){
    if(!id || !email) return

    try {

        const association = await getAssociation(email)

        if(!id || !email){
            throw new Error("L'Id,email de l'association et le nom de la catégorie sont requis.")
        }

        await prisma.category.delete({
            where : {
                id:id,
                associationId: association?.id
            }
        })
        
    } catch (error) {
        console.error(error)
    }
}

export async function readCategorie(email:string) : Promise<Category [] | undefined>{
    if(!email) return

    try {

        const association = await getAssociation(email)

        if(!email){
            throw new Error("L'email de l'association est recquis.")
        }

        const categories =await prisma.category.findMany({
            where : {
                associationId: association?.id
            }
        })

    return categories;
        
    } catch (error) {
        console.error(error)
    }

}

export async function createProduct(formata:FormDataType,email:string){
    
    try {
        const{name,description,price,imageUrl, quantity, categoryId,unit} = formata
        if(!email || !price || !categoryId ||  !name) {
            throw new Error("Le nom, le prix, la catégorie et l'email de l'association sont requis pour la création du produit.")
        }

        const saveImageUrl = imageUrl || ""
        const saveUnit  = unit || ""

        const association = await getAssociation(email)

        if(!association){
            throw new Error("Aucune association trouvée avec cet email.")
        }

        await prisma.product.create({
            data : {
                name,
                description,
                price:Number(price),
                imageUrl:saveImageUrl,
                categoryId,
                unit:saveUnit,
                associationId:association.id
            }
        })
        
    } catch (error) {
        console.error(error)
    }
}

export async function updateProduct(formata:FormDataType,email:string){
    
    try {
       const{id,name,description,price,imageUrl, quantity} = formata
        if(!email || !price || !id ||  !name) {
            throw new Error("Le nom, le prix, la catégorie et l'email de l'association sont requis pour la création du produit.")
        }

        const association = await getAssociation(email)

        if(!association){
            throw new Error("Aucune association trouvée avec cet email.")
        }

        await prisma.product.update({
            where : {
                id:id,
                associationId:association.id
            },
            data : {
                name,
                description,
                price:Number(price),
                imageUrl:imageUrl,
            }
        })
        
    } catch (error) {
        console.error(error)
    }
}

export async function deleteProduct(id:string,email:string){
    
    try {
       
        if(!id) {
             throw new Error("Cet id es recquis pour la suppression.")
        }

        const association = await getAssociation(email)

        if(!association){
            throw new Error("Aucune association trouvée avec cet email.")
        }

        await prisma.product.delete({
            where : {
                id:id,
                associationId:association.id
            }
        })
        
    } catch (error) {
        console.error(error)
    }
}

export async function readProduct(email:string) : Promise<Product[]| undefined>{
    
    try {
       
        if(!email) {
             throw new Error("L'email est recquis.")
        }

        const association = await getAssociation(email)

        if(!association){
            throw new Error("Aucune association trouvée avec cet email.")
        }

        const products =await prisma.product.findMany({
            where : {
                associationId:association.id
            },
            include: {
                category:true
            }
        })

        return products.map(product =>({
           ...product,
           categoryName: product.category?.name  
        }))
        
    } catch (error) {
        console.error(error)
    }
}

export async function readProductById(productId:string,email:string) : Promise<Product | undefined>{
    
    try {
       
        if(!email) {
             throw new Error("L'email est recquis.")
        }

        const association = await getAssociation(email)

        if(!association){
            throw new Error("Aucune association trouvée avec cet email.")
        }

        const product =await prisma.product.findUnique({
            where : {
                id:productId,
                associationId:association.id
            },
            include: {
                category:true
            }
        })

        if(!product){
            return undefined
        }

        return {
            ...product,
            categoryName: product.category?.name
        }
        
    } catch (error) {
        console.error(error)
    }
}










