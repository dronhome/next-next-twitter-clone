import {getPostById} from "@/app/actions/posts/getPosts";
import PostCard from "@/app/ui/components/feed-components/post-card";
import TopHeading from "@/app/ui/components/navigation-components/top-heading";
import BackButton from "@/app/ui/components/navigation-components/back-btn";
import CommentsSection from "@/app/ui/components/individual-post-components/comment-section";
import {getPostComments} from "@/app/actions/comments/getPostComments";
import {getSessionUser, getUserById} from "@/app/actions/session/session-user";
import {CommentAndUser, PopulatedComment} from "@/app/models/dto/comment-dto";


interface commentSlugPageProps {
    params: {
        postId: string
    };
}

export default async function commentsPage({ params }: commentSlugPageProps ) {
    const { postId } = params;
    const post = await getPostById(postId);
    const currentUser = await getSessionUser();
    const postComments = await getPostComments(postId);

    if (
        !post ||
        !currentUser ||
        postComments.postComments == null
    ) return null;

    const commentsAndUsers: CommentAndUser[] = await Promise.all(
        postComments.postComments.map(async (comment: PopulatedComment) => {
            const user = await getUserById(comment.userId);
            if (!user) throw new Error(`User ${comment.userId} not found`);
            return { comment, user };
        })
    );

    return(
        <div className={"w-full flex h-screen flex-col text-white pt-4"}>
            <BackButton/>
            <TopHeading
                id={post.author._id}
                tag={post.author.tag}
                pageType={"Post"}
            />
            <PostCard
                post={post}
                modifiable={undefined}
                loggedUserId={currentUser.id}
                isPostPage={true}
            />
            <CommentsSection
                postId={post._id}
                currentUser={currentUser}
                commentsAndUsers={commentsAndUsers}
                classes={"flex-1 min-h-0"}
            />
        </div>
    )
}