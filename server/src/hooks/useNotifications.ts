import {useEffect,useState} from "react";
import api from "../api/axios";

import type {Notification} from "../types/notification";


export default function useNotifications(){

const [notifications,setNotifications]
=
useState<Notification[]>([]);


const [count,setCount]
=
useState(0);



async function load(){

const res =
await api.get("/notifications");


setNotifications(
res.data.notifications || []
);


}



async function loadCount(){

const res =
await api.get("/notifications/unread-count");


setCount(
res.data.count || 0
);

}



useEffect(()=>{

load();

loadCount();

},[]);



async function read(id:string){

await api.put(
`/notifications/${id}/read`
);

load();

loadCount();

}



async function readAll(){

await api.put(
"/notifications/read-all"
);

load();

loadCount();

}



return {

notifications,

count,

read,

readAll

};


}
