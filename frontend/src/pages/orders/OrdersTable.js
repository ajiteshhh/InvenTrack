import React from "react";

const OrderStatusBadge = ({ status }) => {
    const getBadgeColor = () => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-800";
            case "Pending":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-red-100 text-red-800";
        }
    };

    return (
        <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor()}`}
        >
      {status}
    </span>
    );
};

const OrdersTable = ({
                         orders,
                         handleSort,
                         handleViewOrder,
                         formatDate,
                         sortColumn,
                         sortOrder,
                     }) => {
    const renderSortIcon = (column) => {
        if (sortColumn !== column) {
            return <i className="fas fa-sort ml-1 text-gray-400"></i>;
        }
        return sortOrder === "asc" ? (
            <i className="fas fa-sort-up ml-1 text-primary-500"></i>
        ) : (
            <i className="fas fa-sort-down ml-1 text-primary-500"></i>
        );
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden sm:table-cell"
                            onClick={() => handleSort("order_id")}
                        >
                            Order ID {renderSortIcon("order_id")}
                        </th>

                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort("name")}
                        >
                            Supplier/Customer {renderSortIcon("name")}
                        </th>

                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort("type")}
                        >
                            Order Type {renderSortIcon("type")}
                        </th>

                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort("created_at")}
                        >
                            Date {renderSortIcon("created_at")}
                        </th>

                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort("total_amount")}
                        >
                            Total {renderSortIcon("total_amount")}
                        </th>

                        <th
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort("status")}
                        >
                            Status {renderSortIcon("status")}
                        </th>

                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                No orders available
                            </td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                                    #{order.order_id}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.name}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.type}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(order.created_at)}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${order.total_amount}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                    <OrderStatusBadge status={order.status} />
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                                    <button
                                        onClick={() => handleViewOrder(order)}
                                        className="text-primary-600 hover:text-primary-900 mr-3"
                                    >
                                        <i className="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersTable;
