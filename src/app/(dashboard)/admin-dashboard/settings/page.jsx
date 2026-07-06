// client/src/app/(dashboard)/admin-dashboard/settings/page.jsx
'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../contexts/AuthContext';
import { userService } from '../../../../services/auth';
import {
  ShieldCheckIcon,
  BellIcon,
  UserCircleIcon,
  KeyIcon,
  GlobeAltIcon,
  CameraIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function AdminSettings() {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.image || null);
  const [imageFile, setImageFile] = useState(null);
  const [settings, setSettings] = useState({
    name: user?.name || '',
    notifications: true,
    darkMode: false,
    language: 'en',
  });

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.checked });
  };

  // ✅ Profile Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ✅ Save Settings with Profile Image
  const handleSave = async () => {
    setLoading(true);
    try {
      let imageToSend = imagePreview;

      // If new image uploaded, convert to base64
      if (imageFile) {
        const reader = new FileReader();
        imageToSend = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(imageFile);
        });
      }

      const profileData = {
        name: settings.name,
        image: imageToSend || user?.image,
      };

      const response = await userService.updateProfile(profileData);
      if (response.success) {
        if (setUser) {
          setUser(response.user);
        }
        toast.success('Profile updated successfully! 🎉');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const userAvatar = user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=random&size=120`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-charcoal-900 dark:text-cream-50">
          Admin Settings
        </h1>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
          Manage your admin preferences and profile
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ✅ Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50 mb-4">
              Profile Picture
            </h2>
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="relative h-32 w-32 rounded-full overflow-hidden ring-4 ring-paprika-500/20 dark:ring-turmeric-500/20">
                  <Image
                    src={imagePreview || userAvatar}
                    alt={user?.name || 'Admin'}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-paprika-500 text-cream-50 rounded-full hover:bg-paprika-600 transition-colors shadow-lg"
                >
                  <CameraIcon className="h-5 w-5" />
                </button>
                {imagePreview && imagePreview !== user?.image && (
                  <button
                    onClick={removeImage}
                    className="absolute top-0 right-0 p-1.5 bg-rose-500 text-cream-50 rounded-full hover:bg-rose-600 transition-colors shadow-lg"
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
              <p className="text-xs text-charcoal-400 dark:text-cream-500 mt-3 text-center">
                Click the camera icon to change<br />Max size: 2MB
              </p>
              {imagePreview && imagePreview !== user?.image && (
                <span className="text-xs text-sage-500 dark:text-sage-400 mt-2">
                  ✨ New image ready to save
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <UserCircleIcon className="h-6 w-6 text-paprika-500" />
              <h2 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50">
                Profile
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={settings.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  className="input-field bg-clay-50 dark:bg-charcoal-700/50 cursor-not-allowed"
                  disabled
                />
                <p className="text-xs text-charcoal-400 dark:text-cream-500 mt-1">
                  Email cannot be changed
                </p>
              </div>
              <div>
                <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
                  Role
                </label>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-paprika-50 dark:bg-paprika-900/20 text-paprika-600 dark:text-paprika-400 text-sm font-medium">
                  <ShieldCheckIcon className="h-4 w-4" />
                  Administrator
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheckIcon className="h-6 w-6 text-sage-500" />
              <h2 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50">
                Security
              </h2>
            </div>
            <div className="space-y-4">
              <button className="btn-secondary w-full">
                Change Password
              </button>
              <button className="btn-outline w-full">
                Two-Factor Authentication
              </button>
              <div className="p-3 rounded-xl bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800">
                <p className="text-xs text-sage-700 dark:text-sage-300 flex items-center gap-2">
                  <ShieldCheckIcon className="h-4 w-4" />
                  Your account is protected
                </p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <BellIcon className="h-6 w-6 text-turmeric-500" />
              <h2 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50">
                Notifications
              </h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-body text-charcoal-700 dark:text-cream-200">Email Notifications</span>
                <input
                  type="checkbox"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 rounded border-clay-300 text-paprika-500 focus:ring-paprika-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-body text-charcoal-700 dark:text-cream-200">Report Alerts</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-clay-300 text-paprika-500 focus:ring-paprika-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-body text-charcoal-700 dark:text-cream-200">New User Notifications</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-clay-300 text-paprika-500 focus:ring-paprika-500"
                />
              </label>
            </div>
          </div>

          {/* Preferences */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <GlobeAltIcon className="h-6 w-6 text-clay-500" />
              <h2 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50">
                Preferences
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
                  Language
                </label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="en">English</option>
                  <option value="bn">বাংলা</option>
                </select>
              </div>
              <div>
                <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
                  Timezone
                </label>
                <select className="input-field">
                  <option value="utc">UTC</option>
                  <option value="asia/dhaka">Asia/Dhaka</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary flex-1 md:flex-none md:min-w-[200px]"
        >
          {loading ? 'Saving...' : 'Save All Changes'}
        </button>
        <button
          onClick={() => {
            setSettings({
              name: user?.name || '',
              notifications: true,
              darkMode: false,
              language: 'en',
            });
            setImagePreview(user?.image || null);
            setImageFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
          className="btn-outline"
        >
          Reset
        </button>
      </div>
    </motion.div>
  );
}