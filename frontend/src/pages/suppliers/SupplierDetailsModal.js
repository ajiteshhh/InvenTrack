import React from 'react';
import {useNavigate} from "react-router-dom";
const SupplierDetailsModal = ({ closeSupplierDetails, selectedSupplier }) => {
    const navigate = useNavigate();
    const formatDate = (date) => {
        if (!date) return 'N/A';
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return 'Invalid date';
        }

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit'
        }).format(parsedDate);
    };
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Supplier Details</h3>
                        <button onClick={closeSupplierDetails} className="text-gray-400 hover:text-gray-500">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <img src={`https://avatar.iran.liara.run/public/${selectedSupplier.id}`} alt="Supplier Logo" className="w-16 h-16 rounded-lg"/>
                            <div className="ml-4">
                                <h4 className="text-xl font-medium">{selectedSupplier.name}</h4>
                                <p className="text-gray-500">{selectedSupplier.category}</p>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    selectedSupplier.status === "Active"
                                        ? "bg-green-100 text-green-800"
                                        : selectedSupplier.status === "Pending Review"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                }`}>
                                  {selectedSupplier.status}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h5>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex items-center text-sm">
                                    <i className="fas fa-envelope w-5 text-gray-400"></i>
                                    <span>{selectedSupplier.email}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <i className="fas fa-phone w-5 text-gray-400"></i>
                                    <span>{selectedSupplier.phone}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <i className="fas fa-map-marker-alt w-5 text-gray-400"></i>
                                    <span>{selectedSupplier.address}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Orders</h5>
                            <div className="border rounded-lg divide-y">
                                <div className="p-4 flex items-center justify-between">
                                    {!selectedSupplier.latest_order_id ? (
                                        <div className="text-sm text-gray-500">No orders available</div>
                                    ) : (
                                        <>
                                            <div>
                                                <div
                                                    className="text-sm font-medium">#{selectedSupplier.latest_order_id}</div>
                                                <div
                                                    className="text-sm text-gray-500">{formatDate(selectedSupplier.latest_order_date)}</div>
                                            </div>
                                            <div className="text-right">
                                                <div
                                                    className="text-sm font-medium">${selectedSupplier.latest_total_amount}</div>
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        selectedSupplier.latest_status === "Completed"
                                                            ? "bg-green-100 text-green-800"
                                                            : selectedSupplier.latest_status === "Pending"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-red-100 text-red-800"
                                                    }`}>
                                      {selectedSupplier.latest_status}
                                  </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end space-x-3">
                    <button
                        className="mt-3 sm:mt-0 sm:w-auto sm:text-sm w-24 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        onClick={() => {
                            navigate('/suppliers/details', {state: {id: selectedSupplier.id}});
                        }}>
                        Export History
                    </button>
                    <a href={`mailto:${selectedSupplier.email}`}>
                        <button
                            className="w-40 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Contact Supplier
                        </button>
                    </a>

                </div>
            </div>
        </div>
    );
};

export default SupplierDetailsModal;