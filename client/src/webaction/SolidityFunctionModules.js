import Web3 from "web3";
import Election from "../contracts/Election.json";
const _gas = 1000000;
const _gasPrice = 5000000;

export const sol_connectwallet = async () => {
  let web3 = null,
    error = null,
    acc = null;
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      acc = await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);
      return { acc, web3, error };
    } catch (err) {
      error = err.message;
      return { acc, web3, error };
    }
  } else {
    console.log("Please install MetaMask");
    error = "Please install MetaMask!";
    return { acc, web3, error };
  }
};
// export const sol_connectwallet = async () => {
//   let acc = null;
//   let error = null;
//   let web3 = null;

//   const isBrowser = typeof window !== "undefined";
//   const hasMetaMask = isBrowser && typeof window.ethereum !== "undefined";

//   if (hasMetaMask) {
//     try {
//       acc = await window.ethereum.request({ method: "eth_requestAccounts" });
//       web3 = new Web3(window.ethereum);
//     } catch (err) {
//       error = err.message;
//     }
//   } else {
//     console.log("Please install MetaMask");
//     error = "Please install MetaMask!";
//   }

//   return { acc, web3, error };
// };

export const sol_getElectionInstance = async () => {
  // let web3 = null;

  // const data = await sol_connectwallet();
  // web3 = data.web3;
  const web3 = await sol_getWeb3();
  // Get the contract instance.
  if (web3) {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Election.networks[networkId];
    const ElectionInstance = new web3.eth.Contract(
      Election.abi,
      deployedNetwork && deployedNetwork.address
    );
    return ElectionInstance;
  }
  return false;
};

// // GPT Code by Bijo , p ,p
// export const sol_getElectionInstance = async () => {
//   const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
//   const networkId = await web3.eth.net.getId();
//   const deployedNetwork = Election.networks[networkId];

//   if (!deployedNetwork) {
//     throw new Error("Contract not deployed to detected network");
//   }

//   return new web3.eth.Contract(Election.abi, deployedNetwork.address);
// };
// // Prag , prch

export const sol_getWeb3 = async () => {
  let web3 = null;

  const data = await sol_connectwallet();
  if (!data.error) {
    web3 = data.web3;
    return web3;
  }
  return false;
};

//Get current accout
export const sol_getCurrentAccount = async () => {
  const data = await sol_connectwallet();
  if (data.error) {
    return false;
  } else {
    return data.acc[0];
  }
};

export const sol_isAdminAddress = async () => {
  let acc = await sol_getCurrentAccount();
  if (acc) {
    const ElectionInstance = await sol_getElectionInstance();
    const admin = await ElectionInstance.methods.getAdmin().call();

    if (admin.toString().toLowerCase() === acc.toString().toLowerCase()) {
      return true;
    }
  }
  return false;
};

export const sol_getElectionDetails = async () => {
  const ElectionInstance = await sol_getElectionInstance();
  if (ElectionInstance) {
    let data = await ElectionInstance.methods.getElectionDetails().call();

    return data;
  }
  return false;
};

export const sol_startElection = async (electionTitle, organizationName) => {
  let acc = await sol_getCurrentAccount();
  const ElectionInstance = await sol_getElectionInstance();
  let data = sol_getElectionDetails();
  const isElectionStarted = data[0];
  if (acc) {
    if (!isElectionStarted) {
      await ElectionInstance.methods
        .startElection(electionTitle, organizationName)
        .send({ from: acc, gas: _gasPrice, gasPrice: _gasPrice });
      return true;
    }
  } else {
    return false;
  }
};

export const sol_isPendingRequest = async () => {
  const ElectionInstance = await sol_getElectionInstance();
  const isPendingRequest = await ElectionInstance.methods
    .isPendingRequest()
    .call();
  if (isPendingRequest) {
    return true;
  }
  return false;
};

export const sol_changeElectionPhase = async () => {
  const acc = await sol_getCurrentAccount();
  const ElectionInstance = await sol_getElectionInstance();

  let data = await ElectionInstance.methods.changeElectionPhase().send({
    from: acc,
    gas: _gasPrice,
    gasPrice: _gasPrice,
  });
};

//Add login details
export const sol_addLoginDetails = async (username, email, password) => {
  const acc = await sol_getCurrentAccount();
  if (acc) {
    const ElectionInstance = await sol_getElectionInstance();
    if (!(await ElectionInstance.methods.isVoterExists(acc, email).call())) {
      await ElectionInstance.methods
        .addVoterDetails(username, email, password)
        .send({ from: acc, gas: _gas, gasPrice: _gasPrice });
      return true;
    }
  }
  return false;
};

