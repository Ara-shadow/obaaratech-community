import api from "../api/axios";

import type {Post} from "../types/post";


export default function PostCard(
{
post,
refresh
}:{
post:Post,
refresh:()=>void
}){


async function like(){

await api.post(
`/posts/${post.id}/like`
);

refresh();

}



return (

<div className="post-card">


<h3>

{post.author.name}

</h3>


<p>

{post.content}

</p>



<button onClick={like}>

👍 {post.likes.length}

</button>



<div>

{

post.comments.map(comment=>(

<p key={comment.id}>

<b>
{comment.user.name}
</b>

{" "}
{comment.content}

</p>

))

}

</div>


</div>

)


}