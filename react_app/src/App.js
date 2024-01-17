import React, { useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';


// Define a function for Importing Videos called VideoImportButton
function VideoImportButton() {

  // Create a reference to the file input element
  // Will be updated later with current property
  // https://react.dev/reference/react/useRef
  const fileInputRef = useRef(null);

  // Define a function to be called when the button is clicked
  const handleClick = () => {
    // Trigger the click event of the file input programmatically
    fileInputRef.current.click();
  };

  // Render the VideoImportButton component
  return (
    <div>
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef} // Attach the file input reference to the useRef hook
        style={{ display: 'none' }} // Hide the file input on a visual level
      />
      <button onClick={handleClick}>Import Video</button>
    </div>
  );
}

// example function
function Test() {
  document.getElementById("test").innerText = "this button does something";
}

// example ajax request
function RequestButton() {
  return (
    <button onClick={Request}>
      send a request
    </button>
  );
}
function Request() {
  $.ajax({
    url: "/test",
    type: "GET",
    success: function (returned_data) {
      document.getElementById("request").innerText = returned_data.test
    }
  });
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Team Urban Science
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <VideoImportButton />
        <p id="test"></p>
        <RequestButton />
        <p id="request"></p>


      </header>
    </div>
  );
}

export default App;
