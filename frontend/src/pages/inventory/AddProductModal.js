import React, {useState} from 'react';
import { useData } from '../../context/DataContext';
import Error from '../../components/Error';
const AddProductModal = ({
                           newProduct,
                           setNewProduct,
                           categories,
                           handleCancel,
                         }) => {
  const { addNewProduct } = useData();
  const [error, setError] = useState('');
  const handleAddProduct = async () => {
    if(!newProduct.name || !newProduct.sku || newProduct.category_id === -1) {
      setError("All fields are required");
      return;
    }
    await addNewProduct(newProduct);
    handleCancel();
  };

  const handleNumberChange = (e, field, isFloat = false) => {
    const value = e.target.value;

    if (value === '') {
      setNewProduct({...newProduct, [field]: ''});
      return;
    }

    const numValue = isFloat ? parseFloat(value) : parseInt(value);

    if (!isNaN(numValue) && numValue >= 0) {
      setNewProduct({...newProduct, [field]: numValue});
    }
  };

  return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">​</span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Product</h3>
              <Error error={error}/>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                      type="text"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SKU</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                        placeholder="SKU"
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="category_id"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                        value={newProduct.category_id}
                        onChange={(e) =>
                            setNewProduct({...newProduct, category_id: parseInt(e.target.value)})
                        }
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
                      type="number"
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                      placeholder="Price"
                      value={newProduct.price}
                      onChange={(e) => handleNumberChange(e, 'price', true)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                        type="number"
                        min="0"
                        step="1"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                        placeholder="Stock"
                        value={newProduct.quantity_in_stock}
                        onChange={(e) => handleNumberChange(e, 'quantity_in_stock')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Low Stock</label>
                    <input
                        type="number"
                        min="0"
                        step="1"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                        placeholder="Stock"
                        value={newProduct.low_stock}
                        onChange={(e) => handleNumberChange(e, 'low_stock')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                      rows="3"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                      placeholder="Description"
                      value={newProduct.description}
                      onChange={(e) =>
                          setNewProduct({...newProduct, description: e.target.value})
                      }
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                  type="button"
                  onClick={handleAddProduct}
                  className="w-40 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Add Product
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

export default AddProductModal;