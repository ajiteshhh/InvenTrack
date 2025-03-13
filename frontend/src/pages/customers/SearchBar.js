import React from "react";

const SearchBar = ({
                       searchTerm,
                       setSearchTerm,
                       sortBy,
                       setSortBy,
                       setShowAddCustomer
                   }) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg border border-gray-200 gap-2 sm:gap-4">
            {/* Left side - search and sort */}
            <div className="flex flex-col sm:flex-row w-full sm:w-auto flex-grow gap-2 sm:gap-4">
                {/* Search Input */}
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="w-full pl-10 pr-4 py-2 text-md rounded-md border border-gray-200 focus:ring-1 focus:ring-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-md"></i>
                </div>

                {/* Sort Dropdown */}
                <select
                    className="w-full sm:w-auto text-md px-4 py-2 rounded-md border border-gray-200 focus:ring-1 focus:ring-primary-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option>Most Orders</option>
                    <option>Recent</option>
                    <option>A-Z</option>
                </select>
            </div>

            {/* Right side - Add Customer Button */}
            <button
                onClick={() => setShowAddCustomer(true)}
                className="w-full sm:w-auto bg-primary-600 text-white px-4 py-2 text-md rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
            >
                <i className="fas fa-plus mr-1 text-md"></i> Add Customer
            </button>
        </div>
    );
};

export default SearchBar;