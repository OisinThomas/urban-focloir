"use client"
import { useSearchParams } from 'next/navigation';

export default function Submit() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    return (
        <div className="flex items-center justify-center w-full h-[100vh]">
            <div className="bg-white p-12 rounded-md shadow-md max-w-[50vw] w-full text-center">
                {message ? (
                    <p className="text-2xl text-foreground">{message}</p>
                ) : (
                    <p className="text-2xl text-foreground">No message to display.</p>
                )}
            </div>
        </div>
    );
}
