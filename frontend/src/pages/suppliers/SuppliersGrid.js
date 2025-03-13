import React, { useState } from "react";
import AlertDialog from "../../components/AlertDialog";

const SuppliersGrid = ({ filteredSuppliers, handleEditSupplier, handleViewSupplierDetails, handleDeleteSupplier, categories }) => {
    const [alertVisible, setAlertVisible] = useState(false);
    const [deleteSupplier, setDeleteSupplier] = useState(null);
    return (
        <>
            {filteredSuppliers.length === 0 ? (
            <div className="text-center w-full text-gray-500 text-lg">No suppliers found.</div>
            ) :(
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSuppliers.map((supplier) => (
                    <div key={supplier.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center">
                                    <img className="w-12 h-12 rounded-lg" src={`https://avatar.iran.liara.run/public/${supplier.id}`} alt="Supplier" />
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">{supplier.name}</h3>
                                        <p className="text-sm text-gray-500">{supplier.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        supplier.status === "Active"
                                            ? "bg-green-100 text-green-800"
                                            : supplier.status === "Pending Review"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                    }`}>
                                      {supplier.status}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                    <i className="fas fa-envelope w-5"></i>
                                    <span>{supplier.email}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <i className="fas fa-phone w-5"></i>
                                    <span>{supplier.phone}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <i className="fas fa-map-marker-alt w-5"></i>
                                    <span>{supplier.address}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-gray-800 bg-gray-100">{categories.find((cat) => cat.id === supplier.category_id).name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleViewSupplierDetails(supplier)}
                                        className="p-2 text-primary-600 hover:text-primary-700 rounded-lg hover:bg-primary-50"
                                    >
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button
                                        onClick={() => handleEditSupplier(supplier)}
                                        className="p-2 text-primary-600 hover:text-primary-700 rounded-lg hover:bg-primary-50"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button onClick={() => {
                                        setDeleteSupplier(supplier);
                                        setAlertVisible(true);
                                    }} className="p-2 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>)}
            {alertVisible && (
                <AlertDialog
                    title="Delete Supplier"
                    message="Are you sure you want to delete this supplier?"
                    type="Delete"
                    onConfirm={() => {
                        handleDeleteSupplier(deleteSupplier);
                        setAlertVisible(false);
                    }}
                    onCancel={() => setAlertVisible(false)}
                />)
            }
         </>
    );
};

export default SuppliersGrid;