//Verify login details
export const sol_verifyLoginDetails = async (email, password) => {
  const acc = await sol_getCurrentAccount();
  if (acc) {
    const ElectionInstance = await sol_getElectionInstance();

    const loginData = await ElectionInstance.methods
      .getVoterDetails(acc)
      .call();

    const storedEmail = loginData.email;
    const storedPassowrd = loginData.password;
    const storedAccount = loginData.voterAddress;
    if (
      storedEmail === email &&
      storedPassowrd === password &&
      acc.toString().toLowerCase() === storedAccount.toString().toLowerCase()
    )
      return true;
  }
  return false;
};

// Get account details by address
export const sol_getUserDetails = async () => {
  const acc = await sol_getCurrentAccount();
  if (acc) {
    const ElectionInstance = await sol_getElectionInstance();

    const userData = await ElectionInstance.methods.getVoterDetails(acc).call();
    return userData;
  }
  return false;
};

// Check if voter exists or not
export const sol_isVoterExists = async (email) => {
  const acc = await sol_getCurrentAccount();
  const ElectionInstance = await sol_getElectionInstance();

  if (await ElectionInstance.methods.isVoterExists(acc, email).call())
    return true;
  else return false;
};
/*------------ Voter Verification functions ------------*/

export const sol_addVerificationRequest = async (prn, mobile) => {
  const acc = await sol_getCurrentAccount();
  if (acc) {
    const ElectionInstance = await sol_getElectionInstance();

    const addVerificationReq = await ElectionInstance.methods
      .addVerificationRequest(acc, prn, mobile)
      .send({ from: acc, gas: _gas, gasPrice: _gasPrice });

    return addVerificationReq;
  }
};

export const sol_approveVerificationRequests = async (approveAccount) => {
  const acc = await sol_getCurrentAccount();
  if (acc) {
    const ElectionInstance = await sol_getElectionInstance();

    const approveVerificationReq = await ElectionInstance.methods
      .approveVerificationRequests(approveAccount)
      .send({ from: acc, gas: _gas, gasPrice: _gasPrice });

    return true;
  } else {
    return false;
  }
};

export const sol_denyVerificationRequests = async (denyAccount) => {
  const acc = await sol_getCurrentAccount();
  if (acc) {
    const ElectionInstance = await sol_getElectionInstance();

    const denyVerificationReq = await ElectionInstance.methods
      .denyVerificationRequests(denyAccount)
      .send({ from: acc, gas: _gas, gasPrice: _gasPrice });

    return true;
  } else {
    return false;
  }
};

export const sol_getAllVoterDetails = async () => {
  const acc = await sol_getCurrentAccount();
  if (acc) {
    const ElectionInstance = await sol_getElectionInstance();

    const allVoterDetails = ElectionInstance.methods
      .getAllVoterDetails()
      .call();

    return allVoterDetails;
  }
};

// add candidate request

export const sol_addCandidateRequest = async (tagLine) => {
  const acc = await sol_getCurrentAccount();
  if (acc) {
    const ElectionInstance = await sol_getElectionInstance();

    const addCandidateReq = await ElectionInstance.methods
      .addCandidateRequest(acc, tagLine)
      .send({ from: acc, gas: _gas, gasPrice: _gasPrice });

    return addCandidateReq;
  }
};

export const sol_approveCandidateRequests = async (approveAccount) => {
  const acc = await sol_getCurrentAccount();
  if (acc) {
    const ElectionInstance = await sol_getElectionInstance();

    const approveCandidateReq = await ElectionInstance.methods
      .approveCandidateRequests(approveAccount)
      .send({ from: acc, gas: _gas, gasPrice: _gasPrice });

    return true;
  } else {
    return false;
  }
};

/*------------------------ Voting Handlers --------------------------- */

export const sol_addVote = async (candidateAddress) => {
  const acc = await sol_getCurrentAccount();
  if (acc) {
    const ElectionInstance = await sol_getElectionInstance();
    const voteSuccess = await ElectionInstance.methods
      .addVote(acc, candidateAddress)
      .send({ from: acc, gas: _gas, gasPrice: _gasPrice });
  }
};

export const sol_hasVoted = async () => {
  const acc = await sol_getCurrentAccount();
  if (acc) {
    const ElectionInstance = await sol_getElectionInstance();
    const hasCastedVote = await ElectionInstance.methods.hasVoted(acc).call();
    return hasCastedVote;
  } else return false;
};

/*------------------------ Reset Voter & Elections Details --------------------------- */

export const sol_resetElection = async () => {
  const acc = await sol_getCurrentAccount();
  const ElectionInstance = await sol_getElectionInstance();
  await ElectionInstance.methods
    .resetElection()
    .send({ from: acc, gas: _gas, gasPrice: _gasPrice });
};
