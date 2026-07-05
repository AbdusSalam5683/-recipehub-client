// client/src/app/(dashboard)/user-dashboard/profile/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/auth';
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

    // File size validation (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    // File type validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      setFormData(prev => ({ ...prev, image: event.target.result }));
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
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
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      const response = await userService.updateProfile({
        name: formData.name.trim(),
        image: formData.image,
      });

      if (response.success) {
        toast.success('Profile updated successfully! 🎉');
        setUser(response.user);
        // Update local state with new data
        setFormData({
          name: response.user.name || '',
          image: response.user.image || '',
        });
        setImagePreview(response.user.image || null);
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: user?.name || '',
      image: user?.image || '',
    });
    setImagePreview(user?.image || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Form reset successfully');
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
        {/* Profile Image */}
        <div>
          <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-2">
            Profile Image
          </label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-clay-100 dark:bg-charcoal-700 border-2 border-sage-200 dark:border-sage-800">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt={`${formData.name || 'User'}'s profile`}
                  fill
                  className="object-cover"
                  sizes="96px"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-display text-charcoal-500 dark:text-cream-400">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary text-sm py-1.5 px-4 inline-flex items-center gap-1"
                >
                  <CameraIcon className="h-4 w-4" />
                  Upload
                </button>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="btn-outline text-sm py-1.5 px-4 inline-flex items-center gap-1"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    Remove
                  </button>
                )}
              </div>
              <p className="font-body text-xs text-charcoal-400 dark:text-cream-500">
                Max 2MB • JPG, PNG, GIF
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              aria-label="Upload profile image"
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter your full name"
            required
            disabled={loading}
            maxLength={50}
          />
        </div>

        {/* Email (Read Only) */}
        <div>
          <label htmlFor="email" className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user?.email || ''}
            className="input-field bg-clay-50 dark:bg-charcoal-800 cursor-not-allowed"
            disabled
            readOnly
          />
          <p className="font-body text-xs text-charcoal-400 dark:text-cream-500 mt-1">
            Email cannot be changed
          </p>
        </div>

        {/* Premium Status */}
        <div className="p-4 rounded-xl bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{user?.isPremium ? '⭐' : '🌟'}</span>
            <div className="flex-1">
              <p className="font-body text-sm text-sage-700 dark:text-sage-300">
                {user?.isPremium ? (
                  'You are a Premium Member! Enjoy unlimited recipes and exclusive features.'
                ) : (
                  'Upgrade to Premium for unlimited recipes and exclusive features!'
                )}
              </p>
              {!user?.isPremium && (
                <Link
                  href="/payment/premium"
                  className="btn-primary text-sm py-1.5 px-4 mt-3 inline-block"
                >
                  Upgrade Now
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-outline"
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </form>
    </motion.div>
  );
}