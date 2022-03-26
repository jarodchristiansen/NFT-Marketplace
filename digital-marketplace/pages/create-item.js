import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { CensorSensor } from "censor-sensor";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/Market.sol/NFTMarket.json";
import LoadingSpinner from "../components/loading-spinner";
import { Canvas } from "../components/CreatePage/Canvas/Canvas";
import { ClearCanvasButton } from "../components/CreatePage/Canvas/ClearCanvasButton";

export default function CreateItem() {
  const [loadingState, setLoadingState] = useState("loaded");
  const [fileLoading, setFileLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState();

  const [nameError, setNameError] = useState({ status: false, message: "" });
  const [descError, setDescError] = useState({ status: false, message: "" });
  const [priceError, setPriceError] = useState({ status: false, message: "" });

  useEffect(() => {
    let uploadButton = document.getElementById("upload-button");
    console.log("this is the useEffect");
    // window.addEventListener("beforeunload", function (e) {
    //   e.preventDefault();
    //   e.returnValue = "";
    // });
  }, []);

  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  const censor = new CensorSensor();
  censor.removeWord("ass");
  censor.removeWord("damn");
  censor.enableTier(5);

  const validateInput = (e) => {
    if (e.target.name) {
      // Verifies there is a name specified by the field in the form
      switch (e.target.name) {
        // Switches off of the field based on the name of it
        case "name":
          if (e.target.value.length < 3 && e.target.value.length > 1) {
            setNameError({
              status: true,
              message: "Name must be at least 3 characters long",
            });
          } else if (
            (e.target.value.length > 3 && censor.isProfane(e.target.value)) ||
            censor.isProfaneIsh(e.target.value)
          ) {
            setNameError({
              status: true,
              message:
                "Name must not have profanity:\n" +
                censor.profaneIshWords(e.target.value),
            });
            updateFormInput({ ...formInput, name: "" });
          } else {
            setNameError({ status: false, message: "" });
            updateFormInput({ ...formInput, name: e.target.value });
          }
          break;
        case "description":
          if (e.target.value.length < 10 && e.target.value.length > 3) {
            setDescError({
              status: true,
              message: "Description must be at least 10 characters long",
            });
          } else if (
            e.target.value.length > 10 &&
            censor.isProfaneIsh(e.target.value)
          ) {
            setDescError({
              status: true,
              message:
                "Description must not have profanity:\n" +
                censor.profaneIshWords(e.target.value),
            });
            updateFormInput({ ...formInput, description: "" });
          } else {
            setDescError({ status: false, message: "" });
            updateFormInput({ ...formInput, description: e.target.value });
          }
          break;
        case "price":
          if (e.target.value <= 0) {
            setPriceError({
              status: true,
              message: "Price must be greater than 0 MATIC",
            });
            updateFormInput({ ...formInput, price: "" });
          } else if (e.target.value > 1000000) {
            setPriceError({
              status: true,
              message: "Price must be less than 1,000,000 MATIC",
            });
            updateFormInput({ ...formInput, price: "" });
          } else {
            setPriceError({ status: false, message: "" });
            updateFormInput({ ...formInput, price: e.target.value });
          }
          break;
      }
    }
  };

  async function onChange(e) {
    const file = e.target.files[0];
    // setLoadingState('loading');
    setFileLoading(true);
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
      // setLoadingState('loaded');
      setFileLoading(false);
    } catch (error) {
      setFileLoading(false);
      console.log("Error uploading file: ", error);
    }
  }
  async function createMarket(e) {
    e.preventDefault();
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) return;
    /* first, upload to IPFS */
    setLoadingState("loading");
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      setLoadingMessage(
        "Attempting to create market for this NFT, please wait..."
      );
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url);
      setLoadingMessage("Market Created");
      setLoadingState("loaded");
    } catch (error) {
      setLoadingState("loaded");
      setLoadingMessage(`${error}`);
      console.log("Error uploading file: ", error);
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    setLoadingState("loading");
    /* next, create the item */
    setLoadingMessage("Attempting to create NFT auction, please wait...");
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    console.log("this is the event", event);
    let value = event.args[2];
    let tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(formInput.price, "ether");

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();
    setLoadingMessage(
      "Item listed successfully!, you are being rerouted to the marketplace"
    );
    setLoadingState("loaded");
    router.push("/");
  }

  const validInput =
    "mt-2 border rounded p-4 text-center w-5/6 self-center my-4";
  const invalidInput =
    "mt-2 border rounded p-4 border-red-500 text-center w-5/6 self-center";
  const formButton =
    "font-bold mt-8 bg-pink-500 text-white rounded p-4 shadow-lg w-5/6 self-center";
  const errorButton =
    "font-bold mt-8 bg-disabled-button-pink text-white rounded p-4 shadow-lg w-5/6 self-center";

  const anyError =
    (nameError && nameError.status) ||
    (descError && descError.status) ||
    (priceError && priceError.status) ||
    !formInput.name ||
    !formInput.price ||
    !formInput.description;

  return (
    <div className="flex justify-center">
      {loadingState == "loading" ? (
        <div>
          <LoadingSpinner />
          <h1>{loadingMessage && loadingMessage}</h1>
        </div>
      ) : (
        <form
          className="sm:w-1/2 flex flex-col pb-12 outline outline-1 mt-12 w-5/6 shadow-2xl"
          onSubmit={(e) => createMarket(e)}
        >
          <h2 className={"text-2xl text-center my-8"}>Create Your NFT</h2>
          <input
            placeholder="Asset Name"
            className={
              nameError && nameError.status ? invalidInput : validInput
            }
            onChange={(e) => validateInput(e)}
            name={"name"}
          />

          {nameError && nameError.status && (
            <p className="text-red-500 text-sm italic text-center">
              {nameError.message}
            </p>
          )}

          <textarea
            placeholder="Asset Description"
            className={
              descError && descError.status ? invalidInput : validInput
            }
            onChange={(e) => validateInput(e)}
            name={"description"}
          />
          {descError && descError.status && (
            <p className="text-red-500 text-sm italic text-center">
              {descError.message}
            </p>
          )}
          <input
            placeholder="Asset Price in MATIC"
            className={
              priceError && priceError.status ? invalidInput : validInput
            }
            onChange={(e) => validateInput(e)}
            name={"price"}
          />
          {priceError && priceError.status && (
            <p className="text-red-500 text-sm italic text-center">
              {priceError.message}
            </p>
          )}
          {fileUrl && (
            <img
              className="rounded mt-4 self-center"
              width="350"
              src={fileUrl}
            />
          )}

          {fileLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {!fileUrl ? (
                <>
                  <label className={"custom-file-upload" + " " + formButton}>
                    <p className={"text-md font-bold text-center"}>Upload</p>
                    <input
                      type="file"
                      name="Asset"
                      className="my-4 hidden"
                      onChange={onChange}
                    />
                    {/*<SketchComponent />*/}
                  </label>
                  <div className={"max-w-fit"}>
                    <Canvas />
                    <ClearCanvasButton />
                  </div>
                </>
              ) : (
                <button onClick={() => setFileUrl("")} className={formButton}>
                  Delete To Upload A Different Image
                </button>
              )}
            </>
          )}

          <button
            type={"submit"}
            id="upload-button"
            className={anyError ? errorButton : formButton}
            disabled={anyError}
          >
            Create Digital Asset
          </button>
        </form>
      )}
    </div>
  );
}
