import {useEffect,useState} from "react";

import api from "../api/axios";

import PostCard from "../components/PostCard";

import CreatePost from "../components/CreatePost";

import type {Post} from "../types/post";

import Navbar from "../components/Navbar";

return (

<>

<Navbar/>

<div className="feed">

...

</div>

</>

)

export default function Feed(){


const [posts,setPosts]=useState<Post[]>([]);



async function loadPosts(){

    const res = await api.get("/posts");

    setPosts(res.data.posts);

}



useEffect(()=>{

    loadPosts();

},[]);



return (

<div className="feed">


<h1>
Obaaratech Community
</h1>



<CreatePost refresh={loadPosts}/>



{

posts.map(post=>(

<PostCard

key={post.id}

post={post}

refresh={loadPosts}

/>

))

}



</div>

);


}