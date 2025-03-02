import InitializeToken from '@/app/lib/initializer'
import Search from '@/app/ui/search'
import { InvoicesTableSkeleton } from '@/app/ui/skeletons'
import { CreateUser } from '@/app/ui/users/buttons'
import Users from '@/app/ui/users/users'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <div>
      <InitializeToken />
      Listes des utilisateurs
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Rechercher un utilisateur..." />
        <CreateUser />
      </div>

      <Suspense fallback={<InvoicesTableSkeleton />}>
        <Users />
      </Suspense>

    </div>
  )
}

export default page
