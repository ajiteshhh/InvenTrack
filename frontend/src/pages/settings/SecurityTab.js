import React, { useState } from "react";
import Error from "../../components/Error";
import {Toggle} from "../../components/Toggle";
import {useAuth} from "../../context/AuthContext";
import {useData} from "../../context/DataContext";
import {toast} from "sonner";
import AlertDialog from "../../components/AlertDialog";

const SecurityTab = ({ logout }) => {
    const { user } = useAuth();  // Directly getting the user from context
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.tfa_enabled);
    const [error, setError] = useState(null);
    const [password, setPassword] = useState({ current_password: "", new_password: "" });
    const { updatePassword, updateProfile } = useData();
    const [alertVisible, setAlertVisible] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const cooldownTime = 5000; // 5 seconds cooldown

    const handleToggle = async () => {
        if (isToggling) {
            toast.warning('Slow down! You need to wait a few seconds before toggling again.');
            return;
        }
        setIsToggling(true);
        setTwoFactorEnabled((prev) => !prev); // Optimistic update
        try {
            await updateProfile({ ...user, tfa_enabled: !twoFactorEnabled });
            toast.success(`Two-Factor Authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}`);
        } catch (error) {
            toast.error("Error toggling TFA")
            setTwoFactorEnabled((prev) => !prev);
        }

        setTimeout(() => {
            setIsToggling(false);
        }, cooldownTime);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if(password.current_password === password.new_password) {
            setError('Invalid password');
            return;
        }
        if(password.new_password.length < 8) {
            setError("Password should contain at least 8 characters.");
            return;
        }
        try {
            await updatePassword({ password, type: 'update-password' });
        } catch (error) {
             setError(error);
        }
        setPassword({current_password: "", new_password: ""});
    };
    return (
        <div className="space-y-6">
            <div>
                <Error error={error} />
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input
                            type="password"
                            value={password.current_password}
                            onChange={(e) => {setPassword({...password, current_password: e.target.value})}}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={password.new_password}
                            onChange={(e) => {setPassword({...password, new_password: e.target.value})}}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                        onClick={handleSubmit}
                    >
                        Change Password
                    </button>
                </div>
            </div>
            <div>
                <Toggle
                    title="Two-Factor Authentication"
                    description="Get extra layer of security."
                    enabled={twoFactorEnabled}
                    onToggle={handleToggle}
                />
            </div>
            <div className="flex w-full justify-end">
                <button
                    onClick={() => setAlertVisible(true)}
                    className="py-3 px-5  text-sm text-center font-medium border-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors duration-150"
                >
                    Logout
                </button>
            </div>
            {alertVisible && (
                <AlertDialog
                    title="Logout"
                    message="Are you sure you want to logout?"
                    type="Logout"
                    onConfirm={() => {
                        logout();
                        setAlertVisible(false);
                    }}
                    onCancel={() => setAlertVisible(false)}
                />
            )}
        </div>
    );
};

export default SecurityTab;