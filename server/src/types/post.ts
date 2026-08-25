export interface User {

    id:string;

    name:string;

    avatar?:string;

}



export interface Comment {

    id:string;

    content:string;

    user:User;

    createdAt:string;

}



export interface Post {

    id:string;

    content:string;

    image?:string;

    author:User;

    comments:Comment[];

    likes:any[];

    createdAt:string;

}
