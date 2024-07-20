"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import SignInSignUpButton from '@/components/add/SignInSignUpButton';
import Link from 'next/link';

export default function Account() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUsernameConfirm, setShowUsernameConfirm] = useState(false);
  const [showNotLoggedIn, setShowNotLoggedIn] = useState(true);
  const [entries, setEntries] = useState([]);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setDisplayName(user?.user_metadata?.display_name || '');
        setNewDisplayName(user?.user_metadata?.display_name || '');
        fetchEntries(user.id);
      }
    };

    const fetchEntries = async (userId) => {
      const { data, error } = await supabase
        .from('dictionary')
        .select('*')
        .eq('author', userId)
        .order('created_at', { ascending: false });

      if (!error) {
        setEntries(data);
      }
    };

    fetchUser();
  }, []);

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    if (error) {
      setMessage('Failed to send password reset email.');
    } else {
      setMessage('Password reset email sent.');
    }
  };

  const handleUsernameChange = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { display_name: newDisplayName },
    });
    if (error) {
      setMessage('Failed to update username.');
    } else {
      setMessage('Username updated successfully.');
      setDisplayName(newDisplayName);
      setShowUsernameConfirm(false);
    }
  };

  const handleDeleteAccount = async () => {
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error) {
      setMessage('Failed to delete account.');
    } else {
      await supabase.auth.signOut();
      router.push('/');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center w-full min-h-[70vh] py-12">
      {user ? (
        <div className="flex flex-col md:flex-row items-start justify-center w-full gap-8 flex-wrap">
          <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Account Settings</h2>
            {message && <p className="text-center mb-4">{message}</p>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowUsernameConfirm(true);
              }}
              className="mb-4"
            >
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="username">
                Change Username
              </label>
              <input
                className="block w-full p-2 mb-4 border rounded-md"
                type="text"
                id="username"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full"
              >
                Update Username
              </button>
            </form>
            <button
              onClick={handlePasswordReset}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full w-full mb-4"
            >
              Reset Password
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full w-full mb-4"
            >
              Delete Account
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full w-full"
            >
              Log Out
            </button>
          </div>
          <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Your Stats</h2>
            <p className="mb-4 text-center">
              <span className="font-bold">Your Entries: </span>{entries.length}
            </p>
            <h3 className="text-xl font-bold mb-4">Latest Activity:</h3>
            <ul>
              {entries.slice(0, 5).map((entry) => (
                <li key={entry.id} className="mb-2">
                  <span className="italic">{entry.ga}</span> -> <span className="italic">{entry.en}</span>
                  <br />
                  <span className="text-xs text-gray-500">{new Date(entry.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <Link className="text-blue-500 hover:text-blue-700 self-center" href={`/search/author/${user.id}`}>View all entries</Link>
          </div>
          {showDeleteConfirm && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-md shadow-md w-full max-w-sm text-center">
                <p className="mb-4">Are you sure you want to delete your account?</p>
                <div className="flex justify-around">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-slate-600 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-full"
                  >
                    No
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-slate-300 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}
          {showUsernameConfirm && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-md shadow-md w-full max-w-sm text-center">
                <p className="mb-4">Are you sure you want to update your username?</p>
                <div className="flex justify-around">
                  <button
                    onClick={() => setShowUsernameConfirm(false)}
                    className="bg-slate-600 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-full"
                  >
                    No
                  </button>
                  <button
                    onClick={handleUsernameChange}
                    className="bg-slate-300 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
          <div className="bg-white p-8 rounded-md shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">You are not logged in</h2>
            <p className="mb-4">Please sign up or sign in to continue.</p>
            <div className="flex space-x-4 justify-center">
            <button
        onClick={() => {
          // Redirect to login or signup page
          router.push("/login");
        }}
        className="w-full bg-teal-600 text-white py-2 rounded-md text-2xl"
      >
        Sign up
      </button>
      <button
        onClick={() => {
          // Redirect to login or signup page
          router.push("/login");
        }}
        className="w-full bg-teal-600 text-white py-2 rounded-md text-2xl"
      >
        Log in
      </button>
            </div>
          </div>
      )}
    </div>
  );
}