// client/src/components/recipes/RecipeForm.jsx (Image Upload Part)
'use client';

import { useState } from 'react';
import Image from 'next/image';

const RecipeForm = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = '';

      // Convert image to base64
      if (imageFile) {
        const reader = new FileReader();
        const base64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(imageFile);
        });

        // Send base64 to server
        const formData = {
          recipeName,
          category,
          cuisineType,
          difficultyLevel,
          preparationTime,
          ingredients,
          instructions,
          recipeImage: base64 // imgBB upload will happen on server
        };

        const response = await recipeService.create(formData);
        // ... handle response
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Recipe Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
        />
        {imagePreview && (
          <div className="mt-2 relative h-48 w-full rounded-lg overflow-hidden">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Submit Recipe'}
      </button>
    </div>
  );
};

export default RecipeForm;