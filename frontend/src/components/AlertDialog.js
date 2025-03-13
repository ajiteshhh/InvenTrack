import React from 'react';

const AlertDialog = ({ title, message, type, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[70]">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="mt-3 sm:mt-0 sm:w-auto sm:text-sm w-24 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`w-40 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${type === 'Delete' || type === 'Logout' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'}`}
                    >
                        {type}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AlertDialog;