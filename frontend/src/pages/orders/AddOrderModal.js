import React, {useState, useRef, useEffect} from 'react';
import Error from "../../components/Error";

const Combobox = ({
                    options,
                    value,
                    onChange,
                    placeholder,
                    labelKey = 'name',
                    valueKey = 'id'
                  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const comboboxRef = useRef(null);

  useEffect(() => {
    if (value) {
      const selectedOption = options.find(opt => opt[labelKey] === value);
      setSearchTerm(selectedOption ? selectedOption[labelKey] : '');
    } else {
      setSearchTerm('');
    }
  }, [value, options, labelKey]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setIsOpen(true);
    const filtered = options.filter(option =>
        option[labelKey]?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleSelect = (option) => {
    setSearchTerm(option[labelKey]);
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
      <div ref={comboboxRef} className="relative">
        <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            onFocus={() => setIsOpen(true)}
        />
        {isOpen && filteredOptions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredOptions.map(option => (
                  <div
                      key={option[valueKey]}
                      onClick={() => handleSelect(option)}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {option[labelKey]}
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

const AddOrderModal = ({
                         products,
                         customers,
                         suppliers,
                         showAddOrder,
                         setShowAddOrder,
                         placeNewOrder
                       }) => {
  const [newOrder, setNewOrder] = useState({
    type: 'Sales',
    customer_id: null,
    supplier_id: null,
    products: [],
    status: 'Pending',
    name: '',
    email: '',
    phone_number: '',
    address: ''
  });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const productSearchRef = useRef(null);

  const handleCustomerSelect = (customer) => {
    setNewOrder(prev => ({
      ...prev,
      customer_id: customer.id,
      name: customer.name,
      email: customer.email,
      phone_number: customer.phone,
      address: customer.address
    }));
  };

  const handleSupplierSelect = (supplier) => {
    setNewOrder(prev => ({
      ...prev,
      supplier_id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      phone_number: supplier.phone,
      address: supplier.address
    }));
  };

  const handleProductSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const results = products.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(results);
  };

  const addProductToOrder = (product) => {
    const existingProductIndex = newOrder.products.findIndex((p) => p.id === product.id);
    if(product.quantity_in_stock === 0 && newOrder.type === 'Sales') {
      return;
    }
    if (existingProductIndex > -1) {
      const updatedProducts = [...newOrder.products];
      const currentProduct = updatedProducts[existingProductIndex];
      currentProduct.quantity = Math.min(currentProduct.quantity + 1, product.quantity_in_stock);
      setNewOrder((prev) => ({...prev, products: updatedProducts}));
    } else {
      setNewOrder((prev) => ({
        ...prev,
        products: [
          ...prev.products,
          {
            id: product.id,
            name: product.name,
            sku: product.sku,
            price: product.price,
            quantity: 1,
            quantity_in_stock: product.quantity_in_stock,
            total: product.price,
          },
        ],
      }));
    }

    setSearchTerm('');
    setSearchResults([]);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);

    if (quantity <= 0 || isNaN(quantity)) return;

    setNewOrder((prevOrder) => {
      const updatedProducts = prevOrder.products.map((product) => {
        if (product.id === productId) {
          const clampedQuantity =
              prevOrder.type === "Sales"
                  ? Math.min(quantity, product.quantity_in_stock)
                  : quantity;
          return {
            ...product,
            quantity: clampedQuantity,
            total: product.price * clampedQuantity,
          };
        }
        return product;
      });
      return { ...prevOrder, products: updatedProducts };
    });
  };


  const removeProductFromOrder = (productId) => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      products: prevOrder.products.filter((product) => product.id !== productId),
    }));
  };

  const calculateTotal = () => {
    return newOrder.products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
    );
  };

  const handleAddOrder = async () => {
    if(!(newOrder.customer_id || newOrder.supplier_id) || newOrder.products.length < 1) {
        setError('Missing required fields');
        return;
    }
    const orderData = {
      ...newOrder,
      total_amount: calculateTotal(),
      status: 'Pending',
      products: newOrder.products.map(p => ({
        id: p.id,
        quantity: p.quantity,
        price: p.price,
        name: p.name,
        sku: p.sku,
      }))
    };
    await placeNewOrder(orderData);
    setShowAddOrder(false);
  };

  if (!showAddOrder) return null;

  return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
          <h3 className="text-lg font-medium mb-4">Add New Order</h3>
          <Error error={error}/>
          <div className="mb-4">
            <label className="block text-sm font-medium">Order Type</label>
            <select
                value={newOrder.type}
                onChange={(e) =>
                    setNewOrder({...newOrder, type: e.target.value, products: []})
                }
                className="w-full mt-1 rounded-lg border px-3 py-2"
            >
              <option value="Sales">Sales</option>
              <option value="Purchase">Purchase</option>
            </select>
          </div>
          {newOrder.type === 'Sales' && (
              <div className="mb-4">
                <label className="block text-sm font-medium">Customer</label>
                <Combobox
                    options={customers}
                    value={newOrder.customer_id}
                    onChange={handleCustomerSelect}
                    placeholder="Select customer"
                />
              </div>
          )}
          {newOrder.type === 'Purchase' && (
              <div className="mb-4">
                <label className="block text-sm font-medium">Supplier</label>
                <Combobox
                    options={suppliers}
                    value={newOrder.supplier_id}
                    onChange={handleSupplierSelect}
                    placeholder="Select supplier"
                />
              </div>
          )}
          <div ref={productSearchRef} className="mb-4 relative">
            <input
                type="text"
                placeholder="Search products"
                value={searchTerm}
                onChange={handleProductSearch}
                className="w-full px-3 py-2 border rounded-lg"
            />
            {searchResults.length > 0 && (
                <div
                    className="absolute left-0 right-0 bg-white border rounded-lg mt-1 max-h-40 overflow-y-scroll shadow-lg z-50">
                  {searchResults.map((product) => (
                      <div
                          key={product.id}
                          onClick={() => addProductToOrder(product)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between">
                        <span>{product.name}  - {product.sku}</span>
                        <span>{product.quantity_in_stock}</span>
                      </div>
                  ))}
                </div>
            )}
          </div>

          {newOrder.products.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto max-h-72">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {newOrder.products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity_in_stock}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <input
                                  type="number"
                                  className="w-18 rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-white text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                                  value={product.quantity}
                                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                  min="1"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${(product.price * product.quantity).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                            <button
                                className="text-primary-600 hover:text-primary-900 mr-3"
                                onClick={() => removeProductFromOrder(product.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                    ))}
                    </tbody>

                  </table>
                </div>
              </div>
          )}
          <div className="flex justify-end mt-4">
            <button
                onClick={() => setShowAddOrder(false)}
                className="mt-3 sm:text-sm w-24 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
                onClick={handleAddOrder}
                className="w-40 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
            >
              Add Order
            </button>
          </div>
        </div>
      </div>
  );
};

export default AddOrderModal;