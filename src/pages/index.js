import React from "react";
import Head from "next/head";

const Home = () => {
  return (
    <>
      <Head>
        <title>Sfn Voting dApp</title>
      </Head>
      <div className="min-h-screen flex flex-col  justify-center items-center">
        <h1 className="p-4 text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-gray-800">
          Welcome to the future of voting!
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 text-center p-12">
          Sfn Voting dApp is a decentralized application built on the Polygon
          blockchain that ensures a secure, transparent, and tamper-proof voting
          experience. Say goodbye to voter fraud and long waiting times. With
          Sfn Voting dApp, you can participate in elections from the comfort of
          your home using your digital wallet.
        </p>
        <div className="mt-8 space-x-4">
          <a
            href="/Candidates" // Replace this with your voting page route
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-300"
          >
            Vote
          </a>
          <a
            href="/Candidate" // Replace this with your add candidate page route
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-300"
          >
            Add Candidate
          </a>
        </div>
      </div>
    </>
  );
};

export default Home;
