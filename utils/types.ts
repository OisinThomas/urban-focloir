export type DictionaryEntry = {
    author: string;
    id: number;
    related_search_term_id: number;
    en: string;
    ga: string;
    text: string;
    up_vote: number;
    down_vote: number;
    report: number;
    author_name: string;
    last_modified: string; // or Date if you will be using Date objects
    created_at: string; // or Date if you will be using Date objects
    trending: boolean;
  };

export type SearchTerm = {
    id: number;
    en: string;
    ga: string;
    latest_update: string; 
};
  