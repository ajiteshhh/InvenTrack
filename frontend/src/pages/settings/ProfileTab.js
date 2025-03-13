import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import Error from "../../components/Error";
import {useAuth} from "../../context/AuthContext";
import PhoneInput from "react-phone-number-input";
import {toast} from "sonner";
import {Info} from 'lucide-react';
const ProfileTab = (user) => {
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(useAuth().user);
    const { updateProfile, updateProfilePicture } = useData();
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
            updateProfilePicture(formData),
            {
                loading: "Updating logo...",
                success: "Profile picture updated successfully! Refresh the page",
                error: "Failed to update profile picture. Please try again.",
            }
        );
    };
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError(null);
        if (!userData) {
            setError("Error");
            return;
        }
        if (!userData.name || !userData.phone_number) {
            setError("Missing required fields");
            return;
        }
        try {
            await updateProfile(userData);
            toast.success("Profile updated successfully!");
        } catch (error) {
            setError("Failed to update profile. Please, try again later.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <img
                    src={userData.profile_picture}
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
            <div className="grid grid-cols-1 gap-6">
                <Error error={error}/>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={userData.email}
                            className="mt-1 block w-full rounded-lg border border-gray-300 pr-10 pl-3 py-2 bg-gray-100 cursor-not-allowed"
                            disabled
                        />
                        <button
                            type="button"
                            onClick={() => toast.info('Emails cannot be changed!')}
                            className="absolute top-1/2 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <Info />
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <PhoneInput
                            placeholder="Enter phone number"
                            value={userData.phone_number}
                            onChange={(value) => setUserData({...userData, phone_number: value})}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                        />
                    </div>
                </div>

            </div>
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleUpdateProfile}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default ProfileTab;
