import { createClient } from "@/utils/supabase/server";
import type { DictionaryEntry } from "@/utils/types";
import CardHolder from "@/components/card/CardHolder";
export default async function AuthorEntries({
  params,
}: {
  params: { id: string };
}) {
  let entries: DictionaryEntry[] | [] = [];
  async function lookupEnglishWord(id: string) {
    const supabase = createClient();

    // get current user
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();

    if (getUserError) {
    } else {
      const authorId = user?.id;
    }

    const { data, error } = await supabase
      .from("dictionary")
      .select("*")
      .eq("author", id);
    return { data, error };
  }

  async function checkAuthor(userId: string): Promise<boolean> {
    const supabase = createClient();

    // get current user
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();

    if (getUserError) {
      return false;
    }

    const authorId = user?.id;

    return authorId === userId;
  }

  console.log("params", params);
  const { data, error } = await lookupEnglishWord(params.id);
  const isAuthor = await checkAuthor(params.id);

  if (error || !data) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  entries = data;

  return (
    <CardHolder dictionaryEntries={entries} sourceLanguage="en" owner={isAuthor} />
  );
}
