export const revalidate = 0;

import { getPaginatedUsers } from '@/actions';
import { Pagination, Title } from '@/components';

import { redirect } from 'next/navigation';
import { UsersTable } from './ui/UsersTable';
import { CustomSearchParams } from '@/interfaces';

export default async function OrdersPage({ searchParams }: CustomSearchParams) {
  const realSearchParams = await searchParams;
  const page = realSearchParams.page ? parseInt(realSearchParams.page) : 1;

  const { ok, users = [], totalPages } = await getPaginatedUsers({page});

  if(!ok){
    redirect('/auth/login');
  }

  return (
    <>
      <Title title="Mantenimiento de Usuarios" />

      <div className="mb-10">
        <UsersTable users={users}/>

        <Pagination totalPages={totalPages ?? 1}/>
      </div>
    </>
  );
}