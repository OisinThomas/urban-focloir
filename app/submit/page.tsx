"use client"
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Submit() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    //scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex items-center justify-center w-full h-[80vh]">
            <div className="bg-white p-12 rounded-md shadow-md max-w-[50vw] w-full text-center">
                {message ? (
                    <p className="text-2xl text-foreground">{message}</p>
                ) : null}
            </div>
        </div>
    );
}
