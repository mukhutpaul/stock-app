"use client"
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import CategorieModal from '../components/CategorieModal'
import { useUser } from '@clerk/nextjs'
import { createCategorie, deleteCategorie, readCategorie, updateCategorie } from '../actions'
import { toast } from 'react-toastify'
import { Category } from '../generated/prisma'
import { read } from 'fs'
import EmptyState from '../components/EmptyState'
import { Pencil, Trash } from 'lucide-react'

const page = () => {
  const {user} = useUser()
  const email = user?.primaryEmailAddress?.emailAddress as string

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingCategoryId,setEditingCategoryId] = useState<string | null>(null)
  const [categories,setCategories] = useState<Category[]>([])

  const loadCategories = async () =>{
    if(email){
     const data= await readCategorie(email)
     if(data){
        setCategories(data)
     }  
    }
  }

  useEffect(()=>{
    loadCategories()
  },[email])

  const handleUpdateCategory = async () =>{
    if(!editingCategoryId) return
    setLoading(true)
    if(email){
      await updateCategorie(editingCategoryId,name,email,description)
    }
    await loadCategories()
    closeModal()
    setLoading(false)
    toast.success("Catégorie mise à jour avec succès")


  }

  const openCreateModal = () => {
    setName("");
    setDescription("");
    setEditMode(false);
    (document.getElementById("category_modal") as HTMLDialogElement)?.showModal()
  }

  const closeModal = () => {
    setName("");
    setDescription("");
    setEditMode(false);
    (document.getElementById("category_modal") as HTMLDialogElement)?.close()
  }


  const handleCreateCategory = async () =>{
    setLoading(true)
    if(email){
      await createCategorie(name,email,description)
    }
    await loadCategories()
    closeModal()
    setLoading(false)
    toast.success("Categorie créée avec succès")
  }

  const openEditModal = (category: Category) => {
    setName(category.name);
    setDescription(category?.description || "");
    setEditMode(true);
    setEditingCategoryId(category.id);

    (document.getElementById("category_modal") as HTMLDialogElement)?.showModal()
  }

   const handleDeleteCatgory = async (categoryId: string) => {
    const confirmDelete = confirm("Vous voulez vraiment supprimer cette catégorie? tous les produits associés seront aussi supprimés")
    if(!confirmDelete) return;
    await deleteCategorie(categoryId,email)
    await loadCategories()
    toast.success("Catégorie supprimée avec succès.")
  }



  return (
    <Wrapper>
        <div>
           <div className='mb-4 '>
            <button className='btn btn-primary'
            onClick={openCreateModal}
            >
               Ajouter une Categorie
            </button>
           </div>

           {categories.length > 0 ? (
               <div>
                {categories.map((category) =>(
                  <div className='mb-2 p-5 border-2 border-base-200 rounded-3xl flex justify-between items-center' key={category.id}>
                      
                      <div>
                        <strong className='text-lg'>{category.name}</strong>
                        <div className='text-sm'>{category.description}</div>
                      </div>

                      <div className='flex gap-2'>
                        <button className='btn btn-sm' onClick={() => openEditModal(category)}>
                          <Pencil className='w-4 h-4'/>

                        </button>

                         <button className='btn btn-sm btn-error' onClick={() =>handleDeleteCatgory(category.id)}>
                          <Trash className='w-4 h-4'/>

                        </button>

                      </div>

                  </div>
                ))}

               </div>
           ): (
               <EmptyState 
               IconComponent='Group'
               message={"Aucune catégorie disponible"}
               />
           )}
        </div>

        <CategorieModal 
             name={name}
             description={description}
             loading={loading}
             onclose={closeModal}
             onChangeName={setName}
             onChangeDescription={setDescription}
             onSubmit={editMode ? handleUpdateCategory : handleCreateCategory}
             editMode={editMode}  
        />
    </Wrapper>
  )
}

export default page