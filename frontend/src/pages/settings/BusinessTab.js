import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import {useAuth} from "../../context/AuthContext";
import Error from "../../components/Error";
import {toast} from "sonner";

const BusinessTab = () => {
    const [userData, setUserData] = useState(useAuth().user);
    const [error, setError] = useState(null);
    const { updateProfile, updateBusinessLogo } = useData();

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (file.size > 1024 * 1024) {
            toast.warning('File size must be less than 1MB');
            return;
        }
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            toast.warning('Only JPG and PNG files are allowed');
            return;
        }
        const formData = new FormData();
        formData.append('image', file);

        await toast.promise(
            updateBusinessLogo(formData),
            {
                loading: "Updating logo...",
                success: "Business logo updated successfully! Refresh the page",
                error: "Failed to update logo. Please try again.",
            }
        );
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError(null);

        if(!userData) {
            setError(Error);
            return;
        }
        if(!userData.business_name || !userData.business_address) {
            setError("Missing required fields.");
            return;
        }
        try {
            await updateProfile(userData);
            toast.success("Business Profile updated successfully!");
        } catch (error) {
            setError("Failed to update profile. Please, try again later.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <img
                    src={userData.business_logo}
                    alt="Profile"
                    className="w-20 h-20 rounded-full"
                />
                <div className="ml-6">
                    <input
                        type="file"
                        id="file-input"
                        accept="image/jpeg, image/png"
                        style={{display: 'none'}}
                        onChange={handleImageUpload}
                    />
                    <button
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                        onClick={() => document.getElementById('file-input').click()}
                    >
                        Change Photo
                    </button>
                    <p className="mt-2 text-sm text-gray-500">
                        Recommended: Square JPG, PNG. Max 1MB
                    </p>
                </div>
            </div>
            <Error error={error}/>
            <div>
                <label className="block text-sm font-medium text-gray-700">Business Name</label>
                <input
                    type="text"
                    value={userData.business_name}
                    onChange={(e) => {
                        setUserData({...userData, business_name: e.target.value})
                    }}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Business Address</label>
                <textarea
                    rows="3"
                    value={userData.business_address}
                    onChange={(e) => {
                        setUserData({...userData, business_address: e.target.value})
                    }}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                ></textarea>
            </div>
            <div className="mt-6 flex justify-end">
                <button onClick={handleUpdateProfile}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                    Save Changes
                </button>
            </div>
        </div>
    );
}

export default BusinessTab;