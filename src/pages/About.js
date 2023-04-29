import Head from "next/head";
import { FaShieldAlt, FaLock, FaChartLine } from "react-icons/fa";

export default function About() {
  return (
    <>
      <Head>
        <title>About - Sfn Voting dApp</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            About Sfn Voting dApp
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-4 bg-gray-200 rounded-lg">
              <FaShieldAlt className="text-5xl text-purple-600 mb-4" />
              <p className="text-gray-800 text-lg font-semibold mb-2">
                Unparalleled Security
              </p>
              <p className="text-gray-700">
                Sfn Voting dApp ensures the highest level of security for your
                votes, utilizing advanced cryptographic techniques and
                blockchain technology.
              </p>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-200 rounded-lg">
              <FaLock className="text-5xl text-purple-600 mb-4" />
              <p className="text-gray-800 text-lg font-semibold mb-2">
                Transparent & Trustworthy
              </p>
              <p className="text-gray-700">
                With the power of the Ethereum blockchain, our decentralized
                platform guarantees transparency and trust in the electoral
                process.
              </p>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-200 rounded-lg">
              <FaChartLine className="text-5xl text-purple-600 mb-4" />
              <p className="text-gray-800 text-lg font-semibold mb-2">
                Real-Time Updates
              </p>
              <p className="text-gray-700">
                Stay informed with real-time updates and access to election
                results, enabling you to actively participate in the democratic
                process.
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center mt-8">
            <span className="text-xl font-semibold text-gray-800">
              Join us in revolutionizing the future of voting!
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
