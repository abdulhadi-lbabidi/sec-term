import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { Trash2, Loader2, Users as UsersIcon, Plus, Pencil } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/table';
import { DeleteConfirmationModal } from '../../../components/Admin/DeleteConfirmationModal';
import { GeneralPagination } from '../../../components/Admin/GeneralPagination';
import { AddUser } from './AddUser';
import {
  useUsersQuery,
  useDeleteUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  UserItem,
} from '../../../api/Admin/users';

export const Users = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { hasPermission } = useAuth();
  const canCreate = hasPermission('create_user');
  const canEdit = hasPermission('update_user');
  const canDelete = hasPermission('delete_user');

  const { data, isLoading, isError, error } = useUsersQuery(page, perPage);
  const deleteMutation = useDeleteUserMutation();
  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();

  const { setHeaderAction } = useOutletContext<{
    setHeaderAction: (action: React.ReactNode) => void;
  }>();

  useEffect(() => {
    if (canCreate) {
      setHeaderAction(
        <Button
          onClick={() => {
            setSelectedUser(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          <Plus className="h-4 w-4" />
          {t('admin.add_user')}
        </Button>
      );
    } else {
      setHeaderAction(null);
    }
    return () => setHeaderAction(null);
  }, [setHeaderAction, createMutation.isPending, updateMutation.isPending, t, canCreate]);

  const handleAddOrUpdateUser = (payload: any) => {
    if (selectedUser) {
      updateMutation.mutate(
        { id: selectedUser.id, payload },
        {
          onSuccess: () => {
            setIsAddModalOpen(false);
            setSelectedUser(null);
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsAddModalOpen(false);
          setSelectedUser(null);
        },
      });
    }
  };

  const handleDeleteUser = (id: number) => {
    setUserIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userIdToDelete !== null) {
      deleteMutation.mutate(userIdToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setUserIdToDelete(null);
        },
      });
    }
  };

  const usersList = data?.data || [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-160px)] justify-between space-y-6">
      <div className="rounded-2xl border border-black/10 bg-white p-6 text-black">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-black/45" />
          </div>
        ) : isError ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-destructive">
            <p className="font-semibold">{t('admin.error_loading')}</p>
            <p className="text-xs text-black/50">{(error as any)?.message || ''}</p>
          </div>
        ) : usersList.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-black/40">
            <UsersIcon className="h-12 w-12" />
            <p className="text-sm font-medium">{t('admin.no_users_found')}</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-start">ID</TableHead>
                    <TableHead className="text-start">{t('admin.name')}</TableHead>
                    <TableHead className="text-start">{t('admin.email')}</TableHead>
                    <TableHead className="text-start">{t('admin.status')}</TableHead>
                    <TableHead className="text-start">{t('admin.roles')}</TableHead>
                    <TableHead className="text-start">{t('admin.created_at')}</TableHead>
                    <TableHead className="text-start"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersList.map((user: UserItem) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {user.is_active ? t('admin.active') : t('admin.inactive')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <span
                              key={role.id}
                              className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-750 ring-1 ring-inset ring-purple-700/10"
                            >
                              {role.name}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell dir="ltr" className="text-start">
                        {user.created_at}
                      </TableCell>
                      <TableCell className="text-end">
                        <div className="flex items-center gap-1 justify-end">
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsAddModalOpen(true);
                              }}
                              className="h-8 w-8 text-black/50 hover:bg-black/5 hover:text-black"
                              disabled={deleteMutation.isPending}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(user.id)}
                              className="h-8 w-8 text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="block md:hidden space-y-4">
              {usersList.map((user: UserItem) => (
                <div key={user.id} className="rounded-xl border border-black/10 bg-white p-4 space-y-3 shadow-sm text-black">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-black/45">ID: {user.id}</span>
                    <span className="text-xs text-black/35 dir-ltr">{user.created_at}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span>{user.name}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {user.is_active ? t('admin.active') : t('admin.inactive')}
                      </span>
                    </div>
                    <p className="text-xs text-black/55">{user.email}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.roles.map((role) => (
                        <span
                          key={role.id}
                          className="inline-flex items-center rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-750 ring-1 ring-inset ring-purple-700/10"
                        >
                          {role.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 border-t pt-2 mt-2">
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsAddModalOpen(true);
                        }}
                        className="h-8 gap-1 text-black/75 hover:bg-black/5 hover:text-black cursor-pointer text-xs"
                        disabled={deleteMutation.isPending}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        {t('admin.edit_user')}
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="h-8 gap-1 text-destructive/85 hover:bg-destructive/10 hover:text-destructive cursor-pointer text-xs"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t('admin.delete')}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <GeneralPagination
        currentPage={data?.meta?.current_page || 1}
        lastPage={data?.meta?.last_page || 1}
        onPageChange={(p) => setPage(p)}
        isRtl={isRtl}
        perPage={perPage}
        onPerPageChange={(val) => {
          setPerPage(val);
          setPage(1);
        }}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserIdToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />

      <AddUser
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedUser(null);
        }}
        onAddOrUpdate={handleAddOrUpdateUser}
        isPending={createMutation.isPending || updateMutation.isPending}
        userData={selectedUser}
      />
    </div>
  );
};
