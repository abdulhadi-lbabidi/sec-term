import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/table';
import { AddCategory } from './AddCategory';
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  Category,
} from '../../../api/Admin/categories';

export const Categories = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  // React Query hooks
  const { data, isLoading, isError, error } = useCategoriesQuery(page, perPage);
  const createMutation = useCreateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();

  const { setHeaderAction } = useOutletContext<{
    setHeaderAction: (action: React.ReactNode) => void;
  }>();

  useEffect(() => {
    setHeaderAction(
      <Button 
        onClick={() => setIsAddModalOpen(true)} 
        className="flex items-center gap-2"
        disabled={createMutation.isPending}
      >
        <Plus className="h-4 w-4" />
        {isRtl ? 'إضافة فئة' : 'Add Category'}
      </Button>
    );
    return () => setHeaderAction(null);
  }, [isRtl, setHeaderAction, createMutation.isPending]);

  const handleAddCategory = (formData: FormData) => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsAddModalOpen(false);
      },
    });
  };

  const handleDeleteCategory = (id: number) => {
    if (window.confirm(isRtl ? 'هل أنت متأكد من حذف هذه الفئة؟' : 'Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  const categoriesList = data?.data || [];

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 pt-0 text-black">
      <div className="mt-6 overflow-hidden rounded-xl border border-black/5">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-black/45" />
          </div>
        ) : isError ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-destructive">
            <p className="font-semibold">{isRtl ? 'حدث خطأ أثناء تحميل الفئات' : 'Error loading categories'}</p>
            <p className="text-xs text-black/50">{(error as any)?.message || ''}</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-black/5">
              <TableRow>
                <TableHead className="w-[100px] text-center font-bold">
                  {isRtl ? 'الصورة' : 'Image'}
                </TableHead>
                <TableHead className="font-bold">
                  {isRtl ? 'الاسم' : 'Name'}
                </TableHead>
                <TableHead className="hidden md:table-cell font-bold">
                  {isRtl ? 'الوصف' : 'Description'}
                </TableHead>
                <TableHead className="hidden sm:table-cell font-bold">
                  {isRtl ? 'تاريخ الإنشاء' : 'Created At'}
                </TableHead>
                <TableHead className="w-[80px] text-center font-bold">
                  {isRtl ? 'الإجراءات' : 'Actions'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoriesList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-black/40">
                    {isRtl ? 'لا توجد فئات حالياً. قم بإضافة فئة جديدة.' : 'No categories available. Please add one.'}
                  </TableCell>
                </TableRow>
              ) : (
                categoriesList.map((category: Category) => {
                  // Get first image from all_images or fallback
                  const imgUrl = category.all_images?.[0] || category.images || 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop';
                  return (
                    <TableRow key={category.id}>
                      <TableCell className="flex justify-center items-center">
                        <img
                          src={imgUrl}
                          alt={category.name}
                          className="h-12 w-12 rounded-lg object-cover border border-black/5"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-black/70 max-w-[300px] truncate">
                        {category.description}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-black/50">
                        {category.created_at}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </div>

       <AddCategory
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCategory}
        isPending={createMutation.isPending}
      />
    </div>
  );
};
