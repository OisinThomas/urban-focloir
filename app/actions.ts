"use server";

import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function submitEntry(formData: FormData){
    const origin = headers().get("origin");
    const en = formData.get("en") as string;
    const ga = formData.get("ga") as string;
    const text = formData.get("text") as string;
    const supabase = createClient();
    // get the author name and uuid from the session
    const { data: {user}, error: getUserError } = await supabase.auth.getUser();
    if (getUserError) {
        return redirect("/submit?message=Could not authenticate user");
    }

    const authorName = user?.user_metadata.display_name;
    const authorId = user?.id;

    if (!en || !ga || !text) {
      return redirect("/submit?message=All fields are required");
    }

    if (!text.toLowerCase().includes(ga.toLowerCase())) {
      return redirect("/submit?message=Text must contain the Irish word or phrase (ga)");
    }

    // Check if entry exists in searchterms
    const { data: existingSearchTerm, error: searchTermError } = await supabase
      .from("searchterms")
      .select("id")
      .eq("en", en)
      .eq("ga", ga)
      .single();

    let searchTermId;

    if (searchTermError) {
      // If no entry exists, insert a new one
      const { data: newSearchTerm, error: newSearchTermError } = await supabase
        .from("searchterms")
        .insert([{ en: en, ga: ga, author: authorId }])
        .select("id")
        .single();

      if (newSearchTermError) {
        return redirect("/submit?message=Could not submit entry to searchterms");
      }

      searchTermId = newSearchTerm.id;
    } else {
      // Use the existing search term ID
      searchTermId = existingSearchTerm.id;
    }

    // Insert entry into dictionary
    const { error } = await supabase.from("dictionary").insert([{ en, ga, author_name: authorName, text, related_search_term_id: searchTermId, author: authorId }]);

    if (error) {
      return redirect("/submit?message=Could not submit entry to dictionary");
    }

    return redirect("/submit?message=Entry submitted successfully");
  };

  export async function signIn(formData: FormData){
    "use server";
    const supabase = createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/signin?message=Could not authenticate user");
    }

    return redirect("/");
  };