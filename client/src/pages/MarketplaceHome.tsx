import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import CategorySidebar from "../components/CategorySidebar";
import SponsoredBanner from "../components/SponsoredBanner";
import ProductCard from "../components/ProductCard";

import { getListings } from "../services/marketplace";


export default function MarketplaceHome() {


  const [listings, setListings] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {


    getListings()

      .then((data) => {

        console.log("Marketplace API:", data);

        setListings(data.listings || []);

      })

      .catch((error) => {

        console.error(
          "Marketplace API Error:",
          error
        );

        setListings([]);

      })

      .finally(() => {

        setLoading(false);

      });


  }, []);




  return (

    <div className="marketplace-page">


      <Navbar />



      <div className="market-layout">


        <CategorySidebar />



        <main className="market-main">


          <SponsoredBanner />



          <section className="products-section">


            <h2>
              Latest Listings
            </h2>



            {
              loading ?


              (
                <p>
                  Loading products...
                </p>
              )


              :


              (

                <div className="products">


                  {
                    listings.length === 0 ?


                    (

                      <p>
                        No products available yet
                      </p>

                    )


                    :


                    listings.map((item) => (

                      <ProductCard

                        key={item.id}

                        listing={item}

                      />

                    ))

                  }


                </div>

              )


            }


          </section>


        </main>


      </div>


    </div>

  );

}