import "./Navbar.css";


export default function Navbar() {


  return (

    <header className="navbar">


      <div className="logo-section">


        <h1>
          Obaaratech
        </h1>

        <span>
          Marketplace
        </span>


      </div>



      <div className="search-container">


        <input

          type="text"

          placeholder="Search products, categories, sellers..."

        />


        <button className="search-btn">

          🔍

        </button>


      </div>




      <div className="navbar-actions">


        <button className="nav-item">

          📍

          <span>
            Lagos
          </span>

        </button>



        <button className="nav-item">

          👤

          <span>
            Account
          </span>

        </button>



        <button className="nav-item">

          🛒

          <span>
            Cart
          </span>

          <small>
            0
          </small>

        </button>



        <button className="sell-btn">

          ➕

          Sell

        </button>


      </div>


    </header>

  );

}