import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Error from '../../components/Error';
const AddCategoryModal = ({ setShowAddCategory, categories }) => {
  const { addNewCategory } = useData();
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  const handleAddCategory = async () => {
    setError('');
    if (!newCategory.trim()) {
      setError('Category name cannot be empty');
      return;
    }
    if (categories.find((cat) => cat.name === newCategory.trim())) {
      setError('Category already exists');
      return;
    }
    try {
      await addNewCategory(newCategory);
    } catch (err) {
      setError(err.message || 'Failed to add category');
    }
    setNewCategory('');
    setShowAddCategory(false);
  };

  const handleCancel = () => {
    setNewCategory('');
    setError('');
    setShowAddCategory(false);
  };

  return (
     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen">​</span>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Create New Category</h3>
            <Error error={error} />
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Category Name"
                value={newCategory}
                onChange={(e) => { 
                  setNewCategory(e.target.value);
                  setError('');
                }}
              />
            </div>
          </form>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleAddCategory}
            className="w-40 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Create Category
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="mt-3 sm:mt-0 sm:w-auto sm:text-sm w-24 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default AddCategoryModal;
