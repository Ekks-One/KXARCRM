'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/app/server/supabaseClient';

//Skeleton for Profile data from the profiles table
interface ProfileData {
    id: string;
    full_name: string;
    email: string | null;
    role: string | null;
    status: 'active' | 'inactive';
}

export default function SettingsPage() {
    //Stores the currently logged-in user's profile data
    const [profile, setProfile] = useState<ProfileData | null>(null);

    //Stores form field values for personal info
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    //Stores form field values for password change
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    //Displays success or error messages after save actions
    const [saveMessage, setSaveMessage] = useState('');

    //Fetches the user's profile on initial page load
    useEffect(() => {
        fetchProfile();
    }, []);

    //Fetches the signed-in user's profile from the profiles table
    const fetchProfile = async () => {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error('Error fetching user:', userError);
            return;
        }

        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, full_name, email, role, status')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('Error fetching profile:', profileError);
            return;
        }

        //Populates form fields with existing profile data
        setProfile(profileData);
        setFullName(profileData.full_name ?? '');
        setEmail(profileData.email ?? user.email ?? '');
        setRole(profileData.role ?? '');
    };

    //Updates full_name, email, and role in the profiles table, and email in Supabase Auth if changed
    const handleSaveProfile = async () => {
        if (!profile) return;

        const { data, error: profileError } = await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                email: email,
                role: role,
            })
            .eq('id', profile.id)
            .select();

        if (profileError) {
            console.error('Error updating profile:', profileError);
            setSaveMessage('Error saving profile changes: ' + profileError.message);
            return;
        }

        console.log('Profile updated in DB:', data);

        //Also updates email in Supabase Auth if the email field changed
        if (email !== profile.email) {
            const { error: authEmailError } = await supabase.auth.updateUser({ email });
            if (authEmailError) {
                console.error('Error updating auth email:', authEmailError);
                setSaveMessage('Profile saved, but auth email update failed.');
                return;
            }
        }

        //Updates local profile state to reflect the saved changes
        setProfile((prev) => prev ? { ...prev, full_name: fullName, email, role } : prev);
        setSaveMessage('Profile updated successfully.');
        setTimeout(() => setSaveMessage(''), 3000);
    };

    //Validates password fields and updates the password in Supabase Auth
    const handleChangePassword = async () => {
        //Checks both fields are filled before submitting
        if (!newPassword || !confirmPassword) {
            setSaveMessage('Please fill in both password fields.');
            return;
        }

        //Checks passwords match before submitting
        if (newPassword !== confirmPassword) {
            setSaveMessage('Passwords do not match.');
            return;
        }

        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            console.error('Error updating password:', error);
            setSaveMessage('Error updating password: ' + error.message);
            return;
        }

        //Clears password fields after successful update
        setNewPassword('');
        setConfirmPassword('');
        setSaveMessage('Password updated successfully.');
        setTimeout(() => setSaveMessage(''), 3000);
    };

    //Converts a full name into 2-letter initials for the avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">Settings</CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">

                    {/* Profile overview showing current name, email, and role */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium text-lg">
                            {profile ? getInitials(profile.full_name ?? 'U') : '?'}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{profile?.full_name ?? 'Loading...'}</p>
                            <p className="text-sm text-gray-500">{profile?.email ?? ''}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{profile?.role ?? 'Team Member'}</p>
                        </div>
                    </div>

                    {/* Form to edit full name, email, and role */}
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Role</label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                                />
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                {saveMessage && (
                                    <p className="text-sm text-gray-500">{saveMessage}</p>
                                )}
                                <button
                                    onClick={handleSaveProfile}
                                    className="ml-auto bg-gray-900 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form to update the user's password */}
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">Change Password</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                                />
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                {saveMessage && (
                                    <p className="text-sm text-gray-500">{saveMessage}</p>
                                )}
                                <button
                                    onClick={handleChangePassword}
                                    className="ml-auto bg-gray-900 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    Update Password
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                </CardContent>
            </Card>
        </div>
    );
}