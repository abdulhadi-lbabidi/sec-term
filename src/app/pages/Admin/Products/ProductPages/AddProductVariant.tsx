import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Loader2, ArrowLeft, X, PartyPopper } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { useSizesQuery } from '../../../../api/Admin/sizes';
import { useMaterialsQuery } from '../../../../api/Admin/materials';
import { usePackagesQuery } from '../../../../api/Admin/packages';
import { useCreateProductVariantMutation, useUpdateProductVariantMutation, useProductVariantQuery } from '../../../../api/Admin/products';
import Barcode from 'react-barcode';

interface FormValues {
  sizeId: string;
  materialId: string;
  price: number;
  discaount: number;
  stockQuantity: number;
  sku: string;
  barcode: string;
  images: FileList;
}

export const AddProductVariant = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { productId, variantId } = useParams<{ productId?: string; variantId?: string }>();
  const isEditMode = !!variantId;
  const navigate = useNavigate();

  const { data: sizesData, isLoading: isLoadingSizes } = useSizesQuery(1, 100);
  const { data: materialsData, isLoading: isLoadingMaterials } = useMaterialsQuery(1, 100);
  const { data: packagesData, isLoading: isLoadingPackages } = usePackagesQuery(1, 100);
  const createVariantMutation = useCreateProductVariantMutation();
  const updateVariantMutation = useUpdateProductVariantMutation();

  const { data: variantData, isLoading: isLoadingVariant } = useProductVariantQuery(variantId ? Number(variantId) : null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      price: 0,
      discaount: 0,
      stockQuantity: 0,
    },
  });

  const [selectedPackages, setSelectedPackages] = useState<{ [key: number]: number }>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const watchedImages = watch('images');
  const watchBarcode = watch('barcode');

  useEffect(() => {
    if (watchedImages && watchedImages.length > 0) {
      const file = watchedImages[0];
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watchedImages]);

  useEffect(() => {
    if (isEditMode && variantData?.data) {
      const vData = variantData.data;
      reset({
        sizeId: String(vData.current_size?.id || vData.size_id || ''),
        materialId: String(vData.current_material?.id || vData.material_id || ''),
        price: vData.price || 0,
        discaount: vData.discount || vData.discaount || 0,
        stockQuantity: vData.stock_quantity || 0,
        sku: vData.sku || '',
        barcode: vData.barcode || '',
      });

      if (vData.images && vData.images.length > 0) {
        setImagePreview(vData.images[0]);
      } else if (vData.image) {
        setImagePreview(vData.image);
      }

      if (vData.packages) {
        const pkgs: { [key: number]: number } = {};
        vData.packages.forEach((p: any) => {
          pkgs[p.id || p.package_id] = p.quantity || p.pivot?.quantity || 1;
        });
        setSelectedPackages(pkgs);
      }
    }
  }, [isEditMode, variantData, reset]);

  const handlePackageToggle = (packageId: number) => {
    setSelectedPackages((prev) => {
      const copy = { ...prev };
      if (copy[packageId] !== undefined) {
        delete copy[packageId];
      } else {
        copy[packageId] = 0;
      }
      return copy;
    });
  };

  const handlePackageQuantityChange = (packageId: number, qty: number) => {
    setSelectedPackages((prev) => ({
      ...prev,
      [packageId]: qty,
    }));
  };

  const onSubmit = (data: FormValues) => {
    if (!productId && !isEditMode) return;
    const formData = new FormData();
    if (productId) formData.append('product_id', productId);
    formData.append('size_id', data.sizeId);
    formData.append('material_id', data.materialId);
    formData.append('price', String(data.price));
    formData.append('discaount', String(data.discaount));
    formData.append('stock_quantity', String(data.stockQuantity));
    if (data.sku) formData.append('sku', data.sku);
    if (data.barcode) formData.append('barcode', data.barcode);

    const packageEntries = Object.entries(selectedPackages);
    packageEntries.forEach(([pkgId, qty], index) => {
      formData.append(`packages[${index}][package_id]`, pkgId);
      formData.append(`packages[${index}][quantity]`, String(qty));
    });

    if (data.images && data.images.length > 0) {
      formData.append('images[0]', data.images[0]);
    }

    if (isEditMode && variantId) {
      formData.append('_method', 'PUT');
      updateVariantMutation.mutate(
        { id: Number(variantId), formData },
        {
          onSuccess: () => {
            navigate('/admin/products');
          },
        }
      );
    } else {
      createVariantMutation.mutate(formData, {
        onSuccess: () => {
          setShowSuccessModal(true);
        },
      });
    }
  };

  const sizes = sizesData?.data || [];
  const materials = materialsData?.data || [];
  const packagesList = packagesData?.data || [];
  const isPending = createVariantMutation.isPending || updateVariantMutation.isPending;

  if (isLoadingSizes || isLoadingMaterials || isLoadingPackages || isLoadingVariant) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black/45" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 text-black">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sizeId" className="text-sm font-semibold">
              {t('title.size')} *
            </Label>
            <Controller
              name="sizeId"
              control={control}
              rules={{ required: t('admin.required_field') }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={errors.sizeId ? 'border-destructive focus-visible:ring-destructive/20' : ''}
                  >
                    <SelectValue placeholder={t('title.select_size')} />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((sz) => (
                      <SelectItem key={sz.id} value={String(sz.id)}>
                        {sz.size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.sizeId && (
              <p className="text-xs font-medium text-destructive">{errors.sizeId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="materialId" className="text-sm font-semibold">
              {t('title.material')} *
            </Label>
            <Controller
              name="materialId"
              control={control}
              rules={{ required: t('admin.required_field') }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={errors.materialId ? 'border-destructive focus-visible:ring-destructive/20' : ''}
                  >
                    <SelectValue placeholder={t('title.select_material')} />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((mat) => (
                      <SelectItem key={mat.id} value={String(mat.id)}>
                        {mat.material}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.materialId && (
              <p className="text-xs font-medium text-destructive">{errors.materialId.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-semibold">
              {t('title.price')} *
            </Label>
            <Input
              id="price"
              type="number"
              {...register('price', {
                required: t('admin.required_field'),
                min: { value: 0, message: t('admin.required_field') },
              })}
              className={errors.price ? 'border-destructive focus-visible:ring-destructive/20' : ''}
            />
            {errors.price && (
              <p className="text-xs font-medium text-destructive">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discaount" className="text-sm font-semibold">
              {t('title.discount')}
            </Label>
            <Input
              id="discaount"
              type="number"
              {...register('discaount', {
                min: { value: 0, message: t('admin.required_field') },
              })}
              className={errors.discaount ? 'border-destructive focus-visible:ring-destructive/20' : ''}
            />
            {errors.discaount && (
              <p className="text-xs font-medium text-destructive">{errors.discaount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stockQuantity" className="text-sm font-semibold">
              {t('title.stock')} *
            </Label>
            <Input
              id="stockQuantity"
              type="number"
              {...register('stockQuantity', {
                required: t('admin.required_field'),
                min: { value: 0, message: t('admin.required_field') },
              })}
              className={errors.stockQuantity ? 'border-destructive focus-visible:ring-destructive/20' : ''}
            />
            {errors.stockQuantity && (
              <p className="text-xs font-medium text-destructive">{errors.stockQuantity.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku" className="text-sm font-semibold">
              {t('title.sku')}
            </Label>
            <Input
              id="sku"
              {...register('sku')}
              className={errors.sku ? 'border-destructive focus-visible:ring-destructive/20' : ''}
            />
            {errors.sku && (
              <p className="text-xs font-medium text-destructive">{errors.sku.message}</p>
            )}
          </div>
        </div>

        <div className="w-full">

          <div className="space-y-2">
            <Label htmlFor="barcode" className="text-sm font-semibold">
              {t('title.barcode')}
            </Label>
            <Input
              id="barcode"
              maxLength={12}
              {...register('barcode', { 
                required: t('title.barcode_is_required'),
                pattern: {
                  value: /^\d{12}$/,
                  message: t('title.barcode_must_be_exactly_12_digits'),
                }
              })}
              className={errors.barcode ? 'border-destructive focus-visible:ring-destructive/20' : ''}
              placeholder="123456789012"
            />
            {errors.barcode && (
              <p className="text-xs font-medium text-destructive">{errors.barcode.message}</p>
            )}
            {watchBarcode && watchBarcode.length === 12 && /^\d{12}$/.test(watchBarcode) && (
              <div className="mt-2 flex justify-center bg-white p-2 rounded-lg border border-black/5">
                <Barcode value={watchBarcode} height={40} width={1.5} fontSize={14} />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold">
            {t('title.add_to_packages')}
          </Label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 rounded-lg border border-gray-200 p-4">
            {packagesList.map((pkg) => {
              const isChecked = selectedPackages[pkg.id] !== undefined;
              return (
                <div key={pkg.id} className="flex flex-col space-y-2 rounded-lg border p-3 bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`pkg-${pkg.id}`}
                      checked={isChecked}
                      onChange={() => handlePackageToggle(pkg.id)}
                      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                    />
                    <Label htmlFor={`pkg-${pkg.id}`} className="text-sm font-medium cursor-pointer">
                      {typeof pkg.name === 'object' ? (isRtl ? pkg.name?.ar : pkg.name?.en) : pkg.name}
                    </Label>
                  </div>
                  {isChecked && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`qty-${pkg.id}`} className="text-xs text-black/60">
                        {t('title.qty')}
                      </Label>
                      <Input
                        id={`qty-${pkg.id}`}
                        type="number"
                        min="1"
                        value={selectedPackages[pkg.id] || ''}
                        onChange={(e) =>
                          handlePackageQuantityChange(pkg.id, parseInt(e.target.value, 10) || 0)
                        }
                        className="h-8 w-24 text-xs"
                        required
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            {t('title.variant_image')}
          </Label>
          {!imagePreview ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-gray-400">
              <input
                type="file"
                id="images"
                accept="image/*"
                className="hidden"
                {...register('images')}
              />
              <Label htmlFor="images" className="flex cursor-pointer flex-col items-center justify-center gap-2">
                <div className="rounded-full bg-gray-100 p-3">
                  <Upload className="h-6 w-6 text-gray-500" />
                </div>
                <span className="text-sm font-medium text-gray-600">{t('admin.click_to_upload')}</span>
                <span className="text-xs text-gray-400">PNG, JPG, JPEG (Max 5MB)</span>
              </Label>
            </div>
          ) : (
            <div className="mt-4 flex justify-start">
              <div className="group relative aspect-square w-32 rounded-md border overflow-hidden">
                <img src={imagePreview} alt="preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-black/5 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
            disabled={isPending}
          >
            {t('admin.cancel')}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEditMode ? (
              t('title.save_changes')
            ) : (
              t('title.add')
            )}
          </Button>
        </div>
      </form>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md bg-white p-6 text-black text-center">
          <DialogHeader className="flex flex-col items-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <PartyPopper className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              {t('title.added_successfully')}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-black/70">
              {t('title.do_you_want_to_add_another_variant')}
            </p>
          </div>
          <DialogFooter className="flex justify-center gap-3 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/admin/products');
              }}
            >
              {t('title.no_back_to_products')}
            </Button>
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                reset();
                setImagePreview(null);
                setSelectedPackages({});
              }}
            >
              {t('title.yes_add_new_variant')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
