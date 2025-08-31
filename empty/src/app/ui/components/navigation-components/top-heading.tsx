import Link from "next/link";


export default function TopHeading( { id, tag, pageType, classes }: { id: string, tag: string | undefined, pageType: string, classes?: string } ) {
    return(
        <div className={`w-full flex flex-col items-center text-center ${classes}`}>
            <div className="font-bold flex text-lg gap-1">

                    <Link
                        href={`/profile/${id}`}
                        className={"hover:opacity-75"}
                    >
                        @{tag}
                    </Link>

                    <div>
                        /
                    </div>

                    <span className="text-indigo-400">
                        {pageType}
                    </span>

            </div>
        </div>
    )
}