import React from "react";

const SettingsNavigation = ({ tabs, activeTab, setActiveTab }) => (
    <>
        <div className="sm:hidden">
            <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
                {tabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                        {tab.label}
                    </option>
                ))}
            </select>
        </div>
        <div className="hidden sm:block">
            <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-1/3 px-1 py-4 text-sm font-medium text-gray-500 hover:text-primary-600 border-b-2 ${
                                activeTab === tab.id
                                    ? "border-primary-500 text-primary-600"
                                    : "border-transparent"
                            }`}
                        >
                            <i className={`${tab.icon} mr-2`} />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    </>
);

export default SettingsNavigation;