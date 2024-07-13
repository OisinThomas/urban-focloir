import { createClient } from "@/utils/supabase/server";
import type { DictionaryEntry } from "@/utils/types";
import CardHolder from "@/components/card/CardHolder";
export default async function SearchEnglish({
    params,
}: {
    params: { term: string }
}) {

    let entries: DictionaryEntry[] | [] = [];
    async function lookupEnglishWord(term: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("dictionary")
            .select("*")
            .eq("en", decodeURI(term));
        return { data, error };
    }


    const { data, error } = await lookupEnglishWord(params.term);

    if (error || !data) {
        return <div>Error: {JSON.stringify(error)}</div>
    }

    entries = data;

    return (
        <CardHolder dictionaryEntries={entries} sourceLanguage="en" />
    );
};
