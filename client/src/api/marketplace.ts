const API_URL = "http://127.0.0.1:5000/api/marketplace";


export async function getListings(){

    const response = await fetch(
        `${API_URL}/listings`
    );


    if(!response.ok){
        throw new Error(
            "Failed to fetch listings"
        );
    }


    return response.json();

}



export async function getListing(id:string){

    const response = await fetch(
        `${API_URL}/listings/${id}`
    );


    if(!response.ok){
        throw new Error(
            "Failed to fetch listing"
        );
    }


    return response.json();

}