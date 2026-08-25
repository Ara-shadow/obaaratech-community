import api from "./axios";


export async function getCategoryTree(){

    const response = await api.get(
        "/categories/tree"
    );


    return response.data.categories;

}