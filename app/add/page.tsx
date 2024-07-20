'use client';

import { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { submitEntry } from '../actions';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

export default function ClientComponent({ searchParams }: { searchParams: { message: string } }) {
  const [message, setMessage] = useState(searchParams?.message || "");
  const [isLoggedIn, setLoggedIn] = useState<boolean>(true);
  const router = useRouter();
  useEffect(() => {
    const checkAuthStatus = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setLoggedIn(!!user);
    };
    checkAuthStatus();
  }, []);

  return (
    <div className="bg-teal-800 flex w-full h-fit justify-center py-8">
      {!isLoggedIn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
        </div>
      )}
      <div className={clsx(
        "bg-white p-12 rounded-md shadow-md max-w-[50vw] w-full h-fit relative",
        { 'blur-sm bg-opacity-50': !isLoggedIn }
      )}>
        <p className="text-2xl mb-4">
          All the definitions on <span className="font-bold">An Urban Foclóir</span> were written by gaeilgeoirí just like you. Cuir leis a bhfuil anseo!
        </p>
        <p className="text-2xl mb-4">
          Please review An Urban Foclóir's content{" "}
          <a href="#" className="text-blue-600 underline">guidelines</a> before writing your definition. Here's the short version:{" "}
          <span className="font-bold">
            Share definitions that other people will find meaningful and never post hate speech or people’s personal information. Let's preserve and grow our culture together!
          </span>
        </p>
        <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground" action={isLoggedIn ? submitEntry : undefined}>
          <Textarea
            placeholder="Type the Irish word or phrase you'd like to define..."
            className="w-full mb-4 h-24 bg-gray-100 text-2xl"
            required
            id="ga"
            name="ga"
            disabled={!isLoggedIn}
          />
          <Textarea
            placeholder="Type the English translation of the word or phrase you'd like to define..."
            className="w-full mb-4 h-24 bg-gray-100 text-2xl"
            required
            id="en"
            name="en"
            disabled={!isLoggedIn}
          />
          <p className="text-2xl mb-4">
            <span className="font-bold">Write for a large audience.</span> <span className="font-bold">Don't name your friends.</span> We'll reject inside jokes and definitions naming non-celebrities.
          </p>
          <Textarea
            placeholder="Type your definition and example of how it's used in a sentence..."
            className="w-full mb-4 h-24 bg-gray-100 text-2xl"
            required
            id='text'
            name="text"
            disabled={!isLoggedIn}
          />
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-md text-2xl"
            disabled={!isLoggedIn}
          >
            Submit
          </button>
          {message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {message}
            </p>
          )}
        </form>
        <p className="text-xl mt-4 text-gray-500">
          Definitions are subject to our{" "}
          <a href="#" className="text-blue-600 underline">terms of service</a> and{" "}
          <a href="#" className="text-blue-600 underline">privacy policy</a>.
        </p>
      </div>
    </div>
  );
}