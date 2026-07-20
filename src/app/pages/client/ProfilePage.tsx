import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/app/store/useAppStore';
import { Button } from '@/app/components/ui/button';
import {
  useProfile, useUpdateProfile, useChangePassword,
  // useAddresses, useAddAddress
} from '@/app/api/client/useProfile';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/app/components/ui/skeleton';

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, logoutUser } = useAppStore();
  const { data: profileData, isLoading } = useProfile();

  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const { mutateAsync: changePassword, isPending: isChangingPassword } = useChangePassword();

  // const { data: addresses, isLoading: isLoadingAddresses } = useAddresses();
  // const { mutateAsync: addAddress, isPending: isAddingAddress } = useAddAddress();

  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', email: '' },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  // const addressForm = useForm<z.infer<typeof addressSchema>>({
  //   resolver: zodResolver(addressSchema),
  //   defaultValues: { name: '', phone: '', city: '', street: '', zip: '' },
  // });

  useEffect(() => {
    if (profileData || user) {
      profileForm.reset({
        name: profileData?.name || profileData?.name || user?.name || '',
        email: profileData?.email || user?.email || '',
      });
    }
  }, [profileData, user, profileForm]);

  const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      await updateProfile(values);
      toast.success(t('profile.update_success', 'Profile updated successfully!'));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    try {
      await changePassword(values);
      toast.success(t('profile.password.success', 'Password changed successfully!'));
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // const onAddressSubmit = async (values: z.infer<typeof addressSchema>) => {
  //   try {
  //     await addAddress(values);
  //     toast.success('Address saved successfully');
  //     addressForm.reset();
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   }
  // };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:px-8 min-h-[60vh]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">{t('header.profile', 'My Account')}</h1>
        <Button variant="destructive" onClick={logoutUser}>
          Logout
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold shrink-0">
            {isLoading ? <Skeleton className="w-16 h-16 rounded-full" /> : (profileData?.name || user.name || 'U')[0].toUpperCase()}
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {isLoading ? <Skeleton className="h-8 w-48" /> : (profileData?.name || user.name)}
            </h2>
            {isLoading ? <Skeleton className="h-4 w-32" /> : <p className="text-muted-foreground">{profileData?.email || user.email}</p>}
          </div>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-6 bg-muted/50 p-1 rounded-xl flex gap-2 flex-wrap h-auto">
          <TabsTrigger value="info" className="flex-1 rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <User size={16} className="me-2" /> {t('profile.tabs.info', 'Profile Info')}
          </TabsTrigger>
          <TabsTrigger value="password" className="flex-1 rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Lock size={16} className="me-2" /> {t('profile.tabs.password', 'Change Password')}
          </TabsTrigger>
          {/* <TabsTrigger value="addresses" className="flex-1 rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <MapPin size={16} className="me-2" /> {t('profile.tabs.addresses', 'Address Manager')}
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="info">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.name', 'Full Name')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.email', 'Email Address')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="h-12 font-bold" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? '...' : t('profile.update_btn', 'Update Profile')}
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>

        <TabsContent value="password">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6 max-w-md">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('profile.password.current', 'Current Password')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showCurrentPassword ? "text" : "password"} {...field} />
                          <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${isRTL ? 'left-3' : 'right-3'}`}>
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('profile.password.new', 'New Password')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showNewPassword ? "text" : "password"} {...field} />
                          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${isRTL ? 'left-3' : 'right-3'}`}>
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('profile.password.confirm', 'Confirm New Password')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showConfirmPassword ? "text" : "password"} {...field} />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${isRTL ? 'left-3' : 'right-3'}`}>
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="h-12 font-bold" disabled={isChangingPassword}>
                  {isChangingPassword ? '...' : t('profile.password.change_btn', 'Change Password')}
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>

        {/* <TabsContent value="addresses">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-xl">{t('profile.addresses.title', 'Your Addresses')}</h3>
              {isLoadingAddresses ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 border border-border rounded-xl bg-card">
                      <div className="flex justify-between mb-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <div className="space-y-2 mt-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : addresses?.length === 0 ? (
                <div className="p-6 border border-dashed border-border rounded-xl text-center text-muted-foreground">
                  {t('profile.addresses.empty', "You haven't saved any addresses yet.")}
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses?.map((address: any) => (
                    <div key={address.id} className="p-4 border border-border rounded-xl bg-card">
                      <div className="font-bold flex justify-between">
                        <span>{address.name}</span>
                        <span className="text-primary cursor-pointer text-sm font-semibold hover:underline">Edit</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2 space-y-1">
                        <p>{address.phone}</p>
                        <p>{address.street}, {address.city} {address.zip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-muted/30 p-6 rounded-2xl border border-border">
              <h3 className="font-bold text-xl mb-4">{t('profile.addresses.add_new', 'Add New Address')}</h3>
              <Form {...addressForm}>
                <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
                  <FormField
                    control={addressForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('profile.addresses.name', 'Full Name')}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('profile.addresses.phone', 'Phone Number')}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={addressForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('profile.addresses.city', 'City')}</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addressForm.control}
                      name="zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('profile.addresses.zip', 'Zip Code')}</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={addressForm.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('profile.addresses.street', 'Street Address')}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 font-bold" disabled={isAddingAddress}>
                    {isAddingAddress ? '...' : t('profile.addresses.save_btn', 'Save Address')}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
