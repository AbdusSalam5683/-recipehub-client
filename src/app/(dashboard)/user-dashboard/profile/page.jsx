// client/src/app/(dashboard)/user-dashboard/profile/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { userService } from '../../../../services/auth';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        image: user.image || '',
      });
      setImagePreview(user.image || null);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      setFormData(prev => ({ ...prev, image: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userService.updateProfile(formData);
      if (response.success) {
        toast.success('Profile updated successfully! 🎉');
        // AuthContext আপডেট করুন
        if (setUser) {
          setUser(response.user);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-charcoal-900 dark:text-cream-50">
          My Profile
        </h1>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
          Update your profile information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6 max-w-md">
        <div>
          <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-2">
            Profile Image
          </label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-clay-100 dark:bg-charcoal-700">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary text-sm py-1.5 px-4"
              >
                <CameraIcon className="h-4 w-4" />
                Upload
              </button>
              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="btn-outline text-sm py-1.5 px-4"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        <div>
          <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            className="input-field"
            disabled
          />
          <p className="font-body text-xs text-charcoal-400 dark:text-cream-500 mt-1">
            Email cannot be changed
          </p>
        </div>

        <div className="p-4 rounded-xl bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800">
          <p className="font-body text-sm text-sage-700 dark:text-sage-300">
            {user?.isPremium ? (
              '⭐ You are a Premium Member!'
            ) : (
              '⭐ Upgrade to Premium for unlimited recipes and exclusive features!'
            )}
          </p>
          {!user?.isPremium && (
            <Link
              href="/user-dashboard/premium"
              className="btn-primary text-sm py-1.5 px-4 mt-2 inline-block"
            >
              Upgrade Now
            </Link>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData({ name: user?.name || '', image: user?.image || '' });
              setImagePreview(user?.image || null);
            }}
            className="btn-outline"
          >
            Reset
          </button>
        </div>
      </form>
    </motion.div>
  );
}