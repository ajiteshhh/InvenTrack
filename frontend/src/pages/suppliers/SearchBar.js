import React from "react";

const SearchBar = ({
                       searchTerm,
                       setSearchTerm,
                       setShowAddSupplier,
                       setStatusFilter,
                       statusFilter,
                   }) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg border border-gray-200 gap-2 sm:gap-4">
            <div className="flex flex-col sm:flex-row w-full sm:w-auto flex-grow gap-2 sm:gap-4">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search suppliers..."
                        className="w-full pl-10 pr-4 py-2 text-md rounded-md border border-gray-200 focus:ring-1 focus:ring-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-md"></i>
                </div>

                <select
                    className="w-full sm:w-auto text-md px-4 py-2 rounded-md border border-gray-200 focus:ring-1 focus:ring-primary-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Pending Review</option>
                </select>
            </div>

            <button
                onClick={() => setShowAddSupplier(true)}
                className="w-full sm:w-auto bg-primary-600 text-white px-4 py-2 text-md rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
            >
                <i className="fas fa-plus mr-1 text-md"></i> Add Supplier
            </button>
        </div>
    );
};

export default SearchBar;