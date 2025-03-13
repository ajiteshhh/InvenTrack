import React from "react";

export const Toggle = ({ title, description, enabled, onToggle }) => (
    <div className="flex items-center justify-between">
        <div>
            <h4 className="text-sm font-medium text-gray-900">{title}</h4>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 transition-colors duration-200 ease-in-out ${
                enabled ? "bg-primary-600" : "bg-gray-200"
            }`}
        >
      <span
          className={`absolute inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
              enabled ? "translate-x-5" : "translate-x-0"
          }`}
      />
        </button>
    </div>
);