import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.js";
import AlertMessage from "../components/AlertMessage.js";
import {
  sol_addLoginDetails,
  sol_connectwallet,
} from "../webaction/SolidityFunctionModules.js";
import { useNavigate } from "react-router-dom";

const RegisterScreen = () => {
  //------------------------------ Style CSS -----------------------------------------//
  const registerscreenstyle = {
    minHeight: "100%",
    backgroundImage: `url("./Images/wallpaper2.png")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    width: "100vw",
    height: "84vh",
    // ---------------------------We added------------------------------------
    display: "flex",
    justifyContent: "center", // horizontal center
    alignItems: "center", // vertical center
    height: "100vh", // full screen height
    backgroundColor: "#0f172a", // optional dark background
    flexDirection: "column",
    // ---------------------------We added------------------------------------
  };

  const registerformstyle = {
    width: "25%",
    minWidth: "400px",
    background: "#23263F",
    padding: "8%",
    margin: "1%",
    marginLeft: "3%",
    borderRadius: "20px",
  };
  const metmamaskBtnStyle = {
    color: "#000000",
    fontSize: "1.5em",
  };
  const loginlinkstyle = {
    textDecoration: "none",
  };

  const bgstyle = {
    width: "50%",
    margin: "1% auto",
    background: "rgba(0, 0, 0, 0.5)",
    padding: "1%",
    color: "#FFFFFF",
  };

  //------------------------------ useStates Hooks -----------------------------------------//

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAccountConnected, setIsAccountConnected] = useState(false);
  const [currentAcc, setCurrentAcc] = useState("");
  const [errorConnectWallet, setErrorConnectWallet] = useState(null);
  const [errorRegister, setErrorRegister] = useState(null);

  const navigate = useNavigate();

  //------------------------------ Functions -----------------------------------------//

  const submitHandler = async (e) => {
    e.preventDefault();
    // check if user already exists
    // if not then add to list
    let result = await sol_addLoginDetails(username, email, password);
    if (result) navigate("/dashboard");
    else setErrorRegister("User already exist!");
    // navigate to login
  };

  const onWalletConnection = async () => {
    let data = await sol_connectwallet();
    // console.log("data", data);
    if (data.error) {
      setErrorConnectWallet(data.error);
    } else {
      setCurrentAcc(data.acc[0]);
      setIsAccountConnected(true);
    }
  };

  // ---------------------ADDED BY BIJO-----------------------------
  // const onWalletConnection = async () => {
  //   if (window.ethereum) {
  //     try {
  //       const accounts = await window.ethereum.request({
  //         method: "eth_requestAccounts",
  //       });
  //       console.log("Connected accounts:", accounts);
  //       setCurrentAcc(accounts[0]);
  //       setIsAccountConnected(true);
  //       setErrorConnectWallet(null);
  //     } catch (err) {
  //       console.error("Wallet connection error:", err);
  //       setErrorConnectWallet("User rejected connection request.");
  //     }
  //   } else {
  //     setErrorConnectWallet("MetaMask not detected.");
  //   }
  // };

  // ---------------------ADDED BY BIJO-----------------------------

  useEffect(() => {}, [currentAcc]); // this is not added by me, was already there

  // ---------------------ADDED BY BIJO-----------------------------

  // useEffect(() => {
  //   if (window.ethereum) {
  //     window.ethereum.on("accountsChanged", (accounts) => {
  //       if (accounts.length > 0) {
  //         setCurrentAcc(accounts[0]);
  //         setIsAccountConnected(true);
  //       } else {
  //         setIsAccountConnected(false);
  //         setCurrentAcc("");
  //       }
  //     });
  //   }
  // }, []);

  // useEffect(() => {
  //   if (window.ethereum) {
  //     window.ethereum.on("accountsChanged", (accounts) => {
  //       setCurrentAcc(accounts[0]);
  //       console.log("Switched to account:", accounts[0]);
  //     });
  //   }
  // }, []);

  // ---------------------ADDED BY BIJO-----------------------------

  //------------------------------ Render Content -----------------------------------------//
  return (
    <>
      <Navbar />
      <div className="RegiterPageWallpaper" style={registerscreenstyle}>
        <div className="text-center fw-bold mt-2" style={bgstyle}>
          A MetaMask wallet is required for registration.{" "}
          <a
            style={loginlinkstyle}
            href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
            target="_blank"
          >
            Click here to download.
          </a>
        </div>
        <form onSubmit={submitHandler}>
          <div className="container text-light" style={registerformstyle}>
            <div className="text-center">
              <h3>Register</h3>

              {errorConnectWallet && (
                <AlertMessage type="danger" message={errorConnectWallet} />
              )}
              {errorRegister && (
                <AlertMessage type="danger" message={errorRegister} />
              )}
            </div>
            <div>
              <p>
                Already have an account?
                <Link style={loginlinkstyle} to="/login">
                  {" "}
                  Login Here
                </Link>
              </p>
            </div>
            <div className="mb-3">
              <label htmlFor="studentName" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="studentName"
                placeholder="Enter Your Name Here..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="studentEmail" className="form-label">
                Email
              </label>
              <input
                type="email"
                pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                className="form-control"
                id="studentEmail"
                placeholder="e.g. XYZ@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="studentPassword" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="studentPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              ></input>
            </div>
            <div className="mb-3">
              <div className="d-grid gap-2">
                <label htmlFor="metamaskbtn" className="form-label">
                  Metamask Wallet{" "}
                  {isAccountConnected ? (
                    <i
                      style={{ color: "green" }}
                      className="fa-solid fa-circle-check"
                    ></i>
                  ) : (
                    <i
                      style={{ color: "red" }}
                      className="fa-solid fa-circle-xmark"
                    ></i>
                  )}
                </label>
                <button
                  className={`btn ${
                    isAccountConnected ? "btn-success" : "btn-danger"
                  }  btn-lg fw-bold`}
                  type="button"
                  id="metamaskbtn"
                  onClick={onWalletConnection}
                  style={metmamaskBtnStyle}
                >
                  <img
                    src="./Images/metamask.png"
                    alt=""
                    width="80"
                    height="40"
                  />
                  METAMASK
                </button>
                <button
                  className="btn btn-warning btn-lg mt-4"
                  type="submit"
                  disabled={!isAccountConnected}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterScreen;
