import { createClient } from "@/utils/supabase/server";
import type { DictionaryEntry } from "@/utils/types";
import CardHolder from "@/components/card/CardHolder";
export default async function SearchIrish({
    params,
}: {
    params: { term: string }
}) {

    async function lookupIrishWord(term: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("dictionary")
            .select("*")
            .eq("ga", decodeURI(term))
        return { data, error };
    }

    let entries: DictionaryEntry[] | [] = [];
    const { data, error } = await lookupIrishWord(params.term);

    if (error || !data) {
        return <div>Error: {JSON.stringify(error)}</div>
    }

    entries = data;

    return (
        <CardHolder dictionaryEntries={entries} sourceLanguage="ga" />
    );
};
