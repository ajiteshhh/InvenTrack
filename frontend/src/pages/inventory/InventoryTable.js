import React, {useState} from 'react';
import AlertDialog from "../../components/AlertDialog";

const InventoryTable = ({
                          currentItems = [],
                          handleSort,
                          handleDeleteProduct,
                          setEditProduct,
                          categories,
                          sortConfig
                        }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <i className="fas fa-sort ml-1 text-gray-400"></i>;
    }
    return sortConfig.direction === 'ascending' ?
        <i className="fas fa-sort-up ml-1 text-primary-500"></i> :
        <i className="fas fa-sort-down ml-1 text-primary-500"></i>;
  };

  return (
      <>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              <tr>
                <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                >
                  Product {renderSortIcon("name")}
                </th>
                <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("sku")}
                >
                  SKU {renderSortIcon("sku")}
                </th>
                <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("category")}
                >
                  Category {renderSortIcon("category")}
                </th>
                <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("quantity_in_stock")}
                >
                  Stock {renderSortIcon("quantity_in_stock")}
                </th>
                <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("price")}
                >
                  Price {renderSortIcon("price")}
                </th>
                <th
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("status")}
                >
                  Status {renderSortIcon("status")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No products available
                    </td>
                  </tr>
              ) : (
                  currentItems.map((item) => {
                    const category = categories.find((cat) => cat.id === item.category_id);
                    const categoryName = category ? category.name : 'Unknown';
                    const status = item.quantity_in_stock > item.low_stock
                        ? "In Stock"
                        : (item.quantity_in_stock === 0)
                            ? 'Out of Stock'
                            : 'Low Stock';

                    return (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sku}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{categoryName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity_in_stock}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            status === "In Stock"
                                ? "bg-green-100 text-green-800"
                                : status === "Low Stock"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                        }`}>
                          {status}
                        </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                                onClick={() => setEditProduct(item)}
                                className="text-primary-600 hover:text-primary-900 mr-3"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                                onClick={() => {
                                  setDeleteProduct(item);
                                  setAlertVisible(true);
                                }}
                                className="text-red-600 hover:text-red-900"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                    )
                  })
              )}
              </tbody>
            </table>
          </div>
        </div>
        {alertVisible && (
            <AlertDialog
                title={`Delete product: ${deleteProduct.name} (${deleteProduct.sku})`}
                message="Are you sure you want to delete this product?"
                type="Delete"
                onConfirm={() => {
                  handleDeleteProduct(deleteProduct.id);
                  setAlertVisible(false);
                }}
                onCancel={() => setAlertVisible(false)}
            />
        )}
      </>
  );
};

export default InventoryTable;