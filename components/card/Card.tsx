import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import clsx from "clsx";
import "./styles.css";
export default function Component({
  source,
  target,
  text,
  upvote,
  downvote,
  flag,
  author,
  authorId,
  sourceLanguage,
  id,
  createdTimestamp,
  owner,
  handleDeleteEntry,
  isDeleting,
}: {
  source: string;
  target: string;
  text: string;
  upvote: number;
  downvote: number;
  flag: boolean;
  author: string;
  authorId: string;
  sourceLanguage: "en" | "ga";
  id: string;
  createdTimestamp: string;
  owner: boolean;
  handleDeleteEntry: (id: string) => void;
  isDeleting: boolean;
}) {
  const generateTweetLink = (
    source: string,
    sourceLanguage: "en" | "ga",
    id: string
  ) => {
    const url = `http://localhost:3000/search/${sourceLanguage}/${source}?e=${id}`;
    console.log(url);
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(url)}`;
  };

  const [isUpvote, setIsUpvote] = useState(false);
  const [isDownvote, setIsDownvote] = useState(false);
  const [isFlag, setIsFlag] = useState(false);

  async function checkState(entryId: string, authorId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("searchterm-user")
      .select("*")
      .eq("dictionary_id", entryId)
      .eq("user_id", authorId)
      .single();

    if (error) {
      console.error("Failed to fetch entry", error);
    } else {
      console.log("Entry fetched successfully");
      if (data) {
        setIsUpvote(data.upvote);
        setIsDownvote(data.downvote);
        setIsFlag(data.flag);
      }
    }
  }

  useEffect(() => {
    checkState(id.toString(), authorId);
  }, []);


  async function updateState(
    entryId: string,
    authorId: string,
    state: { upvote?: boolean; downvote?: boolean; flag?: boolean }
  ) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("searchterm-user")
      .upsert({ ...state, user_id: authorId, dictionary_id: entryId })
      .eq("dictionary_id", entryId)
      .eq("user_id", authorId)
      .single();

    if (error) {
      console.error("Failed to update entry", error);
    } else {
      console.log("Entry updated successfully");
    }
  }

  async function handleUpvote() {
    setIsUpvote(!isUpvote);
    await updateState(id.toString(), authorId, { upvote: !isUpvote });
  }

  async function handleDownvote() {
    setIsDownvote(!isDownvote);
    await updateState(id.toString(), authorId, { downvote: !isDownvote });
  }

  async function handleFlag() {
    setIsFlag(!isFlag);
    await updateState(id.toString(), authorId, { flag: !isFlag });
  }

  return (
    <Card className="w-full min-w-[450px] max-w-[600px] mx-auto mt-5">
      <CardHeader className="relative flex flex-col">
        <div className="absolute top-10 right-4 mr-4 cursor-pointer">
          <Link
            href={generateTweetLink(source, sourceLanguage, id)}
            passHref={true}
          >
            <XIcon className="w-6 h-6 text-muted-foreground" />
          </Link>
        </div>
        <Link href={`/search/${sourceLanguage}/${source}`}>
          <h1 className="text-4xl font-bold text-teal-700">{source}</h1>
        </Link>
        <Link
          href={`/search/${sourceLanguage == "en" ? "ga" : "en"}/${target}`}
        >
          <h2 className="text-2xl font-bold text-teal-500 italic">{target}</h2>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="list-decimal list-inside space-y-2">
          {text.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </ol>
        <p className="font-bold text-pretty">
          by{" "}
          <span className="text-teal-600">
            <Link href={`/search/author/${authorId}`}>{author}</Link>
          </span>{" "}
          on {new Date(createdTimestamp).toLocaleString()}
        </p>
        <div className="flex justify-between items-center sm:space-y-0">
          <div className="flex space-x-4 items-center">
            <Button
              variant="outline"
              className="flex items-center space-x-2"
              onClick={async () => {
                await handleUpvote();
              }}
            >
              <ThumbsUpIcon
                className={clsx("w-5 h-5", { "fill-black": isUpvote })}
              />
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2"
              onClick={async () => {
                await handleDownvote();
              }}
            >
              <ThumbsDownIcon
                className={clsx("w-5 h-5", { "fill-black": isDownvote })}
              />
            </Button>
            {owner && (
              <Button
                variant="outline"
                className="flex items-center space-x-2 border-slate-500 text-slate-500 hover:bg-slate-100 hover:border-slate-700"
                onClick={() => handleDeleteEntry(id)}
                disabled={isDeleting}
              >
                <FiTrash2 className="w-5 h-5" />
                <span>Delete</span>
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            className="flex items-center space-x-2 mt-0"
            onClick={async () => {
              await handleFlag();
            }}
          >
            <FlagIcon className={clsx("w-5 h-5", { "fill-red": isFlag })} />
            <span>FLAG</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FlagIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  );
}

function ThumbsDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}

function ThumbsUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg {...props} width="24px" height="24px" viewBox="0 0 24 24">
      <path d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717  l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339  l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z" />
    </svg>
  );
}
