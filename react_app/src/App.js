import logo from './logo.svg';
import './App.css';
import $ from 'jquery';


// example component
function MyButton() {
  return (
    <button onClick={Test}>
      I'm a button part two
    </button>
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
    success: function(returned_data) {
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

        <MyButton />
        <p id="test"></p>
        <RequestButton/>
        <p id="request"></p>


      </header>
    </div>
  );
}

export default App;
