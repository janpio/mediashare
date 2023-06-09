import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserIcon } from "~/components/posts/userIcon";
import Sidebar from "~/components/sidebar";
import { api } from "~/utils/api";
import { timeSince } from "../../components/posts/formatTime";
import Image from "next/image";
import Auth from "~/components/auth";
import Like from "~/components/posts/likesCount";
import Comments from "~/components/posts/commentsCount";

type params = {
  commentId: string;
};

function Comment() {
  const params = useRouter().query as params;
  const post = api.posts.getOne.useQuery({ id: params.commentId });

  if (post.isLoading) return <div>Loading...</div>;
  if (post.isError) return <div>Error: {post.error.message}</div>;
  return (
    <>
      <Head>
        <title>Twitter - </title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Sidebar>
          <div
            key={post.data.id + "pst"}
            className="mb-3 rounded border border-gray-200 p-4 shadow-md transition-colors duration-300 hover:bg-gray-200"
          >
            <div className="mb-4 flex flex-row text-gray-600">
              {typeof post.data.User.image == "string" ? (
                <UserIcon
                  User={{
                    followers: post.data.User._count.followers || 0,
                    following: post.data.User._count.following || 0,
                    username: post.data.User.name ?? "",
                    // description: post.data.User. ?? "",
                    id: post.data.User.id,
                    image: post.data.User.image,
                  }}
                  height={40}
                  width={40}
                />
              ) : null}
              <span className="ml-2 text-blue-500">
                <Link href={"/profile/" + (post.data.User.name || "")}>
                  @{post.data.User.name}
                </Link>
              </span>
              <span className="ml-2 text-gray-400">
                • Geplaatst {timeSince(post.data.createdAt)}{" "}
                {post.data.updatedAt.toString() !==
                post.data.createdAt.toString()
                  ? "• Aangepast " + timeSince(post.data.updatedAt)
                  : ""}
              </span>
            </div>
            <p className="mb-2">{post.data.text}</p>
            {typeof post.data.image == "string" ? (
              <Image
                src={post.data.image}
                height={200}
                width={200}
                alt={"Foto"}
              ></Image>
            ) : null}
            <Auth>
              <div className="flex gap-3">
                <Like
                  isLiked={post.data.Like.length > 0}
                  // onClick={() => {
                  //   submit(post.data.id);
                  // }}
                  howManyLikes={post.data._count.Like}
                />
                <Comments
                  hasCommented
                  howManyComments={post.data._count.Comment}
                />
              </div>
            </Auth>
          </div>
        </Sidebar>
      </main>
    </>
  );
}

export default Comment;
