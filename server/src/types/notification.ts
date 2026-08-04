export interface NotificationUser {

    id:string;

    name:string;

    avatar?:string;

}


export interface Notification {

    id:string;

    type:string;

    message:string;

    read:boolean;

    actor:NotificationUser;

    createdAt:string;

}