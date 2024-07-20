"use client";
import Card from "@/components/card/Card";
import type { DictionaryEntry } from "@/utils/types";
import { useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
interface CardHolderProps {
  dictionaryEntries: DictionaryEntry[];
  sourceLanguage: "en" | "ga";
  owner?: boolean;
}

export default function CardHolder({
  dictionaryEntries,
  sourceLanguage,
  owner = false,
}: CardHolderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const entryId = searchParams.get("e");

  const sortedEntries = useMemo(() => {
    if (entryId && dictionaryEntries) {
      const index = dictionaryEntries.findIndex(
        (entry) => entry.id === Number(entryId)
      );
      if (index !== -1) {
        const [entryToMove] = dictionaryEntries.splice(index, 1);
        return [entryToMove, ...dictionaryEntries];
      }
    }
    return dictionaryEntries;
  }, [dictionaryEntries, entryId]);

  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  const handleDeleteEntry = async (entryId: number) => {
    setIsDeleting(true);
    const { error } = await supabase
      .from("dictionary")
      .delete()
      .eq("id", entryId);

    if (error) {
      console.error("Failed to delete entry", error);
    } else {
      // Handle successful deletion (e.g., show a success message, refresh data, etc.)
      console.log("Entry deleted successfully");
      sortedEntries.splice(
        sortedEntries.findIndex((entry) => entry.id === entryId),
        1
      );
    }
    setIsDeleting(false);
  };

  console.log(sortedEntries);
  console.log(sortedEntries.length);
  if (sortedEntries.length === 0) {
    return (
      <div className="flex items-center justify-center w-full min-h-[70vh] py-12">
        <div className="bg-white p-8 rounded-md shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">
            There are no entries currently.
          </h2>
          <p className="mb-4">Please add to the knowledge!</p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => {
                // Redirect to login or signup page
                router.push("/add");
              }}
              className="w-full bg-teal-600 text-white py-2 rounded-md text-2xl"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      {sortedEntries.map((entry) => (
        <Card
          key={entry.id}
          id={entry.id}
          source={entry[`${sourceLanguage}`]}
          target={entry[`${sourceLanguage === "en" ? "ga" : "en"}`]}
          text={entry.text}
          author={entry.author_name}
          authorId={entry.author}
          upvote={entry.up_vote}
          downvote={entry.down_vote}
          flag={false}
          sourceLanguage={sourceLanguage}
          createdTimestamp={entry.created_at}
          owner={owner}
          handleDeleteEntry={handleDeleteEntry}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}
