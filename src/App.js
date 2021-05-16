import React, { useState, useEffect } from "react";
import axios from "axios";

import ZombieFactory from "./artifacts/contracts/zombiefactory.sol/ZombieFactory.json";
import ZombieFeeding from "./artifacts/contracts/zombiefeeding.sol/ZombieFeeding.json";
import { ethers } from "ethers";
import "./App.css";

const ZombieFactoryAddress = "0x21fab6710ff064e6D662f3089DD2CE23aC4eB8DD";
const ZombieFeedingAddress = "0xE28b99E2a7D4456a67d42bd9b8D27e47D8d0e2b2";

function App() {
  console.log({ ZombieFactory: ZombieFactory.abi });
  console.log({ ZombieFeeding: ZombieFeeding.abi });
  const [zombieName, setZombieName] = useState("");
  const [transaction, setTransaction] = useState({});
  const [kitties, setKitties] = useState([]);
  const [myZombie, setMyZombie] = useState({});

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const createZombie = async (name) => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        ZombieFeedingAddress,
        ZombieFeeding.abi,
        provider.getSigner()
      );
      try {
        const data = await contract.createRandomZombie(name);
        setTransaction(data);
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  };

  const EatKitty = async (kittyId) => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        ZombieFeedingAddress,
        ZombieFeeding.abi,
        provider.getSigner()
      );
      try {
        console.log({myZombidId: myZombie.id, kittyId});
        const data = await contract.feedOnKitty(myZombie.id, kittyId);
      setTransaction(data);
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        ZombieFeedingAddress,
        ZombieFeeding.abi,
        provider.getSigner()
      );
      contract.on("NewZombie", (id, name, dna) => {
        setMyZombie({ id: Number(id), name, dna : String(dna) });
      });
    }
  }, [transaction]);
  
  console.log(myZombie);
  useEffect(() => {
    axios.get("https://api.cryptokitties.co/kitties/").then((res) => {
      setKitties(res.data.kitties);
    });
  }, []);

  console.log(kitties && kitties);

  return (
    <div className="App">
      <input
        placeholder="Input zombie name"
        onChange={(e) => setZombieName(e.target.value)}
        value={zombieName}
      />
      <button onClick={() => createZombie(zombieName)}>
        Create a new zombie
      </button>
      {myZombie && myZombie.name && (
        <div className="myZombie-container">
          <div className="myZombie">
            <h4>Name : {myZombie.name}</h4>
            <h4>DNA : {myZombie.dna}</h4>
          </div>
        </div>
      )}
      <div className="kitties-container">
        {kitties &&
          kitties.map((kitty) => (
            <div className="kitty-card" onClick={()=>EatKitty(kitty.id)}>
              <h4>{kitty.name}</h4>
              <img src={kitty.image_url} alt={kitty.name} width={100} />
              <div className="attack">
                <h4>Eat</h4>
              </div>
            </div>
            
          ))}
      </div>
    </div>
  );
}

export default App;
