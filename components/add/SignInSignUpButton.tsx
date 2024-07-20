"use client";
import React from 'react'
import { useRouter } from 'next/navigation';
export default function SignInSignUpButton() {
    const router = useRouter();
  return (
    <div className="absolute inset-0 flex justify-center items-center">
    <div className="absolute inset-0 flex justify-center items-center bg-white p-8 rounded-md shadow-md max-w-sm w-full">
      <h2 className="text-2xl mb-4">Log in or Sign up</h2>
      <p className="mb-4">You need to be logged in to submit a definition. Please log in or sign up to continue.</p>
      <button
        onClick={() => {
          // Redirect to login or signup page
          router.push("/login");
        }}
        className="w-full bg-teal-600 text-white py-2 rounded-md text-2xl"
      >
        Log in / Sign up
      </button>
    </div>
  </div>
  )
}