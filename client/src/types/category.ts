export interface CategoryTree {

    id:string;

    name:string;

    slug:string;

    icon?:string | null;

    parentId?:string | null;

    children?:CategoryTree[];

}