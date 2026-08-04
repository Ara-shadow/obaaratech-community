import {useState} from "react";

import api from "../api/axios";


export default function CreatePost(
{
refresh
}:{
refresh:()=>void
}){


const [content,setContent]=useState("");



async function submit(){


await api.post("/posts",{

content

});


setContent("");

refresh();


}



return (

<div>


<textarea

value={content}

onChange={
e=>setContent(e.target.value)
}

placeholder="Share something with the community..."

 />



<button onClick={submit}>

Post

</button>


</div>

)


}