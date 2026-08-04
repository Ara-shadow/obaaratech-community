import {useState} from "react";

import useNotifications from "../hooks/useNotifications";


export default function NotificationBell(){


const [open,setOpen]=useState(false);


const {

notifications,

count,

read,

readAll

}=useNotifications();



return (

<div>


<button
onClick={()=>setOpen(!open)}
>

🔔

{
count > 0 &&
<span>

{count}

</span>
}

</button>



{

open &&

<div>


<button onClick={readAll}>

Mark all read

</button>



{

notifications.map(item=>(


<div

key={item.id}

onClick={()=>read(item.id)}

>

<b>
{item.actor.name}
</b>


<p>
{item.message}
</p>


</div>


))

}


</div>

}


</div>

)

}