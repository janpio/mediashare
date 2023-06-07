import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Sidebar from "~/components/sidebar";
import EditProfileModal from "~/components/profile/editProfileModal";
import { AiOutlineLink } from "react-icons/ai";
import { BsCalendarDate } from "react-icons/bs";
import { api } from "~/utils/api";
import Link from "next/link";
import DeleteProfile from "~/components/profile/deleteProfile";

type params = {
  userName: string;
};

const PageContent: NextPage = () => {
  const { data: session } = useSession();
  const params = useRouter().query as params;
  const users = api.profile.get.useQuery(params.userName);

  return (
    <>
      <Head>
        <title>Twitter - {params.userName}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Sidebar>
          <div className="overflow flex h-full w-full justify-center">
            <div className="relative m-2 w-full max-w-[1546px] bg-white shadow-md">
              <div className="flex h-1/3 max-h-[432px] items-start justify-center bg-slate-600">
                <Image
                  src={
                    "https://images.pexels.com/photos/573130/pexels-photo-573130.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  }
                  alt={"Image"}
                  width={1546}
                  height={432}
                  className={"max-h-full object-scale-down "}
                />
                {typeof session?.user.image == "string" ? (
                  <Image
                    src={session?.user.image}
                    height={200}
                    width={200}
                    alt={"Foto"}
                    className="absolute left-4 mt-64 h-32 w-32 rounded-full border-4 border-white bg-white"
                  />
                ) : null}
              </div>
              <div className="flex items-center">
                <div className="ml-5 mt-16">
                  <div className="text-2xl">{users.data?.username}</div>
                  <div className="mt-2">
                    {users.data?.status != null && users.data?.status}
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center">
                      <AiOutlineLink />
                      <Link
                        href="google.com"
                        className="text-blue-500 hover:underline"
                      >
                        google.com
                      </Link>
                    </div>

                    <div className="flex items-center justify-center gap-1">
                      <BsCalendarDate />
                      <span>
                        {users.data?.createdAt != null &&
                          users.data?.createdAt.toDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-1xl flex gap-2">
                    <span className="cursor-pointer text-black hover:underline">
                      <span className="font-bold">
                        {users.data?._count.following}
                      </span>{" "}
                      following
                    </span>
                    <span className="cursor-pointer text-black hover:underline">
                      <span className="font-bold">
                        {users.data?._count.followers}
                      </span>{" "}
                      followers
                    </span>
                  </div>
                </div>
                <div className="flex flex-grow items-center justify-end">
                  {users.isSuccess && <EditProfileModal user={users.data} />}
                  {session?.user.role == "ADMIN" ? (
                    <>
                      <DeleteProfile />
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="mt-10 flex justify-between">
                <button className="flex-1 px-5 py-4 text-center text-gray-500 transition-colors duration-200 hover:bg-gray-200 focus:outline-none">
                  Tweets
                </button>
                <button className="flex-1 px-5 py-4 text-center text-gray-500 transition-colors duration-200 hover:bg-gray-200 focus:outline-none">
                  Media
                </button>
                <button className="flex-1 px-5 py-4 text-center text-gray-500 transition-colors duration-200 hover:bg-gray-200 focus:outline-none">
                  Likes
                </button>
              </div>
            </div>
          </div>
        </Sidebar>
      </main>
    </>
  );
};

export default PageContent;
