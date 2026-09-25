import api from "../api/axios";

import type {
Listing
} from "../types/listing";



export async function getListings(){

const response =
await api.get<{
success:boolean;
listings:Listing[]
}>(
"/listings"
);


return response.data.listings;

}