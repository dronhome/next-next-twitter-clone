
export default function MyPostsSlider({
    tag,
}: {
    tag: string | undefined,
}) {
    return(
        <div className="w-full text-white">
            <div className="flex flex-col items-center text-center text-lg">
                <div className="font-bold">
                    @{tag} / <span className="text-indigo-400">Posts</span>
                </div>
            </div>
        </div>
    );
}