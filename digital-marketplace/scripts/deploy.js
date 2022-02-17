// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    let txHash, txReceipt
    const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
    const nftMarket = await NFTMarket.deploy();
    await nftMarket.deployed();

    txHash = nftMarket.deployTransaction.hash;
    txReceipt = await ethers.provider.waitForTransaction(txHash);
    let nftMarketAddress = txReceipt.contractAddress

    console.log("nftMarket deployed to:", nftMarketAddress);

    const NFT = await hre.ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(nftMarketAddress);
    await nft.deployed();


    txHash = nft.deployTransaction.hash;
    // console.log(`NFT hash: ${txHash}\nWaiting for transaction to be mined...`);
    txReceipt = await ethers.provider.waitForTransaction(txHash);
    let nftAddress = txReceipt.contractAddress

    console.log("nft deployed to:", nftAddress);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
