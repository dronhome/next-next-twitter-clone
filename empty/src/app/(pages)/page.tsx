import {getPosts} from "@/app/actions/posts/getPosts";
import {getSessionUser} from "@/app/actions/session/session-user";
import FeedWrapper from "@/app/ui/components/feed-components/feed-wrapper";
import {getAllFollowers} from "@/app/actions/following/following-commands";

export default async function Home() {
    const posts = await getPosts();
    const user = await getSessionUser();
    const followersList = await getAllFollowers();
    if (!user) throw new Error("Unexpected null user")

    return(
        <FeedWrapper
            user={user}
            posts={posts}
            followersList={followersList}
        />
    );
}
