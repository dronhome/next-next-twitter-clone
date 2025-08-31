import {getRawSession, getUserById} from "@/app/actions/session/session-user";
import {redirect} from "next/navigation";
import ProfileWrapper from "@/app/ui/components/profile-components/profile-wrapper";
import {getPosts, PopulatedPost} from "@/app/actions/posts/getPosts";
import {getFollowersCountForUser, getFollowingCountForUser} from "@/app/actions/following/following-commands";

interface ProfileSlugPageProps {
    params: {
        id: string;
    };
}

export default async function ProfileSlugPage({ params }: ProfileSlugPageProps) {
    const { id } = params;
    const user = await getUserById(id);
    const rawSession= await getRawSession();
    const loggedUserId = rawSession?.userId;

    if (!loggedUserId || !user) {
        return null;
    }

    const posts = await getPosts();
    const usersPosts: PopulatedPost[] = posts.filter((post) => post.author._id === user.id);

    const followers_count = await getFollowersCountForUser(user.id);
    const following_count = await getFollowingCountForUser(user.id);

    console.log(following_count);

    if (loggedUserId === id) {
        redirect("/profile");
    } else {
        return (
            <div className="w-full text-white h-screen flex">
                <ProfileWrapper
                    user={user}
                    posts={usersPosts}
                    followers_count={followers_count}
                    following_count={following_count}
                    isLoggedUser={false}
                />
            </div>

        );
    }
}
