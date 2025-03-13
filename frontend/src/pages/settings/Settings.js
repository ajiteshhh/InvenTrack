import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SettingsNavigation from "./SettingsNavigation";
import ProfileTab from "./ProfileTab";
import BusinessTab from "./BusinessTab";
import NotificationsTab from "./NotificationsTab";
import SecurityTab from "./SecurityTab";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { logout } = useAuth();
  const tabs = [
    { id: "profile", label: "Profile", icon: "fas fa-user" },
    { id: "business", label: "Business", icon: "fas fa-building" },
    // { id: "notifications", label: "Notifications", icon: "fas fa-bell" },
    { id: "security", label: "Security", icon: "fas fa-lock" },
  ];

  return (
      <section id="settings" className="space-y-6 px-4">
        <div className="bg-white rounded-lg border border-gray-200">
          <SettingsNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="p-6">
            {activeTab === "profile" && (
                <ProfileTab/>
            )}
            {activeTab === "business" && <BusinessTab/>}
            {/*{activeTab === "notifications" && <NotificationsTab />}*/}
            {activeTab === "security" && <SecurityTab logout={logout} />}
          </div>
        </div>
      </section>
  );
};

export default Settings;
