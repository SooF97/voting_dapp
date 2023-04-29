import React, { useState, useEffect } from "react";
import { Web3Auth } from "@web3auth/modal";
import voting from "/contracts/voting.json";
import { ethers } from "ethers";
import Link from "next/link";
import Head from "next/head";
import Loading from "react-loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Candidates = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);

      try {
        const provider = new ethers.providers.StaticJsonRpcProvider(
          "https://rpc.ankr.com/polygon_mumbai	"
        );

        const contract = new ethers.Contract(
          voting.address,
          voting.abi,
          provider
        );

        const candidateData = await contract.getCandidates();

        setCandidates(candidateData);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        toast.error("Failed to fetch candidates. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (candidates.length === 0) {
    return (
      <div className="mt-2 flex justify-center text-3xl md:text-4xl text-center font-bold text-gray-800 mb-6">
        No participants yet !
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Participants - Sfn Voting dApp</title>
      </Head>
      <div className="bg-gray-100 min-h-screen py-8">
        <h1 className="text-3xl md:text-4xl text-center font-bold m-2 text-gray-800 mb-6">
          Candidates participating in the election
        </h1>
        {isLoading ? (
          <div className="flex justify-center">
            <Loading type="spin" color="black" height={50} width={50} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 m-3 justify-center">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white border border-gray-300 rounded p-4 flex flex-col justify-between"
              >
                <img
                  src={candidate.imageUrl}
                  alt={candidate.fullName}
                  className="w-24 h-24 mx-auto mb-4 rounded-full"
                />
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    {candidate.fullName}
                  </h3>
                  <p className="text-gray-700 mb-2">
                    <span className="tracking-wider font-bold"> Id: </span>{" "}
                    {candidate.id.toString()}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="tracking-wider font-bold">Party:</span>{" "}
                    {candidate.party}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="tracking-wider font-bold">
                      Number of Votes:
                    </span>{" "}
                    {candidate.numberOfVotes.toString()}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="tracking-wider font-bold">
                      Project Description:
                    </span>{" "}
                    {candidate.projectDescription}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="tracking-wider font-bold">
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
                <div className="text-center">
                  <Link legacyBehavior href={`/${candidate.id.toString()}`}>
                    <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-3 rounded focus:outline-none focus:shadow-outline">
                      More Details
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Candidates;
