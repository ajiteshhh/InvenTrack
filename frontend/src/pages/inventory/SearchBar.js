import React from 'react';

const SearchBar = ({
                       searchTerm,
                       setSearchTerm,
                       categoryFilter,
                       setCategoryFilter,
                       statusFilter,
                       setStatusFilter,
                       categories,
                       setShowAddCategory,
                       setShowAddProduct,
                       loading,
                   }) => {
    return (
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex flex-col md:flex-row w-full md:w-auto gap-3 flex-1 min-w-0">
                <div className="w-full md:flex-1 min-w-0 relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 text-md rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-md"></i>
                </div>

                <div className="flex flex-wrap w-full md:w-auto gap-2">
                    <select
                        className="flex-1 md:flex-none px-4 py-2 text-md rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        {loading ? (
                            <option>Loading...</option>
                        ) : categories.length === 0 ? (
                            <option>No Categories</option>
                        ) : (
                            <>
                                <option>All Categories</option>
                                {categories.map((category) => (
                                    <option value={category.name} key={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </>
                        )}
                    </select>

                    <select
                        className="flex-1 md:flex-none px-4 py-2 text-md rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option>All Status</option>
                        <option>In Stock</option>
                        <option>Low Stock</option>
                        <option>Out of Stock</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap w-full sm:w-auto gap-2">
                <button
                    onClick={() => setShowAddCategory(true)}
                    className="flex-1 sm:flex-none bg-primary-600 text-white px-4 py-2 text-md rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                    <i className="fas fa-plus mr-1.5"></i> Add Category
                </button>

                <button
                    onClick={() => setShowAddProduct(true)}
                    className="flex-1 sm:flex-none bg-primary-600 text-white px-4 py-2 text-md rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                    <i className="fas fa-plus mr-1.5"></i> Add Product
                </button>
            </div>
        </div>
    );
}

export default SearchBar;