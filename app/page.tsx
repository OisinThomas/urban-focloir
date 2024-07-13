import { createClient } from "@/utils/supabase/server";
import type { DictionaryEntry } from "@/utils/types";
import CardHolder from "@/components/card/CardHolder";

export default async function Index() {

  let entries: DictionaryEntry[] | [] = [];

  async function getRandomTrendingEntry() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("dictionary")
      .select("*")
      .eq("trending", true)
      .limit(1);
    return { data, error };
  }

  const { data, error } = await getRandomTrendingEntry();

  if (error || !data) {
    return <div>Error: {JSON.stringify(error)}</div>
  }

  entries = data;

  return (
    <CardHolder dictionaryEntries={entries} sourceLanguage="ga" />
  );
};
