"use client";
import { useState, useEffect, useRef } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from '@/components/ui/command';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import type { SearchTerm } from '@/utils/types';
import HighlightedText from './HighlightedText';

export default function SearchBar() {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<SearchTerm[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const commandRef = useRef<HTMLDivElement>(null);
    type BaseLanguage = 'en' | 'ga';
    const [baseLanguage, setBaseLanguage] = useState<BaseLanguage>('en');
    const router = useRouter();

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length === 0 || query === '') {
                setResults([]);
                return;
            }
            setLoading(true);
            const supabase = createClient();
            const { data, error } = await supabase
                .rpc(`searchterms_${baseLanguage}`, { search_term: query });
            if (error) {
                console.error(error);
                setResults([]);
            } else {
                if (!data) {
                    setResults([]);
                }
                else {
                    setResults(data.slice(0, 5));
                }
            }
            setLoading(false);
        };

        fetchResults();
    }, [query, baseLanguage]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [commandRef]);

    return (
        <div ref={commandRef} className="relative w-full max-w-full sm:max-w-[600px] flex flex-col sm:flex-row">
            <Command className='w-full sm:w-[400px]'>
                <CommandInput
                    className='w-full sm:w-[400px]'
                    placeholder="Search terms..."
                    value={query}
                    onClick={() => setIsOpen(true)}
                    onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setQuery(e.target.value);
                    }} />
                {isOpen && (
                    <CommandList className='absolute w-full sm:w-[400px] top-full left-0 right-0 z-50 bg-white shadow-lg mt-2'>
                        {results.length > 0 ? (
                            results.map((term) => {
                                const otherLanguage = baseLanguage === 'en' ? 'ga' : 'en';
                                const source = term[baseLanguage];
                                const target = term[otherLanguage];
                                return (
                                    <div
                                        className="prelative flex flex-col cursor-pointer select-none rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                        key={term.id}
                                        onClick={() => {
                                            setIsOpen(false);
                                            router.push(`/search/${baseLanguage}/${encodeURIComponent(source)}`);
                                        }}
                                    >
                                        <span><HighlightedText text={source} highlight={query} /></span>
                                        <span className='italic ml-2 text-xs overflow-hidden text-ellipsis'>{target}</span>
                                    </div>
                                );
                            })
                        ) : query.length > 0 ? (
                            <CommandEmpty>
                                <span>Press <kbd>+</kbd> to add a new term</span>
                            </CommandEmpty>
                        ) : null}
                    </CommandList>
                )}
            </Command>
            <div className="flex flex-col sm:flex-row mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto md:items-center">
                <Button onClick={() => {
                    router.push('/add');
                }} variant="secondary" className="mb-2 sm:mb-0 sm:mr-2">
                    +
                </Button>
                <Button onClick={() => {
                    setBaseLanguage(baseLanguage === 'en' ? 'ga' : 'en');
                }} variant="default">
                    {baseLanguage === 'en' ? 'en→ga' : 'ga→en'}
                </Button>
            </div>
        </div>
    );
};
