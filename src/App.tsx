import "./App.css";
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { WalletSelector } from "@near-wallet-selector/core";
import "@near-wallet-selector/modal-ui/styles.css";
import LoginScreen from "./LoginScreen";
import MainScreen from "./MainScreen";
import Credentials from "../Credentials";

/**
 * React component for the entry point into the application.
 */
const App: React.FC = () => {
  const [credentials, setCredentials] = useState<Credentials | undefined>();
  const [user, setUser] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{ name: string; symbol: string; decimals: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const selector = ... // Initialize your NEAR wallet selector here
  const wallet = ... // Initialize your wallet here

  useEffect(() => {
    (async () => {
      if (wallet) {
        const accountId = await wallet.getAccountId();
        setUser(accountId);
      }
    })();
  }, [wallet]);

  const handleUser = async () => {
    if (!user) {
      const modal = setupModal(selector, {
        contractId: "usdt.tether-token.near",
      });
      modal.show();
    } else {
      await wallet.signOut();
      window.location.reload();
    }
  };

  const readMetadata = async () => {
    setLoading(true);
    try {
      const tokenMetadata = await wallet.account().viewFunction({
        contractId: "usdt.tether-token.near",
        methodName: "ft_metadata",
      });
      setMetadata(tokenMetadata);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    } finally {
      setLoading(false);
    }
  };

  const onLogout = () => {
    setCredentials(undefined);
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="navbar-container">
        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
        </div>
        <div className="profile-section">
          <span />
          {user && <h3>{user}</h3>}
          <button className="user-button" onClick={handleUser}>
            {user ? "Sign Out" : "Login"}
          </button>
        </div>
      </div>
      {user ? (
        <NEARLedger token={credentials?.token} party={credentials?.party}>
          <Switch>
            <Route path="/" exact>
              <MainScreen onLogout={onLogout} />
            </Route>
            {/* Add other routes here */}
          </Switch>
        </NEARLedger>
      ) : (
        <LoginScreen onLogin={setCredentials} />
      )}
      {user && (
        <div className="container">
          {!metadata && (
            <button onClick={readMetadata}>
              {loading ? (
                <BeatLoader size={8} color={"#fff"} loading={loading} />
              ) : (
                "Read token metadata"
              )}
            </button>
          )}
          {metadata && (
            <div className="token-info">
              <p>Token name: {metadata.name}</p>
              <p>Token symbol: {metadata.symbol}</p>
              <p>Token decimals: {metadata.decimals}</p>
            </div>
          )}
        </div>
      )}
    </BrowserRouter>
  );
};

export default App;
