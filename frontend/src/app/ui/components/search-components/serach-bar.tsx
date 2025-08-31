import { SearchIcon } from "lucide-react";

interface SearchBarProps {
    term: string;
    onTermChange: (term: string) => void;
}

export default function SearchBar({ term, onTermChange }: SearchBarProps) {

    return(
        <div className="flex w-full text-white">
            <div className="w-full relative m-2">
                <div className="flex justify-start absolute px-4 py-2 text-white/50 w-1/6">
                    <SearchIcon/>
                </div>
                <input
                    id="name"
                    name="name"
                    value={term}
                    placeholder="Search"
                    onChange={e => onTermChange(e.currentTarget.value)}
                    className="border-white/50 bg-indigo-400/20 pr-4 pl-[17%] py-2 w-full rounded-lg hover:bg-indigo-400/10"
                />
            </div>
        </div>
    )
}
