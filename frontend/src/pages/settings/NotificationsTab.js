import React, { useState } from "react";
import {Toggle} from "../../components/Toggle";

const NotificationsTab = () => {
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [orderUpdates, setOrderUpdates] = useState(true);
    const [lowStockAlerts, setLowStockAlerts] = useState(false);

    return (
        <div className="space-y-6">
            <Toggle
                title="Email Notifications"
                description="Receive emails about your account activity."
                enabled={emailNotifications}
                onToggle={() => setEmailNotifications((prev) => !prev)}
            />
            <Toggle
                title="Order Updates"
                description="Get notified when the status of an order changes."
                enabled={orderUpdates}
                onToggle={() => setOrderUpdates((prev) => !prev)}
            />
            <Toggle
                title="Low Stock Alerts"
                description="Get notified when products are running low."
                enabled={lowStockAlerts}
                onToggle={() => setLowStockAlerts((prev) => !prev)}
            />
        </div>
    );
};


export default NotificationsTab;