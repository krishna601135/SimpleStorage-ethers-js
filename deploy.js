const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(
        "http://127.0.0.1:7545"
    ); // here we are connecting to our local blockchain

    const wallet = new ethers.Wallet(
        "27bf7141065c4ce556c9fb7f57ed3f7dc3d02d491bc1da6df08ad74303a2ee1e",
        provider
    ); // it going to take two arguments like privatekey and provider

    // Inorder to deploy our contracts we need abi and binary compile code of contract

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");

    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    );

    // In ethersjs a contract factory is an object used to deploy our contracts
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying Please Wait.......");
    const contract = await contractFactory.deploy(); //Stop here wait for the contract to deploy
    // await keyword will resolve the promise
    //console.log(contract);
    await contract.deployTransaction.wait(1); // here are saying no of blockconfirmations

    // interaction with our contracts in etherjs

    const currentFavouriteNumber = await contract.retrieve();
    console.log(
        `Current Favourite Number is: ${currentFavouriteNumber.toString()}`
    );

    const transactionResponse = await contract.store("345");
    const transactionReceipt = await transactionResponse.wait(1);
    const updatedFavouriteNumber = await contract.retrieve();
    console.log(`Updated Favourite Number: ${updatedFavouriteNumber}`);
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });