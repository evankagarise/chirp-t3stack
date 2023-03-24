import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { RouterOutputs } from "~/utils/api";
type PostWithUser = RouterOutputs["posts"]["getAll"][number]

export const PostView = (props: PostWithUser) => {
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