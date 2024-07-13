import React from 'react';
import SearchBar from './SearchBar';

export default function Header() {
    return (
        <div className='pb-4 pt-4 bg-gradient-to-r from-green-400 to-blue-500 h-auto sm:h-40 md:h-20 flex flex-col sm:flex-row items-center justify-center text-white text-2xl font-bold shadow-md relative px-4'>
            <div className='w-full text-center mb-2 sm:mb-0 sm:absolute sm:left-4 sm:text-left'>
                <span className='lg:visible md:text-lg lg:text-2xl'>an urban foclóir</span>
            </div>
            <div className='w-full max-w-md px-4'>
                <SearchBar />
            </div>
        </div>
    );
}
