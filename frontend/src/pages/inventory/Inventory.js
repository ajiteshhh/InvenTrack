import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import InventoryTable from './InventoryTable';
import SearchBar from './SearchBar';
import AddCategoryModal from './AddCategoryModal';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import Pagination from "../../components/Pagination";
import { useSearchParams } from "react-router-dom";

const Inventory = () => {
  const [searchParams] = useSearchParams();
  const { products, categories, loading, deleteExistingProduct } = useData();
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('v') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'All Categories');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('filter') || 'All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category_id: -1,
    price: 0,
    quantity_in_stock: 0,
    low_stock: 0,
    description: ''
  });
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const getProductStatus = (product) => {
    return product.quantity_in_stock > product.low_stock
        ? "In Stock"
        : (product.quantity_in_stock === 0)
            ? 'Out of Stock'
            : 'Low Stock';
  };

  const processedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    let result = products.filter((product) => {
      const status = getProductStatus(product);

      const nameMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

      const category = categories.find(cat => cat.id === product.category_id);
      const categoryMatch = categoryFilter === "All Categories" ||
          (category && category.name === categoryFilter);

      const statusMatch = statusFilter === "All Status" ||
          status.toLowerCase() === statusFilter.toLowerCase();

      return nameMatch && categoryMatch && statusMatch;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === "category") {
          const categoryA = categories.find(cat => cat.id === a.category_id);
          const categoryB = categories.find(cat => cat.id === b.category_id);
          const nameA = categoryA ? categoryA.name.toLowerCase() : 'unknown';
          const nameB = categoryB ? categoryB.name.toLowerCase() : 'unknown';

          if (nameA < nameB) return sortConfig.direction === "ascending" ? -1 : 1;
          if (nameA > nameB) return sortConfig.direction === "ascending" ? 1 : -1;
          return 0;
        }

        if (sortConfig.key === "status") {
          const statusA = getProductStatus(a);
          const statusB = getProductStatus(b);

          if (statusA < statusB) return sortConfig.direction === "ascending" ? -1 : 1;
          if (statusA > statusB) return sortConfig.direction === "ascending" ? 1 : -1;
          return 0;
        }

        const numericFields = ['price', 'quantity_in_stock', 'low_stock'];
        if (numericFields.includes(sortConfig.key)) {
          const numA = parseFloat(a[sortConfig.key]);
          const numB = parseFloat(b[sortConfig.key]);

          if (numA < numB) return sortConfig.direction === "ascending" ? -1 : 1;
          if (numA > numB) return sortConfig.direction === "ascending" ? 1 : -1;
          return 0;
        }

        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        if (valueA < valueB) return sortConfig.direction === "ascending" ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [products, categories, searchQuery, categoryFilter, statusFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const handleDeleteProduct = async (id) => {
    await deleteExistingProduct(id);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalItems = processedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = processedProducts.slice(startIndex, endIndex);

  return (
      <section className="space-y-6 px-4">
        <SearchBar
            searchTerm={searchQuery}
            setSearchTerm={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categories={categories}
            setShowAddCategory={setShowAddCategory}
            setShowAddProduct={setShowAddProduct}
            loading={loading}
        />

        <InventoryTable
            currentItems={currentItems}
            handleSort={handleSort}
            setEditProduct={setEditProduct}
            handleDeleteProduct={handleDeleteProduct}
            categories={categories}
            sortConfig={sortConfig}
        />

        {showAddCategory && (
            <AddCategoryModal
                setShowAddCategory={setShowAddCategory}
                categories={categories}
            />
        )}

        {showAddProduct && (
            <AddProductModal
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                categories={categories}
                handleCancel={() => {
                  setShowAddProduct(false);
                  setNewProduct({
                    name: '',
                    sku: '',
                    category_id: -1,
                    price: 0,
                    quantity_in_stock: 0,
                    low_stock: 0,
                    description: ''
                  });
                }}
            />
        )}

        {editProduct && (
            <EditProductModal
                editProduct={editProduct}
                setEditProduct={setEditProduct}
                categories={categories}
            />
        )}

        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            handlePageChange={handlePageChange}
        />
      </section>
  );
};

export default Inventory;