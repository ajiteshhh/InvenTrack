import React from "react";

const Pagination = ({ currentPage, totalPages, totalItems, startIndex, endIndex, handlePageChange, itemsPerPage, setItemsPerPage }) => {
    return (
        <div className="flex justify-between items-center mt-4">
            <div className="flex text-sm text-gray-700">
                <div className="flex items-center">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
                </div>
                <select
                    name="itemsPerPage"
                    className="block rounded-lg border mx-3 border-gray-300 p-3"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(e.target.value)}>
                    <option value={5}>
                        5
                    </option>
                    <option value={10}>
                        10
                    </option>
                    <option value={25}>
                        25
                    </option>
                    <option value={50}>
                        50
                    </option>
                    <option value={100}>
                        100
                    </option>
                </select>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-md border text-sm font-medium text-gray-500"
                >
                    Previous
                </button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-md border text-sm font-medium text-gray-500"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;