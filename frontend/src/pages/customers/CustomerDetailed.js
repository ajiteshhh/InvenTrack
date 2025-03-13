import React, { useMemo, useEffect, useState } from "react";
import { ArrowLeft, Calendar, Download, Mail, MapPin, Phone, User } from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    AreaChart,
    Area,
} from "recharts";
import OrdersTable from "../orders/OrdersTable";
import { useData } from "../../context/DataContext";
import ViewOrderModal from "../orders/ViewOrderModal";
import SearchBar from "../orders/SearchBar";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {Toaster} from "sonner";

const CustomerDetailed = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const { id } = location.state || {};
    const [searchTerm, setSearchTerm] = useState("");
    const [orderTypeFilter, setOrderTypeFilter] = useState(searchParams.get("type") || "All Orders");
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "All Status");
    const { customers, categories, orders, getOrderItems, products } = useData();
    const [customer, setCustomer] = useState(null);
    const [customerOrders, setCustomerOrders] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewOrder, setViewOrder] = useState(null);
    const [productCategoryData, setProductCategoryData] = useState([]);
    const navigate = useNavigate();
    const [sortColumn, setSortColumn] = useState("created_at"); // Track which column we're sorting by
    const [sortOrder, setSortOrder] = useState("desc"); // Default to newest orders first

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortOrder("asc");
        }
    };

    useEffect(() => {
        if (customers && id) {
            const foundCustomer = customers.find((c) => c.id === id);
            setCustomer(foundCustomer);
        }
    }, [customers, id]);

    useEffect(() => {
        if (customer && orders) {
            const filteredOrders = orders.filter((order) => order.customer_id === customer.id);
            setCustomerOrders(filteredOrders);
        }
    }, [customer, orders]);

    const filteredOrders = useMemo(() => {
        if (!Array.isArray(customerOrders) || customerOrders.length === 0) return [];
        return customerOrders.filter((order) => {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const matchesSearchTerm =
                (order.name && order.name.toLowerCase().includes(lowerSearchTerm)) ||
                (order.order_id && order.order_id.toLowerCase().includes(lowerSearchTerm));
            const matchesOrderType = orderTypeFilter === "All Orders" || order.type === orderTypeFilter;
            const matchesStatus = statusFilter === "All Status" || order.status === statusFilter;
            return matchesSearchTerm && matchesOrderType && matchesStatus;
        });
    }, [customerOrders, searchTerm, orderTypeFilter, statusFilter]);

    const extractNumeric = (str) => {
        if (typeof str !== 'string') return str;
        const matches = str.match(/\d+/);
        return matches ? parseInt(matches[0], 10) : str;
    };

    const isNumeric = (value) => {
        if (typeof value === 'number') return true;
        if (typeof value !== 'string') return false;
        return !isNaN(value) || !isNaN(extractNumeric(value));
    };

    const sortedAndFilteredOrders = useMemo(() => {
        if (!filteredOrders.length) return [];

        return [...filteredOrders].sort((a, b) => {
            let valueA = a[sortColumn];
            let valueB = b[sortColumn];

            if (sortColumn === "date" || sortColumn === "created_at") {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
            }

            if (sortColumn === "order_id") {
                valueA = extractNumeric(valueA);
                valueB = extractNumeric(valueB);
            }

            if (isNumeric(valueA) && isNumeric(valueB)) {
                const numA = typeof valueA === 'number' ? valueA : parseFloat(valueA);
                const numB = typeof valueB === 'number' ? valueB : parseFloat(valueB);
                return sortOrder === "asc" ? numA - numB : numB - numA;
            }

            if (valueA === undefined || valueA === null) return sortOrder === "asc" ? -1 : 1;
            if (valueB === undefined || valueB === null) return sortOrder === "asc" ? 1 : -1;

            if (sortOrder === "asc") {
                return String(valueA).localeCompare(String(valueB));
            } else {
                return String(valueB).localeCompare(String(valueA));
            }
        });
    }, [filteredOrders, sortColumn, sortOrder]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    };

    const handleViewOrder = async (order) => {
        const items = await getOrderItems(order.id);
        setViewOrder({ order, items });
        setShowViewModal(true);
    };

    const getOrdersByStatus = (status) => {
        return customerOrders.filter(order =>
            order.status && order.status.toLowerCase() === status.toLowerCase()
        );
    };

    const completedOrders = useMemo(() => getOrdersByStatus("completed"), [customerOrders]);
    const pendingOrders = useMemo(() => getOrdersByStatus("pending"), [customerOrders]);
    const cancelledOrders = useMemo(() => getOrdersByStatus("cancelled"), [customerOrders]);

    const monthlyOrderData = useMemo(() => {
        if (!customerOrders || customerOrders.length === 0) return [];

        const monthlyData = {};

        customerOrders.forEach(order => {
            if (!order.created_at) return;

            const month = new Date(order.created_at).toLocaleString("default", { month: "short" });
            const status = (order.status || "unknown").toLowerCase();

            if (!monthlyData[month]) {
                monthlyData[month] = {
                    month,
                    completed: 0,
                    pending: 0,
                    cancelled: 0,
                    total: 0
                };
            }

            const amount = parseFloat(order.total_amount || 0);

            if (status === "completed" || status === "pending" || status === "cancelled") {
                monthlyData[month][status] += amount;
            }

            monthlyData[month].total += amount;
        });

        return Object.values(monthlyData).sort((a, b) => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return months.indexOf(a.month) - months.indexOf(b.month);
        });
    }, [customerOrders]);

    const monthlyOrderCounts = useMemo(() => {
        if (!customerOrders || customerOrders.length === 0) return [];

        const monthlyCounts = {};

        customerOrders.forEach(order => {
            if (!order.created_at) return;

            const month = new Date(order.created_at).toLocaleString("default", { month: "short" });
            const status = (order.status || "unknown").toLowerCase();

            if (!monthlyCounts[month]) {
                monthlyCounts[month] = {
                    month,
                    completed: 0,
                    pending: 0,
                    cancelled: 0,
                    total: 0
                };
            }

            if (status === "completed" || status === "pending" || status === "cancelled") {
                monthlyCounts[month][status] += 1;
            }

            monthlyCounts[month].total += 1;
        });

        return Object.values(monthlyCounts).sort((a, b) => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return months.indexOf(a.month) - months.indexOf(b.month);
        });
    }, [customerOrders]);

    useEffect(() => {
        const fetchCategoryData = async () => {
            if (!customerOrders || customerOrders.length === 0 || !categories || !products) return;

            const categoryCounts = {};
            const categoryByStatus = {
                completed: {},
                pending: {},
                cancelled: {}
            };

            for (const order of customerOrders) {
                if (!order || !order.id) continue;

                try {
                    const items = await getOrderItems(order.id);
                    if (!items || !Array.isArray(items)) continue;

                    const orderStatus = (order.status || "unknown").toLowerCase();

                    items.forEach((item) => {
                        if (!item || !item.product_id) return;

                        const product = products.find((prod) => prod.id === item.product_id);
                        if (!product || !product.category_id) return;

                        const category = categories.find((cat) => cat.id === product.category_id);
                        if (!category || !category.name) return;

                        const quantity = parseInt(item.quantity) || 1;

                        if (!categoryCounts[category.name]) {
                            categoryCounts[category.name] = 0;
                        }
                        categoryCounts[category.name] += quantity;

                        if (orderStatus === "completed" || orderStatus === "pending" || orderStatus === "cancelled") {
                            if (!categoryByStatus[orderStatus][category.name]) {
                                categoryByStatus[orderStatus][category.name] = 0;
                            }
                            categoryByStatus[orderStatus][category.name] += quantity;
                        }
                    });
                } catch (error) {
                    console.error("Error processing order items:", error);
                }
            }

            const categoryData = Object.keys(categoryCounts).map((categoryName) => ({
                name: categoryName,
                value: categoryCounts[categoryName],
                completed: categoryByStatus.completed[categoryName] || 0,
                pending: categoryByStatus.pending[categoryName] || 0,
                cancelled: categoryByStatus.cancelled[categoryName] || 0
            }));

            setProductCategoryData(categoryData);
        };

        fetchCategoryData();
    }, [customerOrders, categories, products, getOrderItems]);

    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#a4de6c"];

    const STATUS_COLORS = {
        completed: "#22c55e", // green
        pending: "#f59e0b",   // amber
        cancelled: "#ef4444"  // red
    };

    if (!customer) {
        navigate('../customers');
        return <div>Loading...</div>;
    }

    const calculateTotalByStatus = (status) => {
        const filteredOrders = customerOrders.filter(order =>
            order.status && order.status.toLowerCase() === status.toLowerCase()
        );
        return filteredOrders.reduce((total, order) => total + parseFloat(order.total_amount || 0), 0);
    };

    const completedValue = calculateTotalByStatus("completed");
    const pendingValue = calculateTotalByStatus("pending");
    const cancelledValue = calculateTotalByStatus("cancelled");
    const totalValue = completedValue + pendingValue + cancelledValue;

    return (
        <div className="container mx-auto py-6 space-y-8">
            <Toaster richColors/>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button className="p-2 border rounded-lg" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to customers</span>
                    </button>
                    <h1 className="text-2xl font-bold tracking-tight">Customer Details</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 border rounded-lg flex items-center gap-2" onClick={() => window.print()}>
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Customer Profile</h2>
                    </div>
                    <div className="space-y-6 mt-4">
                        <div className="flex flex-col items-center space-y-3">
                            <div className="relative h-24 w-24">
                                <img
                                    src={`https://avatar.iran.liara.run/public/${customer.id}`}
                                    alt={customer.name}
                                    className="rounded-full object-cover border w-full h-full"
                                />
                            </div>
                            <div className="space-y-1 text-center">
                                <h3 className="text-xl font-semibold">{customer.name}</h3>
                                <p className="text-sm text-gray-500">Customer since {formatDate(customer.created_at)}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{customer.phone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                <span className="text-sm">{customer.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">Joined {formatDate(customer.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 border rounded-lg p-6">
                    <h2 className="text-xl font-bold">Order Statistics</h2>
                    <p className="text-sm text-gray-500">Overview of customer's ordering activity</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-500">Total Orders</p>
                            <p className="text-3xl font-bold">{customerOrders.length || 0}</p>
                            <div className="text-xs flex gap-2">
                                <span className="flex items-center" style={{ color: STATUS_COLORS.completed }}>
                                    <span className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: STATUS_COLORS.completed }}></span>
                                    Completed: {completedOrders.length}
                                </span>
                                <span className="flex items-center" style={{ color: STATUS_COLORS.pending }}>
                                    <span className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: STATUS_COLORS.pending }}></span>
                                    Pending: {pendingOrders.length}
                                </span>
                                <span className="flex items-center" style={{ color: STATUS_COLORS.cancelled }}>
                                    <span className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: STATUS_COLORS.cancelled }}></span>
                                    Cancelled: {cancelledOrders.length}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-500">Lifetime Value</p>
                            <p className="text-3xl font-bold">
                                ${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </p>
                            <div className="text-xs flex gap-2">
                                <span className="flex items-center" style={{ color: STATUS_COLORS.completed }}>
                                    <span className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: STATUS_COLORS.completed }}></span>
                                    ${completedValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </span>
                                <span className="flex items-center" style={{ color: STATUS_COLORS.pending }}>
                                    <span className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: STATUS_COLORS.pending }}></span>
                                    ${pendingValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-500">Average Order Value</p>
                            <p className="text-3xl font-bold">
                                {customerOrders.length > 0
                                    ? `$${(totalValue / customerOrders.length).toFixed(2)}`
                                    : "$0.00"}
                            </p>
                            <div className="text-xs flex gap-2">
                                <span className="flex items-center" style={{ color: STATUS_COLORS.completed }}>
                                    <span className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: STATUS_COLORS.completed }}></span>
                                    {completedOrders.length > 0 ? `$${(completedValue / completedOrders.length).toFixed(2)}` : "$0.00"}
                                </span>
                                <span className="flex items-center" style={{ color: STATUS_COLORS.pending }}>
                                    <span className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: STATUS_COLORS.pending }}></span>
                                    {pendingOrders.length > 0 ? `$${(pendingValue / pendingOrders.length).toFixed(2)}` : "$0.00"}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-500">Last Order</p>
                            <p className="text-3xl font-bold">
                                {customer?.latest_order_date ? formatDate(customer.latest_order_date) : 'No Orders Yet'}
                            </p>
                            <p className="text-xs">
                                {customer?.latest_order_status ? `Status: ${customer.latest_order_status}` : ''}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border rounded-lg p-6">
                            <h3 className="text-xl font-bold">Monthly Order Value</h3>
                            <p className="text-sm text-gray-500">Order value trend over the past 12 months</p>
                            <div className="h-64">
                                {monthlyOrderData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlyOrderData}>
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="month"/>
                                            <YAxis tickFormatter={(value) => `$${value}`}/>
                                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`}/>
                                            <Area type="monotone" name="Completed" dataKey="completed" stackId="1"
                                                  stroke={STATUS_COLORS.completed} fill={STATUS_COLORS.completed} />
                                            <Area type="monotone" name="Pending" dataKey="pending" stackId="1"
                                                  stroke={STATUS_COLORS.pending} fill={STATUS_COLORS.pending} />
                                            <Area type="monotone" name="Cancelled" dataKey="cancelled" stackId="1"
                                                  stroke={STATUS_COLORS.cancelled} fill={STATUS_COLORS.cancelled} />
                                            <Legend />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-gray-500">
                                        No order data available
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border rounded-lg p-6">
                            <h3 className="text-xl font-bold">Monthly Orders</h3>
                            <p className="text-sm text-gray-500">Number of orders per month</p>
                            <div className="h-64">
                                {monthlyOrderCounts.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyOrderCounts}>
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="month"/>
                                            <YAxis/>
                                            <Tooltip/>
                                            <Bar name="Completed" dataKey="completed" stackId="a" fill={STATUS_COLORS.completed} />
                                            <Bar name="Pending" dataKey="pending" stackId="a" fill={STATUS_COLORS.pending} />
                                            <Bar name="Cancelled" dataKey="cancelled" stackId="a" fill={STATUS_COLORS.cancelled} />
                                            <Legend />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-gray-500">
                                        No order data available
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-2 border rounded-lg p-6">
                            <h3 className="text-xl font-bold">Items Ordered</h3>
                            <p className="text-sm text-gray-500">Distribution of items by category</p>
                            <div className="max-h-64">
                                {productCategoryData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={productCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                                                 outerRadius={80} fill="#8884d8">
                                                {productCategoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                                ))}
                                            </Pie>
                                            <Tooltip content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-white p-3 border rounded shadow-lg">
                                                            <p className="font-bold">{data.name}</p>
                                                            <p>Total: {data.value}</p>
                                                            <p style={{ color: STATUS_COLORS.completed }}>
                                                                Completed: {data.completed}
                                                            </p>
                                                            <p style={{ color: STATUS_COLORS.pending }}>
                                                                Pending: {data.pending}
                                                            </p>
                                                            <p style={{ color: STATUS_COLORS.cancelled }}>
                                                                Cancelled: {data.cancelled}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}/>
                                            <Legend/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-gray-500">
                                        No category data available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                orderTypeFilter={orderTypeFilter}
                setOrderTypeFilter={setOrderTypeFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                showAddOrderButton={false}
                onAddOrder={() => {}}
            />

            <OrdersTable
                orders={sortedAndFilteredOrders}
                handleSort={handleSort}
                handleViewOrder={handleViewOrder}
                formatDate={formatDate}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
            />

            {showViewModal && (
                <ViewOrderModal
                    setShowViewModal={setShowViewModal}
                    viewOrder={viewOrder}
                    handlePrintInvoice={() => console.log("handlePrintInvoice")}
                />
            )}
        </div>
    );
};

export default CustomerDetailed;