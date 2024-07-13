"use client";
import Card from "@/components/card/Card";
import type { DictionaryEntry } from "@/utils/types";
import { useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';

interface CardHolderProps {
    dictionaryEntries: DictionaryEntry[];
    sourceLanguage: 'en' | 'ga';
}

export default function CardHolder({ dictionaryEntries, sourceLanguage }: CardHolderProps) {
    const searchParams = useSearchParams();

    const entryId = searchParams.get('e');

    const sortedEntries = useMemo(() => {
        if (entryId && dictionaryEntries) {
            const index = dictionaryEntries.findIndex(entry => entry.id === Number(entryId));
            if (index !== -1) {
                const [entryToMove] = dictionaryEntries.splice(index, 1);
                return [entryToMove, ...dictionaryEntries];
            }
        }
        return dictionaryEntries;
    }, [dictionaryEntries, entryId]);

    return (
        <div>
            {sortedEntries.map((entry) => (
                <Card
                    key={entry.id}
                    id={entry.id}
                    source={entry.en}
                    target={entry.ga}
                    text={entry.text}
                    author={entry.author_name}
                    upvote={entry.up_vote}
                    downvote={entry.down_vote}
                    flag={false}
                    sourceLanguage={sourceLanguage}
                />
            ))}
        </div>
    );
}
