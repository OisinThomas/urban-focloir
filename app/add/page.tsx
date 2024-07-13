import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function DictionaryEntryForm({ searchParams }: { searchParams: { message: string } }) {
    const submitEntry = async (formData: FormData) => {
        "use server";
    
        const origin = headers().get("origin");
        const en = formData.get("en") as string;
        const ga = formData.get("ga") as string;
        const authorName = formData.get("authorName") as string;
        const text = formData.get("text") as string;
        const supabase = createClient();
    
        if (!en || !ga || !authorName || !text) {
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
            .insert([{ en, ga }])
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
        const { error } = await supabase.from("dictionary").insert([{ en, ga, author_name: authorName, text, related_search_term_id: searchTermId }]);
    
        if (error) {
          return redirect("/submit?message=Could not submit entry to dictionary");
        }
    
        return redirect("/submit?message=Entry submitted successfully");
      };

  return (
    <div className="bg-teal-800 flex w-full h-[100vh] justify-center py-8">
      <div className="bg-white p-12 rounded-md shadow-md max-w-[50vw] w-full h-fit">
        <p className="text-2xl mb-4">
          All the definitions on <span className="font-bold">An Urban Foclóir</span> were written by gaeilgeoirí just like you. Cuir leis a bhfuil anseo!
        </p>
        <p className="text-2xl mb-4">
          Please review An Urban Foclóir's content{" "}
          <a href="#" className="text-blue-600 underline">guidelines</a> before writing your definition. Here's the short version:{" "}
          <span className="font-bold">
            Share definitions that other people will find meaningful and never post hate speech or people’s personal information. Let's preserve and grow our culture together!
          </span>
        </p>
        <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground" action={submitEntry}>
          <Textarea
            placeholder="Type the Irish word or phrase you'd like to define..."
            className="w-full mb-4 h-24 bg-gray-100 text-2xl"
            required
            id="ga"
            name="ga"
          />
          <Textarea
            placeholder="Type the English translation of the word or phrase you'd like to define..."
            className="w-full mb-4 h-24 bg-gray-100 text-2xl"
            required
            id="en"
            name="en"
          />
          <p className="text-2xl mb-4">
            <span className="font-bold">Write for a large audience.</span> <span className="font-bold">Don't name your friends.</span> We'll reject inside jokes and definitions naming non-celebrities.
          </p>
          <Textarea
            placeholder="Type your definition and example of how it's used in a sentence..."
            className="w-full mb-4 h-24 bg-gray-100 text-2xl"
            required
            id='text'
            name="text"
          />
          <Input
            type="text"
            placeholder="Write your name here"
            className="w-full mb-4 h-12 bg-gray-100 text-2xl"
            required
            id="authorName"
            name="authorName"
          />
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-md text-2xl"
          >
            Submit
          </button>
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        </form>
        <p className="text-xl mt-4 text-gray-500">
          Definitions are subject to our{" "}
          <a href="#" className="text-blue-600 underline">terms of service</a> and{" "}
          <a href="#" className="text-blue-600 underline">privacy policy</a>.
        </p>
      </div>
    </div>
  );
}
