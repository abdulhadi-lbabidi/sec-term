import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Loader2, X, PartyPopper, ChevronDown } from 'lucide-react';
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
import { Popover, PopoverTrigger, PopoverContent } from '../../../../components/ui/popover';
import { Checkbox } from '../../../../components/ui/checkbox';
import { useSizesQuery } from '../../../../api/Admin/sizes';
import { useMaterialsQuery } from '../../../../api/Admin/materials';
import { usePackagesQuery } from '../../../../api/Admin/packages';
import { useCreateProductVariantMutation, useUpdateProductVariantMutation, useProductVariantQuery } from '../../../../api/Admin/products';
import Barcode from 'react-barcode';

interface VariantItem {
  id: string;
  sizeId: string;
  materialId: string;
  price: number;
  discount: number;
  stockQuantity: number;
  sku: string;
  barcode: string;
  selectedPackages: { [key: number]: number };
  imagePreviews: { url: string; file?: File; id?: string | number }[];
}

interface VariantErrors {
  [variantId: string]: {
    sizeId?: string;
    materialId?: string;
    price?: string;
    discount?: string;
    stockQuantity?: string;
    barcode?: string;
    sku?: string;
  };
}

interface MultiSelectProps {
  label: string;
  placeholder: string;
  options: { id: string | number; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

const MultiSelect = ({ label, placeholder, options, selectedValues, onChange }: MultiSelectProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((v) => v !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  const handleSelectAll = () => {
    onChange(options.map((o) => String(o.id)));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const selectedLabels = selectedValues
    .map((val) => options.find((opt) => String(opt.id) === val)?.label)
    .filter(Boolean);

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <Label className="text-sm font-semibold">{label}</Label>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between text-left font-normal border border-black/10 hover:bg-black/5 flex items-center h-10 px-3 py-2"
      >
        <span className="truncate text-start flex-1">
          {selectedValues.length === 0
            ? placeholder
            : selectedLabels.join(', ')}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 opacity-50 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white p-2.5 text-black border border-black/10 shadow-lg rounded-xl z-[999] max-h-72 flex flex-col">
          <div className="flex items-center justify-between border-b pb-1.5 mb-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="text-xs h-7 px-2"
            >
              {t('admin.select_all') || 'Select All'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-xs text-destructive hover:text-destructive h-7 px-2"
            >
              {t('admin.clear_all') || 'Clear All'}
            </Button>
          </div>
          <div className="overflow-y-auto space-y-1 flex-1 max-h-48 pr-1">
            {options.map((opt) => {
              const optIdStr = String(opt.id);
              const isChecked = selectedValues.includes(optIdStr);
              return (
                <div
                  key={opt.id}
                  className="flex items-center space-x-2 rtl:space-x-reverse py-0.5 px-2 rounded-md hover:bg-black/5"
                >
                  <Checkbox
                    id={`multiselect-${label}-${opt.id}`}
                    checked={isChecked}
                    onCheckedChange={() => handleToggle(optIdStr)}
                  />
                  <Label
                    htmlFor={`multiselect-${label}-${opt.id}`}
                    className="text-sm font-medium cursor-pointer flex-1 select-none py-0.5"
                  >
                    {opt.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

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

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [generatedVariants, setGeneratedVariants] = useState<VariantItem[]>([]);
  const [validationErrors, setValidationErrors] = useState<VariantErrors>({});
  const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isEditMode && variantData?.data && !isLoaded) {
      const vData = variantData.data;
      const pkgs: { [key: number]: number } = {};
      if (vData.packages) {
        vData.packages.forEach((p: any) => {
          pkgs[p.id || p.package_id] = p.quantity || p.pivot?.quantity || 1;
        });
      }
      const initialImages = vData.product_all_images && vData.product_all_images.length > 0
        ? vData.product_all_images.map((item: any) => ({ url: item.url || item.image, id: item.id }))
        : (vData.images && vData.images.length > 0
            ? vData.images.map((url: string) => ({ url }))
            : (vData.image ? [{ url: vData.image }] : []));

      setGeneratedVariants([
        {
          id: String(vData.id),
          sizeId: String(vData.current_size?.id || vData.size_id || ''),
          materialId: String(vData.current_material?.id || vData.material_id || ''),
          price: vData.price || 0,
          discount: vData.discount || vData.discaount || 0,
          stockQuantity: vData.stock_quantity || 0,
          sku: vData.sku || '',
          barcode: vData.barcode || '',
          selectedPackages: pkgs,
          imagePreviews: initialImages,
        },
      ]);
      setDeletedMediaIds([]);
      setIsLoaded(true);
    }
  }, [isEditMode, variantData, isLoaded]);

  const handleGenerateVariants = () => {
    if (selectedSizes.length === 0 || selectedMaterials.length === 0) return;
    const newVariants: VariantItem[] = [];
    selectedSizes.forEach((sizeId) => {
      selectedMaterials.forEach((materialId) => {
        newVariants.push({
          id: Math.random().toString(36).substring(2, 9),
          sizeId,
          materialId,
          price: 0,
          discount: 0,
          stockQuantity: 0,
          sku: '',
          barcode: '',
          selectedPackages: {},
          imagePreviews: [],
        });
      });
    });
    setGeneratedVariants(newVariants);
    setValidationErrors({});
  };

  const updateVariantField = (id: string, field: keyof VariantItem, value: any) => {
    setGeneratedVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
    setValidationErrors((prev) => {
      if (prev[id] && prev[id][field as keyof VariantErrors[string]]) {
        const copy = { ...prev };
        const itemErrors = { ...copy[id] };
        delete itemErrors[field as keyof VariantErrors[string]];
        if (Object.keys(itemErrors).length === 0) {
          delete copy[id];
        } else {
          copy[id] = itemErrors;
        }
        return copy;
      }
      return prev;
    });
  };

  const handleImageChange = (id: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const filesArray = Array.from(files);
    const validFiles = filesArray.filter((file) => file.size <= MAX_FILE_SIZE);

    if (filesArray.length > validFiles.length) {
      alert(t('admin.image_size_error'));
    }

    if (validFiles.length === 0) return;

    const urls = validFiles.map((file) => URL.createObjectURL(file));
    const newPreviews = validFiles.map((file, i) => ({
      url: urls[i],
      file,
    }));

    setGeneratedVariants((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const filteredPrev = v.imagePreviews.filter(
            (existingItem) =>
              !validFiles.some((newFile) => newFile.name === (existingItem.file?.name || existingItem.url.split('/').pop()))
          );
          return { ...v, imagePreviews: [...filteredPrev, ...newPreviews] };
        }
        return v;
      })
    );
  };

  const handleRemoveImage = (variantIdStr: string, index: number) => {
    setGeneratedVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantIdStr) {
          const itemToRemove = v.imagePreviews[index];
          if (itemToRemove && isEditMode) {
            if (itemToRemove.id) {
              setDeletedMediaIds((prevIds) => [...prevIds, String(itemToRemove.id)]);
            } else {
              const originalImages = variantData?.data?.product_all_images || [];
              const getFilename = (url: string) => url.split('/').pop() || url;
              const foundObj = originalImages.find(
                (item: any) => getFilename(item.url || item.image) === getFilename(itemToRemove.url)
              );
              if (foundObj) {
                setDeletedMediaIds((prevIds) => [...prevIds, String(foundObj.id)]);
              } else {
                const legacyImages = variantData?.data?.images || (variantData?.data?.image ? [variantData.data.image] : []);
                const legacyIndex = legacyImages.findIndex(
                  (imgUrl: string) => getFilename(imgUrl) === getFilename(itemToRemove.url)
                );
                if (legacyIndex !== -1) {
                  setDeletedMediaIds((prevIds) => [...prevIds, String(legacyIndex + 1)]);
                }
              }
            }
          }
          return { ...v, imagePreviews: v.imagePreviews.filter((_, i) => i !== index) };
        }
        return v;
      })
    );
  };

  const handleVariantPackageToggle = (variantIdStr: string, packageId: number) => {
    setGeneratedVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantIdStr) {
          const copy = { ...v.selectedPackages };
          if (copy[packageId] !== undefined) {
            delete copy[packageId];
          } else {
            copy[packageId] = 1;
          }
          return { ...v, selectedPackages: copy };
        }
        return v;
      })
    );
  };

  const handleVariantPackageQtyChange = (variantIdStr: string, packageId: number, qty: number) => {
    setGeneratedVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantIdStr) {
          return {
            ...v,
            selectedPackages: {
              ...v.selectedPackages,
              [packageId]: qty,
            },
          };
        }
        return v;
      })
    );
  };

  const handleRemoveVariant = (id: string) => {
    setGeneratedVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const validateVariants = (): boolean => {
    const newErrors: VariantErrors = {};
    let isValid = true;

    generatedVariants.forEach((v) => {
      const itemErrors: any = {};
      if (!v.sizeId) {
        itemErrors.sizeId = t('admin.required_field');
        isValid = false;
      }
      if (!v.materialId) {
        itemErrors.materialId = t('admin.required_field');
        isValid = false;
      }
      if (v.price === undefined || v.price === null || String(v.price).trim() === '' || Number(v.price) < 0) {
        itemErrors.price = t('admin.required_field');
        isValid = false;
      }
      if (v.discount !== undefined && v.discount !== null && Number(v.discount) < 0) {
        itemErrors.discount = t('admin.required_field');
        isValid = false;
      }
      if (v.stockQuantity === undefined || v.stockQuantity === null || String(v.stockQuantity).trim() === '' || Number(v.stockQuantity) < 0) {
        itemErrors.stockQuantity = t('admin.required_field');
        isValid = false;
      }
      if (!v.barcode) {
        itemErrors.barcode = t('admin.barcode_is_required');
        isValid = false;
      } else if (!/^\d{12}$/.test(v.barcode)) {
        itemErrors.barcode = t('admin.barcode_must_be_exactly_12_digits');
        isValid = false;
      }

      if (Object.keys(itemErrors).length > 0) {
        newErrors[v.id] = itemErrors;
      }
    });

    setValidationErrors(newErrors);
    return isValid;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId && !isEditMode) return;
    if (generatedVariants.length === 0) return;

    if (!validateVariants()) {
      return;
    }

    const formData = new FormData();

    if (isEditMode && variantId) {
      const v = generatedVariants[0];
      formData.append('_method', 'PUT');
      formData.append('variants[0][id]', String(variantId));
      formData.append('variants[0][size_id]', v.sizeId);
      formData.append('variants[0][material_id]', v.materialId);
      formData.append('variants[0][price]', String(v.price));
      formData.append('variants[0][discount]', String(v.discount));
      formData.append('variants[0][discaount]', String(v.discount));
      formData.append('variants[0][stock_quantity]', String(v.stockQuantity));
      if (v.sku) formData.append('variants[0][sku]', v.sku);
      if (v.barcode) formData.append('variants[0][barcode]', v.barcode);

      const packageEntries = Object.entries(v.selectedPackages);
      packageEntries.forEach(([pkgId, qty], index) => {
        formData.append(`variants[0][packages][${index}][package_id]`, pkgId);
        formData.append(`variants[0][packages][${index}][quantity]`, String(qty));
      });

      const filesToUpload = v.imagePreviews
        .map((item) => item.file)
        .filter((file): file is File => !!file);

      filesToUpload.forEach((file, index) => {
        formData.append(`variants[0][images][${index}]`, file);
      });

      if (deletedMediaIds.length > 0) {
        deletedMediaIds.forEach((id, index) => {
          formData.append(`variants[0][deleted_media_ids][${index}]`, id);
        });
      }

      updateVariantMutation.mutate(formData, {
        onSuccess: () => {
          navigate('/admin/products');
        },
      });
    } else {
      if (productId) formData.append('product_id', productId);

      generatedVariants.forEach((v, index) => {
        formData.append(`variants[${index}][size_id]`, v.sizeId);
        formData.append(`variants[${index}][material_id]`, v.materialId);
        formData.append(`variants[${index}][price]`, String(v.price));
        formData.append(`variants[${index}][discount]`, String(v.discount));
        formData.append(`variants[${index}][discaount]`, String(v.discount));
        formData.append(`variants[${index}][stock_quantity]`, String(v.stockQuantity));
        if (v.sku) formData.append(`variants[${index}][sku]`, v.sku);
        if (v.barcode) formData.append(`variants[${index}][barcode]`, v.barcode);

        const packageEntries = Object.entries(v.selectedPackages);
        packageEntries.forEach(([pkgId, qty], pkgIndex) => {
          formData.append(`variants[${index}][packages][${pkgIndex}][package_id]`, pkgId);
          formData.append(`variants[${index}][packages][${pkgIndex}][quantity]`, String(qty));
        });

        const filesToUpload = v.imagePreviews
          .map((item) => item.file)
          .filter((file): file is File => !!file);

        filesToUpload.forEach((file, fileIndex) => {
          formData.append(`variants[${index}][images][${fileIndex}]`, file);
        });
      });

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

  if (isLoadingSizes || isLoadingMaterials || isLoadingPackages || (isEditMode && isLoadingVariant && !isLoaded)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black/45" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!isEditMode && (
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-black">
          <h2 className="text-lg font-bold mb-4">{t('admin.generate_variants')}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <MultiSelect
              label={t('admin.sizes')}
              placeholder={t('admin.select_sizes')}
              options={sizes.map((sz) => ({ id: sz.id, label: sz.size }))}
              selectedValues={selectedSizes}
              onChange={setSelectedSizes}
            />
            <MultiSelect
              label={t('admin.materials')}
              placeholder={t('admin.select_materials')}
              options={materials.map((mat) => ({ id: mat.id, label: mat.material }))}
              selectedValues={selectedMaterials}
              onChange={setSelectedMaterials}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              onClick={handleGenerateVariants}
              disabled={selectedSizes.length === 0 || selectedMaterials.length === 0}
            >
              {t('admin.generate_products')}
            </Button>
          </div>
        </div>
      )}

      {generatedVariants.length === 0 && !isEditMode && (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-black/10 rounded-2xl bg-white text-center">
          <p className="text-black/60 mb-2">
            {t('admin.no_variants_generated')}
          </p>
          <p className="text-xs text-black/40">
            {t('admin.select_sizes_materials_to_generate')}
          </p>
        </div>
      )}

      {generatedVariants.length > 0 && (
        <form onSubmit={handleSubmitForm} className="space-y-6">
          <div className="space-y-6">
            {generatedVariants.map((v, index) => {
              const errors = validationErrors[v.id] || {};
              return (
                <div key={v.id} className="rounded-2xl border border-black/10 bg-white p-6 text-black space-y-6 relative">
                  {!isEditMode && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(v.id)}
                      className="absolute top-4 right-4 text-destructive hover:text-destructive/80 p-1 rounded-full hover:bg-red-50 cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}

                  <h3 className="text-md font-bold border-b pb-2 mb-4">
                    {t('admin.variant')} #{index + 1}
                  </h3>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        {t('admin.size')} *
                      </Label>
                      <Select
                        value={v.sizeId}
                        onValueChange={(val) => updateVariantField(v.id, 'sizeId', val)}
                      >
                        <SelectTrigger className={errors.sizeId ? 'border-destructive focus-visible:ring-destructive/20' : ''}>
                          <SelectValue placeholder={t('admin.select_size')} />
                        </SelectTrigger>
                        <SelectContent>
                          {sizes.map((sz) => (
                            <SelectItem key={sz.id} value={String(sz.id)}>
                              {sz.size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.sizeId && (
                        <p className="text-xs font-medium text-destructive">{errors.sizeId}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        {t('admin.material')} *
                      </Label>
                      <Select
                        value={v.materialId}
                        onValueChange={(val) => updateVariantField(v.id, 'materialId', val)}
                      >
                        <SelectTrigger className={errors.materialId ? 'border-destructive focus-visible:ring-destructive/20' : ''}>
                          <SelectValue placeholder={t('admin.select_material')} />
                        </SelectTrigger>
                        <SelectContent>
                          {materials.map((mat) => (
                            <SelectItem key={mat.id} value={String(mat.id)}>
                              {mat.material}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.materialId && (
                        <p className="text-xs font-medium text-destructive">{errors.materialId}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        {t('admin.price')} *
                      </Label>
                      <Input
                        type="number"
                        value={v.price === 0 ? '' : v.price}
                        onChange={(e) => updateVariantField(v.id, 'price', e.target.value === '' ? 0 : Number(e.target.value))}
                        className={errors.price ? 'border-destructive focus-visible:ring-destructive/20' : ''}
                      />
                      {errors.price && (
                        <p className="text-xs font-medium text-destructive">{errors.price}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        {t('admin.discount')}
                      </Label>
                      <Input
                        type="number"
                        value={v.discount === 0 ? '' : v.discount}
                        onChange={(e) => updateVariantField(v.id, 'discount', e.target.value === '' ? 0 : Number(e.target.value))}
                        className={errors.discount ? 'border-destructive focus-visible:ring-destructive/20' : ''}
                      />
                      {errors.discount && (
                        <p className="text-xs font-medium text-destructive">{errors.discount}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        {t('admin.stock')} *
                      </Label>
                      <Input
                        type="number"
                        value={v.stockQuantity === 0 ? '' : v.stockQuantity}
                        onChange={(e) => updateVariantField(v.id, 'stockQuantity', e.target.value === '' ? 0 : Number(e.target.value))}
                        className={errors.stockQuantity ? 'border-destructive focus-visible:ring-destructive/20' : ''}
                      />
                      {errors.stockQuantity && (
                        <p className="text-xs font-medium text-destructive">{errors.stockQuantity}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        {t('admin.sku')}
                      </Label>
                      <Input
                        value={v.sku}
                        onChange={(e) => updateVariantField(v.id, 'sku', e.target.value)}
                        className={errors.sku ? 'border-destructive focus-visible:ring-destructive/20' : ''}
                      />
                      {errors.sku && (
                        <p className="text-xs font-medium text-destructive">{errors.sku}</p>
                      )}
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        {t('admin.barcode')}
                      </Label>
                      <Input
                        maxLength={12}
                        value={v.barcode}
                        onChange={(e) => updateVariantField(v.id, 'barcode', e.target.value)}
                        className={errors.barcode ? 'border-destructive focus-visible:ring-destructive/20' : ''}
                        placeholder="123456789012"
                      />
                      {errors.barcode && (
                        <p className="text-xs font-medium text-destructive">{errors.barcode}</p>
                      )}
                      {v.barcode && v.barcode.length === 12 && /^\d{12}$/.test(v.barcode) && (
                        <div className="mt-2 flex justify-center bg-white p-2 rounded-lg border border-black/5">
                          <Barcode value={v.barcode} height={40} width={1.5} fontSize={14} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">
                      {t('admin.add_to_packages')}
                    </Label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 rounded-lg border border-gray-200 p-4">
                      {packagesList.map((pkg) => {
                        const isChecked = v.selectedPackages[pkg.id] !== undefined;
                        return (
                          <div key={pkg.id} className="flex flex-col space-y-2 rounded-lg border p-3 bg-gray-50/50">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`pkg-${v.id}-${pkg.id}`}
                                checked={isChecked}
                                onChange={() => handleVariantPackageToggle(v.id, pkg.id)}
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                              />
                              <Label htmlFor={`pkg-${v.id}-${pkg.id}`} className="text-sm font-medium cursor-pointer">
                                {typeof pkg.name === 'object' ? (isRtl ? pkg.name?.ar : pkg.name?.en) : pkg.name}
                              </Label>
                            </div>
                            {isChecked && (
                              <div className="flex items-center gap-2">
                                <Label htmlFor={`qty-${v.id}-${pkg.id}`} className="text-xs text-black/60">
                                  {t('admin.qty')}
                                </Label>
                                <Input
                                  id={`qty-${v.id}-${pkg.id}`}
                                  type="number"
                                  min="1"
                                  value={v.selectedPackages[pkg.id] || ''}
                                  onChange={(e) =>
                                    handleVariantPackageQtyChange(v.id, pkg.id, parseInt(e.target.value, 10) || 0)
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
                      {t('admin.variant_image')}
                    </Label>
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-gray-400">
                      <input
                        type="file"
                        id={`images-${v.id}`}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(v.id, e.target.files)}
                        multiple
                      />
                      <Label htmlFor={`images-${v.id}`} className="flex cursor-pointer flex-col items-center justify-center gap-2">
                        <div className="rounded-full bg-gray-100 p-3">
                          <Upload className="h-6 w-6 text-gray-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">{t('admin.click_to_upload')}</span>
                        <span className="text-xs text-gray-400">PNG, JPG, JPEG (Max 10MB)</span>
                      </Label>
                    </div>

                    {v.imagePreviews && v.imagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 gap-4">
                        {v.imagePreviews.map((item, imgIndex) => (
                          <div key={imgIndex} className="group relative aspect-square rounded-md border overflow-hidden">
                            <img src={item.url} alt="preview" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(v.id, imgIndex)}
                              className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
                t('admin.save_changes')
              ) : (
                t('admin.add')
              )}
            </Button>
          </div>
        </form>
      )}

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md bg-white p-6 text-black text-center">
          <DialogHeader className="flex flex-col items-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <PartyPopper className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              {t('admin.added_successfully')}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-black/70">
              {t('admin.do_you_want_to_add_another_variant')}
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
              {t('admin.no_back_to_products')}
            </Button>
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                setGeneratedVariants([]);
                setSelectedSizes([]);
                setSelectedMaterials([]);
                setDeletedMediaIds([]);
              }}
            >
              {t('admin.yes_add_new_variant')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
