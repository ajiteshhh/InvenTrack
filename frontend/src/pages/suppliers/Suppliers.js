import React, {useMemo, useState} from "react";
import SearchBar from "./SearchBar";
import {useData} from "../../context/DataContext";
import SuppliersGrid from "./SuppliersGrid";
import AddSupplierModal from "./AddSupplierModal";
import PhoneInput from "react-phone-number-input";
import Error from "../../components/Error";
import SupplierDetailsModal from "./SupplierDetailsModal";

const Supplier = () => {
  const { suppliers, categories } = useData();
  const { addNewSupplier, updateExistingSupplier, deleteExistingSupplier } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showSupplierDetails, setShowSupplierDetails] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [error, setError] = useState('');

  const handleEditSupplier = (supplier) => {
    setCurrentSupplier({ ...supplier });
    setShowEditModal(true);
  };
  const handleDeleteSupplier = async (supplier) => {
    await deleteExistingSupplier(supplier.id);
  };
  const handleAddSupplier = async (newSupplier) => {
    if(!newSupplier.name || !newSupplier.address || !newSupplier.phone || !newSupplier.email || newSupplier.category_id === -1) {
      setError("All fields are required");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(newSupplier.email)) {
      setError("Email address is required");
      return;
    }
    await addNewSupplier(newSupplier);
    setShowAddSupplier(false);
  };


  const handleSaveSupplier = async () => {
    if(!currentSupplier.name || !currentSupplier.address || !currentSupplier.phone || !currentSupplier.email || currentSupplier.category_id === -1) {
      setError("All fields are required");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(currentSupplier.email)) {
      setError("Email address is required");
      return;
    }
    await updateExistingSupplier(currentSupplier);
    setShowEditModal(false);
    setCurrentSupplier(null);
  };

  const handleChange = (e) => {
    setError('');
    const { name, value } = e.target;
    setCurrentSupplier((prev) => ({ ...prev, [name]: value }));
  };
  const handlePhoneChange = (value) => {
    setCurrentSupplier((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const filteredSuppliers = useMemo(() => {
    if(!Array.isArray(suppliers) || suppliers.length === 0){
      return [];
    }
    return suppliers.filter((supplier) => {
      const matchesSearchTerm = supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || supplier.status === statusFilter;
      return matchesSearchTerm && matchesStatus;
    });

  }, [suppliers, statusFilter, searchTerm]);

  const handleViewSupplierDetails = (supplier) => {
    setSelectedSupplier(supplier);
    setShowSupplierDetails(true);
  };

  const closeSupplierDetails = () => {
    setShowSupplierDetails(false);
    setSelectedSupplier(null);
  };

  return (
    <section id="supplier_management" className="space-y-6 px-4">
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setShowAddSupplier={setShowAddSupplier}
        setStatusFilter={setStatusFilter}
        statusFilter={statusFilter}
      />

      <SuppliersGrid
        filteredSuppliers={filteredSuppliers}
        handleViewSupplierDetails={handleViewSupplierDetails}
        handleEditSupplier={handleEditSupplier}
        handleDeleteSupplier={handleDeleteSupplier}
        categories={categories}
      />
      {showAddSupplier && (
        <AddSupplierModal
            categories={categories}
          setShowAddSupplier={setShowAddSupplier}
          handleAddSupplier={handleAddSupplier}
          error={error}
          setError={setError}
        />
      )}
      {showSupplierDetails && (
          <SupplierDetailsModal
            closeSupplierDetails={closeSupplierDetails}
            selectedSupplier={selectedSupplier}
          />
      )}

      {showEditModal && currentSupplier && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Edit Supplier</h3>

                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setShowEditModal(false);
                    setError('');
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              {error && (
                <Error error={error} />
            )}
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                        type="text"
                        name="name"
                        value={currentSupplier.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                        required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="category_id"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                        value={currentSupplier.category_id}
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
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                      type="email"
                      name="email"
                      value={currentSupplier.email}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                      required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <PhoneInput
                      placeholder="Enter phone number"
                      value={currentSupplier.phone}
                      onChange={handlePhoneChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    value={currentSupplier.address}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={currentSupplier.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending Review">Pending Review</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end space-x-3">
              <button
                      className="mt-3 sm:mt-0 sm:w-auto sm:text-sm w-24 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={() => {
                        setError('');
                        setShowEditModal(false);

                      }}
              >
                Cancel
              </button>
              <button
                      className="w-40 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleSaveSupplier}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default Supplier;
