import React, { useState } from 'react';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Error from "../../components/Error";

const AddSupplierModal = ({ setShowAddSupplier, handleAddSupplier, error, setError, categories }) => {
    const [newSupplier, setNewSupplier] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        status: 'Active',
        category_id: -1,
    });
    const handleChange = (e) => {
        setError('');
        const { name, value } = e.target;
        setNewSupplier((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handlePhoneChange = (value) => {
        setNewSupplier((prev) => ({
            ...prev,
            phone: value,
        }));
    };


    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Supplier</h3>
                    {error && (
                        <Error error={error}/>
                    )}
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newSupplier.name}
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
                                    value={newSupplier.category_id}
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
                                value={newSupplier.email}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <PhoneInput
                                placeholder="Enter phone number"
                                value={newSupplier.phone}
                                onChange={handlePhoneChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea
                                rows="3"
                                name="address"
                                value={newSupplier.address}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                name="status"
                                value={newSupplier.status}
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
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                        type="submit"
                        className="w-40 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => handleAddSupplier(newSupplier)}
                    >
                        Add Supplier
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setShowAddSupplier(false);
                            setError('');
                        }}
                        className="mt-3 sm:mt-0 sm:w-auto sm:text-sm w-24 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSupplierModal;