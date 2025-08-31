export default function PostIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.2"
            stroke="url(#myGradient)"
            className="w-10 h-10"
        >
            <defs>
                <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4f46e5" />   {/* indigo-500 */}
                    <stop offset="50%" stopColor="#8b5cf6" />   {/* purple-500 */}
                    <stop offset="100%" stopColor="#ec4899" />  {/* pink-500 */}
                </linearGradient>
            </defs>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    )
}