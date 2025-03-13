import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Error from "../../components/Error";

const EditProductModal = ({ 
  editProduct, 
  setEditProduct,
  categories 
}) => {
  const [error, setError] = useState('');
  const { updateExistingProduct } = useData();

  const handleChange = (e) => {
    setError('');
    const { name, value } = e.target;

    if (!editProduct.name.trim() || !editProduct.sku.trim() || !editProduct.category_id || editProduct.category_id === -1 || editProduct.quantity_in_stock < 0 || editProduct.price <= 0) {
      setError('All fields are required');
      return;
    }

    let updatedValue = value;

    if (name === 'price' || name === 'quantity_in_stock') {
      updatedValue = parseFloat(value) || 0;
    } else if (name === 'category_id') {
      updatedValue = parseInt(value, 10);
    }

    setEditProduct((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!editProduct.name.trim() || !editProduct.sku.trim() || !editProduct.category_id || editProduct.category_id === -1 || editProduct.quantity_in_stock < 0 || editProduct.price <= 0) {
      setError('All fields are required');
      return;
    }


    await updateExistingProduct(editProduct);
    setEditProduct(false);
  };

  const handleCancel = () => {
    setError('');
    setEditProduct(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Edit Product</h3>
          <Error error={error}/>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                  name="name"
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={editProduct.name}
                  onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">SKU</label>
                <input
                    name="sku"
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={editProduct.sku}
                    onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                    name="category_id"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={editProduct.category_id}
                    onChange={handleChange}
                >
                  <option value={-1} disabled>
                    Select a Category
                  </option>
                  {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                  name="price"
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={editProduct.price}
                  onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                    name="quantity_in_stock"
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={editProduct.quantity_in_stock}
                    onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Low Stock</label>
                <input
                    name="quantity_in_stock"
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={editProduct.low_stock}
                    onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                  name="description"
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={editProduct.description}
                  onChange={handleChange}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
