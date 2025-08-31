import {getSessionUser} from "@/app/actions/session/session-user";
import ProfileWrapper from "@/app/ui/components/profile-components/profile-wrapper";
import {getPosts, PopulatedPost} from "@/app/actions/posts/getPosts";
import {getFollowersCountForUser, getFollowingCountForUser} from "@/app/actions/following/following-commands";

export default async function ProfilePage() {
    const posts = await getPosts();
    const user = await getSessionUser();
    if (!user) return null;

    const usersPosts: PopulatedPost[] = posts.filter((post) => post.author._id === user.id);

    const followers_count = await getFollowersCountForUser(user.id);
    const following_count = await getFollowingCountForUser(user.id);

    return (
        <div className="w-full text-white h-screen flex">
            <ProfileWrapper
                user={user}
                posts={usersPosts}
                followers_count={followers_count}
                following_count={following_count}
                isLoggedUser={true}
            />
        </div>
    );
}
