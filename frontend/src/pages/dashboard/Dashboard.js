import React, {useState, useEffect, useMemo} from 'react';
import {useData} from "../../context/DataContext";
import SalesLineChart from "./SalesLineChart";
import StockPieChart from "./StockPieChart";
import RecentActivity from "./RecentActivity";
import {useNavigate} from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { products = [], orders = [], recentActivity } = useData();
  const [stats, setStats] = useState({
    inventory: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    revenue: 0,
  });

  useEffect(() => {
    const { inventory, lowStockItems } = products.length > 0 ? products.reduce((acc, product) => {
      acc.inventory += product.quantity_in_stock;
      if (product.quantity_in_stock <= product.low_stock) {
        acc.lowStockItems++;
      }
      return acc;
    }, { inventory: 0, lowStockItems: 0 }) : { inventory: 0, lowStockItems: 0 };

    const { pendingOrders, revenue } = orders.length > 0 ? orders.reduce((acc, order) => {
      if (order.status === 'Pending') {
        acc.pendingOrders += 1;
      }
      if (order.type === 'Sales') {
        acc.revenue += parseFloat(order.total_amount);
      }
      return acc;
    }, { pendingOrders: 0, revenue: 0 }) : { pendingOrders: 0, revenue: 0 };
    setStats({inventory, lowStockItems, pendingOrders, revenue});
  }, [products, orders]);

  const salesData = orders.length > 0 ? orders
      .filter((item) => item.type === "Sales")
      .map((item) => ({
        date: new Date(item.created_at).toISOString().split("T")[0],
        total: parseFloat(item.total_amount),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)) : [];


  return (
    <section id="dashboard_overview" className="space-y-6 px-4">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Inventory</p>
              <h3 className="text-2xl font-bold mt-2">{stats.inventory}</h3>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              <i className="fas fa-box text-primary-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer hover:scale-105 transition" onClick={() => navigate('/inventory?filter=Low Stock')}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <h3 className="text-2xl font-bold mt-2">{stats.lowStockItems}</h3>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer hover:scale-105 transition" onClick={()=>navigate('/orders?status=Pending')}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <h3 className="text-2xl font-bold mt-2">{stats.pendingOrders}</h3>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <i className="fas fa-clock text-yellow-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <h3 className="text-2xl font-bold mt-2">${stats.revenue.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <i className="fas fa-dollar-sign text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-md font-medium text-gray-600">Renvenue</h3>
          <div>
            {salesData.length > 0 ? (
                <SalesLineChart data={salesData || []}/>
                ) :
                (
                    <div className="flex flex-col items-center justify-center h-52 text-center text-gray-600">
                      No sales data available
                    </div>
                )
            }
          </div>

        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-md font-medium text-gray-600 mb-4">Inventory</h3>
          <div className="max-w-xs mx-auto bg-white p-6 rounded-lg">
            {products.length > 0 ? (
                <StockPieChart products={products}/>
            ) : (
                <div className="flex flex-col items-center justify-center h-52 text-center">
                  <i className="fas fa-box-open text-gray-400 text-6xl mb-4"></i>
                  <h3 className="text-gray-600 text-md">Inventory is Empty</h3>
                </div>
            )}
          </div>
        </div>

      </div>
      <RecentActivity recentActivity={recentActivity}/>
    </section>
  );
};

export default Dashboard;
