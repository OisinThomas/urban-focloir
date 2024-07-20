import React from 'react';
import SearchBar from './SearchBar';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';

export default function Header() {
    return (
        <div className='pb-4 pt-4 bg-gradient-to-r from-green-400 to-blue-500 h-auto sm:h-40 md:h-20 flex flex-col sm:flex-row items-center justify-between text-white text-2xl font-bold shadow-md px-4'>
            <div className='flex-1 text-left'>
                <Link href="/" className='md:text-lg lg:text-2xl'>an urban foclóir</Link>
            </div>
            <div className='flex-1 flex justify-center pb-2'>
                <div className='w-full max-w-md px-4'>
                    <SearchBar />
                </div>
            </div>
            <div className='flex-1 flex justify-end'>
                <Link href="/account">
                    <FaUserCircle className='w-8 h-8 text-white hover:text-gray-300' />
                </Link>
            </div>
        </div>
    );
}