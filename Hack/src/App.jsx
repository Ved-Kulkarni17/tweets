import { useState } from "react";
import { Menu, X } from "lucide-react"; // Icons for the menu

function App() {
  const [classifiedTweets, setClassifiedTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for sidebar
  const [currentPage, setCurrentPage] = useState("home"); // Page state

  const fetchClassifications = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:8000/classify");
    const data = await response.json();
  
    // We assume the backend returns only disaster-related tweets
    console.log(data); // This will log the fetched data in the frontend console
    setClassifiedTweets(data);
    setLoading(false);
  };
  

  // Function to show the disaster map by opening the backend endpoint in a new window
  const showDisasterMap = async () => {
    const newTab = window.open("", "_blank"); // Open a new tab first
  
    try {
      const response = await fetch("http://localhost:8000/generate-map", {
        method: "POST", // Keep POST
        headers: {
          "Content-Type": "application/json",  // Explicitly set content type
        },
        body: JSON.stringify({ tweets: [{ text: "Some tweet text", location: "Location" }] }), // JSON payload
      });
  
      if (response.ok) {
        const mapHtml = await response.text(); // Get HTML content
        newTab.document.write(mapHtml); // Write HTML into new tab
        newTab.document.close();
      } else {
        newTab.close(); // Close the tab if there's an error
        alert("Failed to generate map: " + response.statusText);
      }
    } catch (error) {
      // Catch any network or other errors
      newTab.close();
      alert("Network error while generating map: " + error.message);
    }
  };
  
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#6a1b9a] to-[#b084f5] text-white text-center p-5 relative">
      {/* Navbar */}
      <nav className="w-full fixed top-0 bg-[#1b0137] p-4 flex justify-between items-center shadow-lg">
        {/* Hamburger Menu on the left */}
        <button
          className="text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
  
        {/* Disaster Response on the right */}
        <h1
          className="text-3xl font-bold text-[#b084f5] cursor-pointer ml-auto transition-transform hover:scale-110"
          onClick={() => setCurrentPage("home")}
        >
          Disaster Response
        </h1>
      </nav>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gradient-to-b from-[#1b0137] to-[#4c006e] transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-xl`}
      >
        <button
          className="absolute top-4 right-4 text-white"
          onClick={() => setMenuOpen(false)}
        >
          <X size={28} />
        </button>

        <ul className="mt-16 text-left text-white p-4 space-y-6">
          <li
            className="hover:text-[#b084f5] cursor-pointer text-xl font-semibold transition duration-300"
            onClick={() => setCurrentPage("home")}
          >
            Home
          </li>
          <li
            className="hover:text-[#b084f5] cursor-pointer text-xl font-semibold transition duration-300"
            onClick={() => setCurrentPage("tweets")}
          >
            Classify Tweets
          </li>
          <li
            className="hover:text-[#b084f5] cursor-pointer text-xl font-semibold transition duration-300"
            onClick={() => setCurrentPage("about")}
          >
            About Us
          </li>
        </ul>
      </div>

      {/* Page Rendering */}
      <main className="w-full max-w-xl mt-20">
        {currentPage === "home" && (
          <div>
            <h2 className="text-6xl font-bold text-gray-100">Welcome</h2>
            <p className="text-gray-300 mt-3">
              A system for disaster response classification.
            </p>
            <button
              className="mt-5 px-6 py-3 bg-gradient-to-r from-[#b084f5] to-[#9c27b0] text-white font-bold rounded-full shadow-lg hover:bg-gradient-to-l"
              onClick={() => setCurrentPage("tweets")}
            >
              Start Classification
            </button>
          </div>
        )}

        {currentPage === "tweets" && (
          <div>
            <h2 className="text-4xl font-bold text-gray-100">
              Classify Disaster Tweets
            </h2>
            <button
              className="mt-5 px-6 py-3 bg-gradient-to-r from-[#b084f5] to-[#9c27b0] text-white font-bold rounded-full shadow-lg hover:bg-gradient-to-l"
              onClick={fetchClassifications}
              disabled={loading}
            >
              {loading ? "Classifying..." : "Fetch Tweets"}
            </button>
            <button
              className="mt-5 px-6 py-3 bg-gradient-to-r from-[#b084f5] to-[#9c27b0] text-white font-bold rounded-full shadow-lg hover:bg-gradient-to-l ml-4"
              onClick={showDisasterMap}
            >
              Show Disaster Map
            </button>

            {/* Display Classified Tweets */}
            <div className="mt-5 w-full max-w-xl">
              {classifiedTweets.length > 0 ? (
                classifiedTweets.map((tweet, index) => (
                  <div
                    key={index}
                    className="bg-[#1b0137] text-white p-4 my-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                  >
                    <p>
                      <strong>Tweet:</strong> {tweet.text}
                    </p>
                    <p>
                      <strong>Category:</strong> {tweet.category}
                    </p>
                    <p>
                      <strong>Location:</strong> {tweet.location || "Not Available"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No disaster-related tweets available.</p>
              )}
            </div>
          </div>
        )}

        {currentPage === "about" && (
          <div>
            <h2 className="text-4xl font-bold text-gray-100">About Us</h2>
            <p className="text-gray-300 mt-3">
              This project classifies tweets related to disasters using AI.
              It helps in identifying emergency situations and responding efficiently.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
