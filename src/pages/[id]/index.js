import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { Web3Auth } from "@web3auth/modal";
import voting from "/contracts/voting.json";
import Link from "next/link";
import Head from "next/head";
import Loading from "react-loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Candidate() {
  const [candidate, setCandidate] = useState(null);
  const [web3Auth, setWeb3Auth] = useState(null);

  const [userAddress, setUserAddress] = useState();
  const [userBalance, setUserBalance] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userImage, setUserImage] = useState("");

  const [voterCin, setVoterCin] = useState("");
  const [voterAge, setVoterAge] = useState("");
  const [voterGender, setVoterGender] = useState("");
  const [voterCity, setVoterCity] = useState("");
  const [voterCountry, setVoterCountry] = useState("");

  const [voted, setVoted] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  // functions to handle changes
  function handleCin(e) {
    console.log(e.target.value);
    setVoterCin(e.target.value);
  }

  function handleAge(e) {
    console.log(e.target.value);
    setVoterAge(e.target.value);
  }

  function handleGender(e) {
    console.log(e.target.value);
    setVoterGender(e.target.value);
  }

  function handleCity(e) {
    console.log(e.target.value);
    setVoterCity(e.target.value);
  }

  function handleCountry(e) {
    console.log(e.target.value);
    setVoterCountry(e.target.value);
  }

  async function login() {
    if (web3Auth) {
      const web3AuthProvider = await web3Auth.connect();
      const provider = new ethers.providers.Web3Provider(web3AuthProvider);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = ethers.utils.formatEther(
        await provider.getBalance(address)
      );
      const res_02 = await web3Auth.getUserInfo();
      setUserAddress(address);
      setUserBalance(balance);
      setUserEmail(res_02.email);
      setUserImage(res_02.profileImage);
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

  async function makeVote() {
    if ((!voterCin, !voterAge, !voterGender, !voterCity, !voterCountry)) {
      alert("Fill all the fields before voting!");
      return;
    }
    setVoted(true);
    try {
      if (web3Auth) {
        const web3AuthProvider = await web3Auth.connect();
        const provider = new ethers.providers.Web3Provider(web3AuthProvider);
        const signer = provider.getSigner();
        const voterAddress = signer.getAddress();
        const contract = new ethers.Contract(
          voting.address,
          voting.abi,
          signer
        );
        let transaction = await contract.vote(
          id,
          voterCin,
          voterCity,
          voterCountry,
          voterGender,
          voterAge,
          voterAddress
        );
        let tx = await transaction.wait();
        console.log("texxx", tx);
        toast(`You voted for ${candidate.fullName}!`, { type: "success" });
      }
    } catch (error) {
      alert(error);
    }
    setVoted(false);
  }

  function sliceString(input) {
    const start = input.slice(0, 4);
    const end = input.slice(-4);
    return start + "..." + end;
  }

  useEffect(() => {
    if (id) {
      async function init() {
        const web3Auth = new Web3Auth({
          clientId:
            "BErlbFHmO6H4yEHpzZK1zmnpbBt5jToooT9hFXQHEYAqotCVxLOxSVOPTTHrwfIt-3xw2UnNfy8BQrzR1fXMNjQ",
          web3AuthNetwork: "testnet",
          chainConfig: {
            chainNamespace: "eip155",
            chainId: "0x13881",
            rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
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

        await web3Auth.initModal();
        // const web3AuthProvider = await web3Auth.connect();
        const provider = new ethers.providers.StaticJsonRpcProvider(
          "https://endpoints.omniatech.io/v1/matic/mumbai/public	"
        );
        // const signer = provider.getSigner();
        // const address = await signer.getAddress();
        // const balance = ethers.utils.formatEther(
        //   await provider.getBalance(address)
        // );
        // const res_02 = await web3Auth.getUserInfo();
        // console.log("res2", res_02);
        // setUserAddress(address);
        // setUserBalance(balance);
        // setUserEmail(res_02.email);
        // setUserImage(res_02.profileImage);
        // console.log(userImage);
        const contract = new ethers.Contract(
          voting.address,
          voting.abi,
          provider
        );

        try {
          const candidateInfo = await contract.getCandidateInfo(id);
          setCandidate(candidateInfo);
        } catch (err) {
          console.error("Error fetching candidate info:", err);
        }
        setWeb3Auth(web3Auth);
      }

      init();
    }
  }, [id]);

  if (!candidate) {
    return (
      <div className="mt-2 flex justify-center">
        Loading...
        <Loading type="spin" color="black" height={30} width={30} />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Candidate {id} </title>
      </Head>
      <ToastContainer />
      <div className="flex flex-wrap justify-center min-h-screen bg-gray-100 items-center mt-0 justify-center gap-10 w-auto">
        <div className="flex flex-col bg-white p-8 rounded-lg shadow-md lg:w-1/3 md:w-1/2 sm:w-auto m-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">
              Candidate ID: {candidate.id.toString()}
            </h1>
            <h1 className="text-2xl font-bold mb-4">{candidate.fullName}</h1>
            <img
              className="rounded-full m-auto"
              src={candidate.imageUrl}
              alt={candidate.fullName}
              width={150}
              height={150}
            />
            <p className="text-gray-700 mb-2">
              <span className="text-red-800 font-bold italic">Party:</span>{" "}
              {candidate.party}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="text-red-800 font-bold italic">Votes:</span>{" "}
              {candidate.numberOfVotes.toString()}
            </p>
            <p className="text-gray-700 mb-4">
              <span className="text-red-800 font-bold italic">
                Project Description:
              </span>{" "}
              {candidate.projectDescription}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="text-red-800 font-bold italic">
                Project file:
              </span>{" "}
              <Link
                href={candidate.pdfUrl}
                className="text-blue-600 hover:text-blue-800 transition duration-200 underline"
                target="_blank"
              >
                Visit link
              </Link>
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md lg:w-1/3 md:w-1/2 sm:w-auto m-4">
          <h2 className="text-2xl font-bold mb-4">Voter Information</h2>

          <div className="flex flex-col">
            <label htmlFor="name" className="text-lg font-semibold mb-2">
              Id Number (CIN)
            </label>
            <input
              type="text"
              id="Id"
              onChange={handleCin}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              placeholder="Enter you id number"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="age" className="text-lg font-semibold mb-2">
              Age
            </label>
            <input
              type="text"
              id="age"
              onChange={handleAge}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              placeholder="Enter you age"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="address" className="text-lg font-semibold mb-2">
              Gender
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="gender"
              id="gender"
              onChange={handleGender}
              required
            >
              <option value="option1">Select your gender...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="name" className="text-lg font-semibold mb-2">
              City
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="city"
              id="city"
              onChange={handleCity}
              required
            >
              <option value="option1">Choose your city...</option>
              <option value="Casablanca">Casablanca</option>
              <option value="Rabat">Rabat</option>
              <option value="Kenitra">Kenitra</option>
              <option value="Tanger">Tanger</option>
              <option value="Tetouan">Tetouan</option>
              <option value="Marrakech">Marrakech</option>
              <option value="Laayoune">Laayoune</option>
              <option value="Dakhla">Dakhla</option>
              <option value="Fes">Fes</option>
              <option value="Taza">Taza</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg font-semibold mb-2">
              Country (Where you live in)
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="country"
              id="country"
              onChange={handleCountry}
              required
            >
              <option value="option1">Choose your country...</option>
              <option value="Morocco">Morocco</option>
              <option value="Spain">Spain</option>
              <option value="France">France</option>
              <option value="Belgium">Belgium</option>
              <option value="Germany">Germany</option>
              <option value="Suisse">Suisse</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Portugal">Portugal</option>
              <option value="Australia">Australia</option>
            </select>
          </div>

          <div className="flex flex-col m-auto w-auto items-center">
            <button
              onClick={login}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4  rounded-md shadow-md transition-colors m-auto mt-4 duration-300 "
            >
              {userAddress ? (
                <span className="m-auto">
                  <p className="text-black text-sm mt-3 italic font-semibold">
                    Connected Successfully!
                  </p>{" "}
                  {userEmail && (
                    <h5 className="text-black text-sm mt-3 italic font-semibold">
                      Email: <span>{userEmail}</span>
                    </h5>
                  )}
                  <h5 className="text-black text-sm mt-3 italic font-semibold">
                    Wallet Address:{" "}
                  </h5>
                  <span>{sliceString(userAddress)}</span>
                  <h5 className="text-black text-sm mt-3 italic font-semibold">
                    Balance:
                  </h5>
                  <span>{userBalance}</span> MATIC
                  {userImage && (
                    <img
                      src={userImage}
                      width={100}
                      height={100}
                      className="m-auto mt-4 rounded-full"
                    />
                  )}
                </span>
              ) : (
                <span>Log in</span>
              )}
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4  rounded-md shadow-md transition-colors m-auto mt-4 duration-300"
              onClick={disconnect}
            >
              Log out
            </button>
          </div>
          <div className="flex flex-col m-auto w-auto items-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
              onClick={makeVote}
            >
              Vote
            </button>
            {voted && (
              <div className="mt-2 flex justify-center">
                <Loading type="spin" color="black" height={30} width={30} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
