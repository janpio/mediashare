// ui
import Image from "next/image";
// user session
import { useSession } from "next-auth/react";
// form
import { useDebouncedState } from "@mantine/hooks";
import { api } from "~/utils/api";
// file upload
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "~/server/uploadthing";
import { useCookies } from "react-cookie";

import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
export const CreatePost = () => {
  const { data: session } = useSession();
  const startUploadRef = useRef<(() => void) | null>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useDebouncedState("", 200);
  const [howManyFiles, setHowManyFiles] = useState(0);
  const [, setCookies, removeCookies] = useCookies(["post"]);
  const createPost = api.posts.create.useMutation({
    onMutate: () => {
      toast.loading("Creating post...", { id: "createPost" });
      if (textArea.current) textArea.current.value = "";
    },
    onError: (error) => {
      toast.error("Error creating post: " + error.message, {
        id: "createPost",
        duration: 2000,
      });
    },
    onSuccess: (res) => {
      if (howManyFiles > 0) {
        setCookies("post", res.id, {
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        if (startUploadRef.current) return startUploadRef.current();
      }
      toast.success("Post created!", { id: "createPost", duration: 2000 });
      setMessage("");
    },
  });
  const tweet = () => {
    createPost.mutate({ text: message });
  };
  const handleStartUpload = (startUpload: () => void) => {
    startUploadRef.current = startUpload;
  };
  return (
    <div>
      <div className="flex flex-row text-gray-800 placeholder:text-5xl">
        {typeof session?.user.image == "string" ? (
          <div>
            <Image
              src={session.user.image}
              alt={"Image"}
              width={40}
              height={40}
              className={"rounded-full"}
            ></Image>
          </div>
        ) : null}
        <textarea
          className="mb-2 ml-6 w-full rounded border p-1.5"
          placeholder="What is happening?"
          ref={textArea}
          onInput={(e) => setMessage(e.currentTarget.value)}
          disabled={createPost.isLoading}
        ></textarea>
      </div>
      <UploadButton<OurFileRouter>
        endpoint="postUploader"
        startUpload={handleStartUpload}
        onClientUploadComplete={() => {
          // Do something with the response
          removeCookies("post");
          toast.success("Post created!", { id: "createPost", duration: 2000 });
          setMessage("");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message} ${JSON.stringify(error)}`);
          removeCookies("post");
          toast.error("Error creating post: " + error.message, {
            id: "createPost",
            duration: 2000,
          });
        }}
        files={(numberOfFiles) => {
          setHowManyFiles(numberOfFiles);
        }}
        disabled={createPost.isLoading}
      />
      <button
        onClick={tweet}
        className="rounded bg-[#1D9BF9] px-4 py-2 text-white transition-colors duration-200 hover:bg-[#47aefc]"
      >
        Tweet
      </button>
    </div>
  );
};
