import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchSuppliers,
  fetchCategories,
  fetchRecentActivity,
  addCategory,
  fetchProducts,
  fetchCustomers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  addProduct,
  updateProduct,
  deleteProduct,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  fetchOrders,
  placeOrder,
  fetchOrderItems,
  updateStatus,
  updateUserProfile, updateUserPassword, updateUserProfilePicture, updateUserBusinessLogo,
} from './Api';
import {toast} from "sonner";
import {useAuth} from "./AuthContext"; // Import all necessary API functions

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const { login } = useAuth();
  // Fetch Data on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [suppliersData, categoriesData, productsData, customersData, ordersData, recentActivityData] = await Promise.all([
          fetchSuppliers(),
          fetchCategories(),
          fetchProducts(),
          fetchCustomers(),
          fetchOrders(),
          fetchRecentActivity(),
        ]);
        console.log(categoriesData);
        setSuppliers(suppliersData || []);
        setCategories(categoriesData || []);
        setProducts(productsData || []);
        setCustomers(customersData || []);
        setOrders(ordersData || []);
        setRecentActivity(recentActivityData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Suppliers
  const addNewSupplier = async (supplier) => {
    try {
      const newSupplier = await addSupplier(supplier);
      setSuppliers((prev) => [...prev, newSupplier]);
      toast.success("Supplier added successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to add supplier");
    }
  };

  const updateExistingSupplier = async (updatedSupplier) => {
    try {
      const result = await updateSupplier(updatedSupplier);
      setSuppliers((prev) =>
        prev.map((supplier) => (supplier.id === result.id ? result : supplier))
      );
      toast.success("Supplier updated successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to update supplier");
    }
  };

  const deleteExistingSupplier = async (id) => {
    try {
      await deleteSupplier(id);
      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
      toast.success("Supplier deleted successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to delete supplier");
    }
  };

  // Products
  const addNewProduct = async (product) => {
    try {
      const newProduct = await addProduct(product);
      setProducts((prev) => [...prev, newProduct]);
      toast.success("Product added successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to add product");
    }
  };

  const updateExistingProduct = async (updatedProduct) => {
    try {
      const result = await updateProduct(updatedProduct);
      setProducts((prev) =>
        prev.map((product) => (product.id === result.id ? result : product))
      );
      toast.success("Product updated successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to update product");
    }
  };

  const deleteExistingProduct = async (product_id) => {
    try {
      await deleteProduct(product_id);
      setProducts((prev) => prev.filter((product) => product.id !== product_id));
      toast.success("Product deleted successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  // Customers
  const addNewCustomer = async (customer) => {
    try {
      const newCustomer = await addCustomer(customer);
      setCustomers((prev) => [...prev, newCustomer]);
      toast.success("Customer added successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to add customer");
    }
  };

  const updateExistingCustomer = async (updatedCustomer) => {
    try {
      const result = await updateCustomer(updatedCustomer);
      setCustomers((prev) =>
        prev.map((customer) => (customer.id === result.id ? result : customer))
      );
      toast.success("Customer updated successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to update customer");
    }
  };

  const deleteExistingCustomer = async (id) => {
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
      toast.success("Customer deleted successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to delete customer");
    }
  };

    const addNewCategory = async (category) => {
        try {
            const newCategory = await addCategory(category);
            setCategories((prev) => [...prev, newCategory]); // Update state
          toast.success("Category added successfully.");
        } catch (err) {
          toast.error(err.message || "Failed to add category");
        }
    };

    // Order
    const placeNewOrder = async (order) => {
      try {
        const newOrder = await placeOrder(order);
        setOrders((prev) => [...prev, newOrder]);
        toast.success("Order added successfully.");
      } catch (err)  {
          toast.error(err.message || "Failed to place order");
      }
    };
    const getOrderItems = async (orderId) => {
      try {
        return await fetchOrderItems(orderId);
      } catch (err) {
        toast.error(err.message || "Failed to fetch order");
      }
    };
  const updateOrderStatus = async (order) => {
    try {
      const updatedOrder = await updateStatus(order);
      setOrders((prev) =>
          prev.map((existingOrder) =>
              existingOrder.id === order.id ? updatedOrder : existingOrder
          )
      );
      toast.success("Order updated successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  // User
  const updateProfile = async (userProfile) => {
    try {
      const response = await updateUserProfile(userProfile);
      login(response.user);
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    }
  };
  const updateProfilePicture = async (formData) => {
    try {
      const response = await updateUserProfilePicture(formData);
      login(response.user);
    } catch (err) {
      return err;
    }
  };
  const updateBusinessLogo = async (formData) => {
    try {
      const response = await updateUserBusinessLogo(formData);
      login(response.user);
    } catch (err) {
      return err;
    }
  };
  const updatePassword = async (userPassword) => {
    try {
      await updateUserPassword(userPassword);
      toast.success("Password updated successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to update password");
    }
  };
  return (
    <DataContext.Provider
      value={{
        suppliers,
        categories,
        products,
        customers,
        orders,
        recentActivity,
        loading,
        error,
        addNewSupplier,
        updateExistingSupplier,
        deleteExistingSupplier,
        addNewProduct,
        updateExistingProduct,
        deleteExistingProduct,
        addNewCustomer,
        updateExistingCustomer,
        deleteExistingCustomer,
        addNewCategory,
        placeNewOrder,
        getOrderItems,
        updateOrderStatus,
        updateProfile,
        updatePassword,
        updateProfilePicture,
        updateBusinessLogo,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
export const useData = () => useContext(DataContext);