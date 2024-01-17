import logo from './logo.svg';
import './App.css';

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


      </header>
    </div>
  );
}

export default App;
