import React, { useState } from 'react';
import {useData} from "../../context/DataContext";
import {generateInvoice} from "./Invoice";
import {toast} from "sonner";
import {useAuth} from "../../context/AuthContext";

const ViewOrderModal = ({ setShowViewModal, viewOrder }) => {
    const [status, setStatus] = useState(viewOrder?.order?.status);
    const userData = useAuth().user;
    const { updateOrderStatus } = useData();
    const handleUpdateOrderStatus = async () => {
        if(viewOrder?.order?.status === 'Pending') {
            const id = viewOrder?.order?.id;
            await updateOrderStatus({id, status})
            return;
        }
        toast.warning("Order is already " + viewOrder?.order?.status);
    };
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-lg sm:max-w-3xl sm:w-full">
                <button
                    onClick={() => setShowViewModal(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>

                <h3 className="text-lg font-semibold mb-4">Order Details</h3>

                <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Customer Information</h4>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500">Name: {viewOrder.order.name}</p>
                            <p className="text-sm text-gray-500">Email: {viewOrder.order.email}</p>
                            <p className="text-sm text-gray-500">Phone: {viewOrder.order.phone_number}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Shipping Address: {viewOrder.order.address}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items</h4>
                    <div className="border rounded-lg divide-y overflow-y-auto max-h-52">
                        {viewOrder?.items?.map((product, index) => (
                            <div key={index} className="p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                                        <i className="fas fa-box text-gray-400"></i>
                                    </div>
                                    <div className="ml-6">
                                        <p className="text-sm font-medium">{product.name}</p>
                                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">${product.price}</p>
                                    <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Order Summary</h4>
                    <div className="bg-gray-50 rounded-lg p-5">
                        <div className="flex justify-between font-medium text-gray-700 border-b border-gray-200 pb-2">
                            <span className="w-1/3">Product</span>
                            <span className="w-1/4 text-center">Price</span>
                            <span className="w-1/4 text-center">Quantity</span>
                            <span className="w-1/4 text-right">Total</span>
                        </div>

                        <div className="overflow-y-auto max-h-24">
                            {viewOrder?.items?.map((product, index) => (
                                <div key={index} className="flex justify-between py-2">
                                    <span className="w-1/3">{product.name}</span>
                                    <span className="w-1/4 text-center">${parseFloat(product.price).toFixed(2)}</span>
                                    <span className="w-1/4 text-center">{product.quantity}</span>
                                    <span
                                        className="w-1/4 text-right">${parseFloat(product.total_amount).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-gray-200 mt-4">
                            <div className="flex justify-between text-sm font-medium">
                                <span>Total</span>
                                <span>${parseFloat(viewOrder.order.total_amount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="rounded-lg border border-gray-300 text-sm p-2">
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <button
                                onClick={() => handleUpdateOrderStatus()}
                                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                                Update Status
                            </button>
                        </div>
                        <div>
                            <button
                                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm"
                                onClick={() => generateInvoice(viewOrder, userData)}
                            >
                                Print Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
};
export default ViewOrderModal;