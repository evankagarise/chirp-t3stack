import { SignIn, SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { api, RouterOutputs } from "~/utils/api";
import Image from "next/image";

const CreatePostWizard = () => {
  const {user} = useUser();

  if (!user) return null;


  return( <div className="flex gap-3 w-full">
    <Image 
    width={56} height={56} src={user.profileImageUrl} alt="Profile Image" className="w-14 h-14 rounded-full" />

<input placeholder="Type some emojis" className="bg-transparent grow outline-none" />
  </div>)
}


type PostWithUser = RouterOutputs["posts"]["getAll"][number]

const PostView = (props: PostWithUser) => {
  const {post, author} = props;
return (
  <div className=" border-b border-slate-400 flex p-4 gap-3   " key={post.id}>
    <Image src={author.profilePicture} alt="Profile Image" width={56} height={56} className="w-14 h-14 rounded-full "  />
    <div className="flex flex-col text-slate-200">
      <div><span>{`@${author.username}`}</span> · <span>{`${dayjs(post.createdAt).fromNow()}`}</span></div>
      <span>{post.content}</span> 
    </div>
   
    </div>
)
}

const Home: NextPage = () => {
  const {data, isLoading} = api.posts.getAll.useQuery();

  const user = useUser()

  console.log(user)
  if (isLoading) return <div>Loading...</div>

  if (!data) return <div>Something went wrong</div>
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div className=" h-full w-full md:max-w-2xl border-x border-slate-400">
           <div className="border-b border-slate-400 p-4 ">
      {!user.isSignedIn && <SignInButton   />}{user.isSignedIn && <CreatePostWizard />}
      
     </div>
     <div   >
      {[...data, ...data]?.map((fullPost) => (
      <PostView  {...fullPost} key={fullPost.post.id} />
      ))}
     </div>
        </div>
    

      </main>
    </>
  );
};

export default Home;
