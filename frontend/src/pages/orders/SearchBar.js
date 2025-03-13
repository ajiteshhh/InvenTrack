import React from "react";

const SearchBar = ({
                       searchTerm,
                       setSearchTerm,
                       orderTypeFilter,
                       setOrderTypeFilter,
                       statusFilter,
                       setStatusFilter,
                       showAddOrderButton = true,
                       onAddOrder,
                   }) => {
    return (
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex flex-1 min-w-0 gap-3 flex-col sm:flex-row w-full">
                <div className="flex-1 min-w-0 relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 text-md rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-md"></i>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <select
                        className="flex-1 sm:flex-none px-4 py-2 text-md rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500"
                        value={orderTypeFilter}
                        onChange={(e) => setOrderTypeFilter(e.target.value)}
                    >
                        <option>All Orders</option>
                        <option>Sales</option>
                        <option>Purchase</option>
                    </select>
                    <select
                        className="flex-1 sm:flex-none px-4 py-2 text-md rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option>All Status</option>
                        <option>Completed</option>
                        <option>Pending</option>
                        <option>Cancelled</option>
                    </select>
                </div>
            </div>
            {showAddOrderButton && (
                <button
                    onClick={onAddOrder}
                    className="bg-primary-600 text-white px-4 py-2 text-md rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center w-full sm:w-auto mt-2 sm:mt-0"
                >
                    <i className="fas fa-plus mr-1.5"></i> Add Order
                </button>
            )}
        </div>
    );
};

export default SearchBar;