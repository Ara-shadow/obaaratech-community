const API_URL = "http://localhost:5000";


export async function getListings(){

const response = await fetch(
`${API_URL}/api/marketplace/listings`
);


if(!response.ok){

throw new Error(
"Failed to fetch listings"
);

}


return response.json();

}