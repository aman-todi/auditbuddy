import logo from './logo.svg';
import './App.css';

// example component
function MyButton() {
  return (
    <button action="/test" method="post">
      I'm a button part two
    </button>
  );
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


      </header>
    </div>
  );
}

export default App;
