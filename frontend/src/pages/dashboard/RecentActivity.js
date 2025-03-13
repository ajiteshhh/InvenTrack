import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";

const RecentActivity = ({ recentActivity }) => {
    const [showAll, setShowAll] = useState(false);
    const navigate = useNavigate();
    const timeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now - date) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (seconds < 60) {
            return seconds === 1 ? '1 second ago' : `Few seconds ago`;
        } else if (minutes < 60) {
            return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
        } else if (hours < 24) {
            return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        } else if (days < 7) {
            return days === 1 ? '1 day ago' : `${days} days ago`;
        } else if (weeks < 4) {
            return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
        } else if (months < 12) {
            return months === 1 ? '1 month ago' : `${months} months ago`;
        } else {
            return years === 1 ? '1 year ago' : `${years} years ago`;
        }
    };

    // Reverse the recentActivity array
    const reversedActivity = [...recentActivity].reverse();

    // Determine the activities to display
    const displayedActivity = showAll ? reversedActivity : reversedActivity.slice(0, 4);

    const handleClick = (activity) => {
        if(!activity) {
            return;
        }
        if(activity.activity_type.includes('Order')) {
            navigate(`/orders?v=${activity.description.split('#').slice(1).join('-').trim()}`);
        }
        if(activity.activity_type.includes('Stock')) {
            navigate(`/inventory?v=${activity.description.split('-').slice(1).join('-').split('(')[0].trim()}`);
        }
    };
    if(recentActivity.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="flex flex-col items-center justify-center text-center text-gray-600">
                        No recent activity
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4 max-h-72 overflow-auto">
                    {displayedActivity.map((activity, index) => {
                        let icon, bgColor, textColor;
                        switch (activity.activity_type) {
                            case 'New Order':
                                icon = 'fas fa-shopping-cart';
                                bgColor = 'bg-blue-100';
                                textColor = 'text-blue-600';
                                break;
                            case 'Low Stock':
                                icon = 'fas fa-exclamation-triangle';
                                bgColor = 'bg-yellow-100';
                                textColor = 'text-yellow-600';
                                break;
                            case 'Order Completed':
                                icon = 'fas fa-check';
                                bgColor = 'bg-green-100';
                                textColor = 'text-green-600';
                                break;
                            case 'Order Cancelled':
                                icon = 'fas fa-times';
                                bgColor = 'bg-red-100';
                                textColor = 'text-red-600';
                                break;
                            default:
                                icon = 'fas fa-info-circle';
                                bgColor = 'bg-gray-100';
                                textColor = 'text-gray-600';
                        }

                        return (
                            <div key={index} className="flex items-center cursor-pointer" onClick={() => handleClick(activity)}>
                                <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center`}>
                                    <i className={`${icon} ${textColor} text-sm`}></i>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm">
                                        {activity.description.split('-')[0].trim() + ' - '}
                                        <span className="font-semibold">{activity.description.split('-').slice(1).join('-').trim()}</span>
                                    </p>
                                    <p className="text-xs text-gray-500">{timeAgo(activity.created_at)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {recentActivity.length > 4 && (
                    <div className="text-center mt-4">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="text-blue-500 hover:underline focus:outline-none"
                        >
                            {showAll ? 'See Less' : 'See More'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
