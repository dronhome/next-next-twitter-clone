"use client"

import SearchBar from "../../ui/components/search-components/serach-bar";
import {useState} from "react";
import {useUserSearch} from "@/app/lib/useUserSearch";
import UsersList from "@/app/ui/components/search-components/usersList";

export default function SearchPage() {
    const [term, setTerm] = useState("");
    const { users, loading, error } = useUserSearch(term);

    return(
        <div className="">
            <SearchBar term={term} onTermChange={setTerm} />

            {error   && <p className="text-red-400">{error}</p>}

            <UsersList users={users} />
        </div>
    );
}