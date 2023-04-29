import React, { useState, useEffect } from "react";

import GenderBarChart from "./components/GenderBarChart";
import GenderDoughnutChart from "./components/GenderDoughnutChart";
import Head from "next/head";

import Loading from "react-loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import voting from "/contracts/voting.json";
import { ethers } from "ethers";

const Analytics = () => {
  const [voters, setVoters] = useState([]);
  const [finaleResult, setFinaleResult] = useState([]);
  const [cityResult, setCityResult] = useState([]);

  const chartData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        label: "Gender Distribution",
        data: finaleResult,
        backgroundColor: ["#4B92F7", "#F77F82"],
        borderColor: ["#4B92F7", "#F77F82"],
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: ["#2e6ac1", "#e55365"],
      },
    ],
  };

  const chartData_2 = {
    labels: ["Casablanca", "Rabat", "Kenitra"],
    datasets: [
      {
        label: "City Distribution",
        data: cityResult,
        backgroundColor: ["#4B92F7", "#F9D627", "#27F94A"],
        borderColor: ["#4B92F7", "#F9D627", "#27F94A"],
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: ["#2e6ac1", "#8C2B03", "#2F8C03"],
      },
    ],
  };

  function counGenders(array) {
    let m = 0;
    let f = 0;
    if (array.length > 0) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].gender === "Male") {
          m++;
        } else if (array[i].gender === "Female") {
          f++;
        }
      }
    }
    setFinaleResult([m, f]);
  }

  function cityCalcul(array) {
    let c = 0;
    let r = 0;
    let k = 0;
    if (array.length > 0) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].city === "Casablanca") {
          c++;
        } else if (array[i].city === "Rabat") {
          r++;
        } else if (array[i].city === "Kenitra") {
          k++;
        }
      }
    }
    setCityResult([c, r, k]);
  }

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const provider = new ethers.providers.StaticJsonRpcProvider(
          "https://rpc.ankr.com/polygon_mumbai	"
        );

        const contract = new ethers.Contract(
          voting.address,
          voting.abi,
          provider
        );

        const votersData = await contract.getUsers();
        console.log(votersData);
        setVoters(votersData);
        counGenders(votersData);
        cityCalcul(votersData);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        toast.error("Failed to fetch candidates. Please try again.");
      } finally {
      }
    };

    fetchVoters();
  }, []);
  return (
    <>
      <Head>
        <title>Analytics - Sfn Voting dApp</title>
      </Head>
      <div className="container mx-auto p-4">
        <GenderBarChart data={chartData} />
      </div>
      <div className="container mx-auto p-4">
        <GenderDoughnutChart data={chartData_2} />
      </div>
    </>
  );
};

export default Analytics;
