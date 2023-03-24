import { SignIn, SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { api, RouterOutputs } from "~/utils/api";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/Loading";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLoyout } from "~/components/layout";

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext()
  const {mutate, isLoading: isPosting} = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate()
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if (errorMessage && errorMessage[0]) {
          toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later")
      }
    
    }
   });

  if (!user) return null;


  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })}>Post</button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};


type PostWithUser = RouterOutputs["posts"]["getAll"][number]

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className=" border-b border-slate-400 flex p-4 gap-3   " key={post.id}>
       <Link href={`/@${author.username}`}>

        <Image src={author.profilePicture} alt="Profile Image" width={56} height={56} className="w-14 h-14 rounded-full " />
       </Link>
      

      <div className="flex flex-col text-slate-200">
        <div>
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
        
        <Link href={`/post/${post.id}`}>
         <span> </span> · <span>{`${dayjs(post.createdAt).fromNow()}`}</span>
        </Link>
          
           
           </div>

        <span className="text-xl">{post.content}</span>
      </div>

    </div>
  )
}
const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading)
    return (
      <div className="flex grow">
        <LoadingPage />
      </div>
    );

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex grow flex-col overflow-y-scroll">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};
const Home: NextPage = () => {

const {isLoaded: userLoaded, isSignedIn} = useUser()
  api.posts.getAll.useQuery();

  

  if (!userLoaded) return <div />;

  
 


  return (
    <>
      
      <PageLoyout>
        <div className="flex border-b border-slate-400 p-4">
           {!isSignedIn && <SignInButton />}{isSignedIn && <CreatePostWizard />}
        </div>

         
          <Feed />
      </PageLoyout>
          

        
    </>
  );
};

export default Home;
