// components/CandidateForm.js
import React, { useEffect, useState } from "react";

import { create as ipfsHttpClient } from "ipfs-http-client";

import { Web3Auth } from "@web3auth/modal";

import voting from "/contracts/voting.json";

import { ethers } from "ethers";

import Head from "next/head";

import Loading from "react-loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const projectId = "2MyNroGl6iLE7zAs4P4RNLzSAES";
const projectSecret = "72901dfa73bf4a41fe20077f44f2aa0b";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const Candidate = () => {
  const [web3Auth, setWeb3auth] = useState(null);
  const [userAddress, setUserAddress] = useState();
  const [userBalance, setUserBalance] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userImage, setUserImage] = useState();

  const [fileIsUploading, setFileIsUploading] = useState(false);
  const [pdfFileIsUploading, setpdfFileIsUploading] = useState(false);
  const [inite, setInite] = useState(false);
  const [add, setAdd] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // candidate field
  const [candidateName, setCandidateName] = useState("");
  const [candidateParty, setCandidateParty] = useState("");
  const [candidateDescription, setCandidateDescription] = useState("");
  const [candidatePdf, setCandidatePdf] = useState("");
  const [candidateImage, setCandidateImage] = useState("");

  function handleName(e) {
    console.log(e.target.value);
    setCandidateName(e.target.value);
  }

  function handleParty(e) {
    console.log(e.target.value);
    setCandidateParty(e.target.value);
  }

  function handleDescription(e) {
    console.log(e.target.value);
    setCandidateDescription(e.target.value);
  }

  // This function uploads image file to IPFS
  async function uploadFileToIpfs(e) {
    setFileIsUploading(true);
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://sfnmarket.infura-ipfs.io/ipfs/${added.path}`;
      console.log(url);
      setCandidateImage(url);
      toast("File uploaded to IPFS!", { type: "success" });
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
    setFileIsUploading(false);
  }

  // This function uploads pdf,mp4 file to IPFS
  async function uploadPdfFileToIpfs(e) {
    setpdfFileIsUploading(true);
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const pdfUrl = `https://sfnmarket.infura-ipfs.io/ipfs/${added.path}`;
      console.log(pdfUrl);
      setCandidatePdf(pdfUrl);
      toast("File uploaded to IPFS!", { type: "success" });
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
    setpdfFileIsUploading(false);
  }

  async function init() {
    setInite(true);
    const web3auth = new Web3Auth({
      clientId:
        "BErlbFHmO6H4yEHpzZK1zmnpbBt5jToooT9hFXQHEYAqotCVxLOxSVOPTTHrwfIt-3xw2UnNfy8BQrzR1fXMNjQ", // Get your Client ID from Web3Auth Dashboard
      chainConfig: {
        chainNamespace: "eip155",
        chainId: "0x13881", // hex of 80001, polygon testnet
        rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
        // Avoid using public rpcTarget in production.
        // Use services like Infura, Quicknode etc
        displayName: "Polygon Mumbai Testnet",
        blockExplorer: "https://mumbai.polygonscan.com/",
        ticker: "MATIC",
        tickerName: "Matic",
      },
      uiConfig: {
        appLogo:
          "https://nextup.cccco.edu/wp-content/uploads/2019/07/NextUp_all_colors-1000x705.png",
        defaultLanguage: "en",
      },
    });

    const res = await web3auth.initModal();
    // const web3authProvider = await web3auth.connect();
    // const provider = new ethers.providers.Web3Provider(web3authProvider);
    // const signer = provider.getSigner();
    // // Get user's Ethereum public address
    // const address = await signer.getAddress();

    // // Get user's balance in ether
    // const balance = ethers.utils.formatEther(
    //   await provider.getBalance(address) // Balance is in wei
    // );
    // setUserAddress(address);
    // setUserBalance(balance);

    // console.log(res);
    console.log(voting.address);

    setWeb3auth(web3auth);
    setInite(false);
  }

  async function login() {
    if (web3Auth) {
      const web3authProvider = await web3Auth.connect();
      const provider = new ethers.providers.Web3Provider(web3authProvider);
      const signer = provider.getSigner();
      // Get user's Ethereum public address
      const address = await signer.getAddress();
      // Get user's balance in ether
      const balance = ethers.utils.formatEther(
        await provider.getBalance(address) // Balance is in wei
      );
      const res_02 = await web3Auth.getUserInfo();

      // const privateKey = await web3Auth.provider.request({
      //   method: "eth_private_key",
      // });
      console.log(web3authProvider);
      console.log("res2", res_02);
      console.log("address", address);
      console.log("balance", balance);
      setUserAddress(address);
      setUserBalance(balance);
      setUserEmail(res_02.email);
      setUserImage(res_02.profileImage);
      const contract = new ethers.Contract(
        voting.address,
        voting.abi,
        provider
      );
      let transaction = await contract.getCandidates();
      console.log(transaction);
    }
  }

  async function disconnect() {
    // Disconnect the wallet, assuming web3Auth.disconnect() is available
    if (web3Auth) {
      await web3Auth.logout();
    }

    // Clear user data
    setUserAddress("");
    setUserBalance("");
    setUserEmail("");
    setUserImage("");
  }

  // function to create and add a candidate
  async function addCandidate() {
    if (
      (!candidateName, !candidateParty, !candidateImage, !candidateDescription)
    ) {
      alert("Fill all the fields before adding!");
      return;
    }
    setAdd(true);
    try {
      if (web3Auth) {
        const web3authProvider = await web3Auth.connect();
        const provider = new ethers.providers.Web3Provider(web3authProvider);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          voting.address,
          voting.abi,
          signer
        );

        let transaction = await contract.createCandidate(
          candidateName,
          candidateParty,
          candidatePdf,
          candidateImage,
          candidateDescription
        );
        let tx = await transaction.wait();
        toast("Candidate added successfully!", { type: "success" });
        console.log(tx);
      }
    } catch (error) {
      alert(error);
    }
    setAdd(false);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Head>
        <title>Sfn Voting dApp</title>
      </Head>
      <div className="flex flex-col items-center">
        <ToastContainer />
        <h1 className="text-sm mt-3 italic font-semibold flex flex-col items-center	">
          This page is restricted to contract owner only !
          <p className="text-orange-700 m-auto">Log in is required!</p>
        </h1>
        {inite && (
          <div className="mt-2 flex items-center gap-2 justify-center">
            Initiating...(please wait!)
            <Loading type="spin" color="black" height={20} width={20} />
          </div>
        )}
        <button
          onClick={login}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4  rounded-md shadow-md transition-colors m-auto mt-4 duration-300"
        >
          {userAddress ? (
            <span className="m-auto">
              <p className=" text-black text-sm mt-3 italic font-semibold">
                Connected Successfully!
              </p>{" "}
              {userEmail && (
                <h5 className=" text-black text-sm mt-3 italic font-semibold">
                  Email : <span>{userEmail}</span>
                </h5>
              )}
              <h5 className=" text-black text-sm mt-3 italic font-semibold">
                Wallet Address :{" "}
              </h5>
              <span> {userAddress}</span>
              <h5 className=" text-black text-sm mt-3 italic font-semibold">
                Balance :
              </h5>
              <span>{userBalance}</span> MATIC
              {userImage && (
                <img
                  src={userImage}
                  width={100}
                  height={100}
                  className="m-auto mt-4 rounded-full "
                />
              )}
            </span>
          ) : (
            <span>Sign in</span>
          )}
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4  rounded-md shadow-md transition-colors m-auto mt-4 duration-300"
          onClick={disconnect}
        >
          Log out
        </button>

        <form className="w-full max-w-md mx-auto mt-20 bg-gray-200 p-6 rounded-md shadow-md">
          <h2 className="text-2xl mb-4 font-semibold text-gray-800">
            Political Candidate
          </h2>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              placeholder="Enter you full name..."
              onChange={handleName}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="party"
            >
              Party
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="party"
              id="party"
              onChange={handleParty}
            >
              <option value="option1">Click to choose your party...</option>
              <option value="PJD">PJD</option>
              <option value="PAM">PAM</option>
              <option value="XYZ">XYZ</option>
              <option value="7ezb">7ezb</option>
              <option value="7ezb2">7ezb2</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description <p className="italic ">(your future, vision...etc)</p>
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              rows="4"
              placeholder="Describe your project,your vision..."
              onChange={handleDescription}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="image"
            >
              Upload project details{" "}
              <span className="text-red font-bold"> (pdf,mp4 only)</span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="pdf_file"
              type="file"
              name="pdf_file"
              onChange={uploadPdfFileToIpfs}
              required
            />
            {pdfFileIsUploading && (
              <div className="mt-2 flex justify-center">
                <Loading type="spin" color="black" height={30} width={30} />
              </div>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="image"
            >
              Upload Image of the candidate
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="image"
              type="file"
              name="image"
              accept="image/*"
              onChange={uploadFileToIpfs}
              required
            />
            {fileIsUploading && (
              <div className="mt-2 flex justify-center">
                <Loading type="spin" color="black" height={30} width={30} />
              </div>
            )}
            {candidateImage && (
              <img
                src={candidateImage}
                alt="image_candidate"
                width={150}
                height={150}
                className="m-auto mt-4 rounded-full"
              />
            )}
          </div>
        </form>
        <div className="flex items-center justify-between">
          <div className="flex flex-col m-auto w-auto items-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded focus:outline-none focus:shadow-outline"
              onClick={addCandidate}
            >
              Add Candidate
            </button>{" "}
            {add && (
              <div className="mt-2 flex justify-center">
                <Loading type="spin" color="black" height={30} width={30} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Candidate;
