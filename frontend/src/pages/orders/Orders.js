import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "./SearchBar";
import OrdersTable from "./OrdersTable";
import Pagination from "../../components/Pagination";
import AddOrderModal from "./AddOrderModal";
import ViewOrderModal from "./ViewOrderModal";
import { useData } from "../../context/DataContext";

const Orders = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("v") || '');
  const [orderTypeFilter, setOrderTypeFilter] = useState(searchParams.get("type") || "All Orders");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "All Status");
  const { products, customers, suppliers, orders, placeNewOrder, getOrderItems } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState("created_at"); // Track which column we're sorting by
  const [sortOrder, setSortOrder] = useState("desc"); // Default to newest orders first
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const order_id = searchParams.get("id");

  useEffect(() => {
    if (order_id && orders.length > 0) {
      const order = orders.find((order) => order.id.toString() === order_id);
      if (order) {
        handleViewOrder(order);
      }
    }
  }, [order_id, orders]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(parsedDate);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleViewOrder = async (order) => {
    const items = await getOrderItems(order.id);
    setViewOrder({ order, items });
    setShowViewModal(true);
  };

  const filteredOrder = useMemo(() => {
    if (!Array.isArray(orders) || orders.length === 0) return [];
    return orders.filter((order) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearchTerm =
          (order.name && order.name.toLowerCase().includes(lowerSearchTerm)) ||
          (order.order_id && order.order_id.toLowerCase().includes(lowerSearchTerm));
      const matchesOrderType = orderTypeFilter === "All Orders" || order.type === orderTypeFilter;
      const matchesStatus = statusFilter === "All Status" || order.status === statusFilter;
      return matchesSearchTerm && matchesOrderType && matchesStatus;
    });
  }, [orders, searchTerm, orderTypeFilter, statusFilter]);

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
    if (!filteredOrder.length) return [];

    return [...filteredOrder].sort((a, b) => {
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
  }, [filteredOrder, sortColumn, sortOrder]);

  const totalItems = sortedAndFilteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedAndFilteredOrders.slice(startIndex, endIndex);

  return (
      <div id="orders_management" className="space-y-6 px-4">
        <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            orderTypeFilter={orderTypeFilter}
            setOrderTypeFilter={setOrderTypeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onAddOrder={() => setShowAddOrder(true)}
        />

        <div className="overflow-x-auto">
          <OrdersTable
              orders={currentItems}
              handleSort={handleSort}
              handleViewOrder={handleViewOrder}
              formatDate={formatDate}
              sortColumn={sortColumn}
              sortOrder={sortOrder}
          />
        </div>

        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            handlePageChange={handlePageChange}
        />

        {showAddOrder && <AddOrderModal
            products={products}
            customers={customers}
            suppliers={suppliers}
            showAddOrder={showAddOrder}
            setShowAddOrder={setShowAddOrder}
            placeNewOrder={placeNewOrder}
        />}

        {showViewModal && (
            <ViewOrderModal
                setShowViewModal={setShowViewModal}
                viewOrder={viewOrder}
            />
        )}
      </div>
  );
};

export default Orders;
