const Election = artifacts.require("Election");

contract("Election", (accounts) => {
  let election;

  before(async () => {
    election = await Election.new(); // Deploy a fresh contract before tests
  });

  it("should add a candidate request", async () => {
    const tx = await election.addCandidateRequest("Candidate Name", {
      from: accounts[0],
    });
    console.log("Gas used for addCandidateRequest:", tx.receipt.gasUsed);
  });

  it("should approve candidate requests", async () => {
    const tx = await election.approveCandidateRequests(0, {
      from: accounts[0],
    });
    console.log("Gas used for approveCandidateRequests:", tx.receipt.gasUsed);
  });

  it("should add voter details", async () => {
    const tx = await election.addVoterDetails("Voter Name", {
      from: accounts[1],
    });
    console.log("Gas used for addVoterDetails:", tx.receipt.gasUsed);
  });

  it("should change election phase", async () => {
    const tx = await election.changeElectionPhase(1, { from: accounts[0] });
    console.log("Gas used for changeElectionPhase:", tx.receipt.gasUsed);
  });
});
