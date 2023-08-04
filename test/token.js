// // Testing part 1---:
// const { expect } = require("chai"); // chai is a library
// const { ethers } = require("hardhat");

// describe("Token contract", function () {
//   // Here we first give contract name then call function inside it.
//   it("Deployment should assign the total supply of tokens to the owners", async function () {
//     // for testing we use "it"funcion where in first parameter we define what we want to check in this testing in second parameter we call async function
//     const [owner] = await ethers.getSigners(); // getSigners is a object which give access to account of user. Then we can get every details of user through his account.
//     // console.log("Signers Objects : ", owner);

//     const Token = await ethers.getContractFactory("Token"); // Here we create instance of our Contract

//     const hardhatToken = await Token.deploy(); // Here write code to deploy contract. Hardhat itself deploy contract.

//     const ownerBalance = await hardhatToken.balanceOf(owner.address); // Here with the help of instance of contract we call function of contract
//     // console.log("Owner Address : ", owner.address);

//     expect(await hardhatToken.totalSupply()).to.equal(ownerBalance); // Here we define what we expect from our contract to do. If expectation of contract gets failed then it will show error in console.
//   });

//   it("should transfer tokens between account", async function () {
//     const [owner, addr1, addr2] = await ethers.getSigners();
//     const Token = await ethers.getContractFactory("Token");
//     const hardhatToken = await Token.deploy();

//     await hardhatToken.transfer(addr1.address, 10);
//     expect(await hardhatToken.balanceOf(addr1.address)).to.equal(10);

//     await hardhatToken.connect(addr1).transfer(addr2.address, 5);// for getting controll over to some others accout rather than owner who deploy contract we need to use .connect() function.
//     expect(await hardhatToken.balanceOf(addr2.address)).to.equal(5);
//     expect(await hardhatToken.balanceOf(addr1.address)).to.equal(5);
//   });
// });

const { expect } = require("chai");

describe("Token Contract", function () {
  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // This function will run before running of each describe function
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    hardhatToken = await Token.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });
    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should trasfer tokens between accounts", async function () {
      //owner account to addr1.address
      await hardhatToken.transfer(addr1.address, 5);
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(5);

      await hardhatToken.connect(addr1).transfer(addr2.address, 5);
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(5);
    });

    it("Should fail if sender does not have enough tokens", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address); //10000
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1) //initially - 0 tokens addr1
      ).to.be.revertedWith("Not enough tokens");
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
      await hardhatToken.transfer(addr1.address, 5);
      await hardhatToken.transfer(addr2.address, 10);

      const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 15);

      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(5);
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(10);
    });
  });
});
