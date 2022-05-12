import logo from './logo.svg';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react'; // Consulted () in: https://github.com/carlosazaustre/react-auth0; https://www.npmjs.com/package/@auth0/auth0-react; https://auth0.com/es
import { LoginButton } from './Login';
import { LogoutButton } from './Logout';
import { Profile } from './Profile';

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {isAuthenticated ? (
            <>
              <Profile />
              <LogoutButton />
            </>
        ) : (
            <LoginButton />
        )}
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
