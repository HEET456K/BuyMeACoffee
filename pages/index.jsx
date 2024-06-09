import Head from 'next/head';
import React, { useEffect, useState } from "react";
import abi from '../utils/BuyMeACoffee.json';
import { ethers } from 'ethers';
import NameForm from './components/NameForm';
import Main from './components/Main.jsx';
import Header from './components/Header.jsx';
import Description from './components/Description';

export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0x291F8546b004d752529d8704426a0A0FE6a136f0";
  const contractABI = abi.abi;

  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);
  const [coffeeCount, setCoffeeCount] = useState(0);

  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  }

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have Metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        console.log("Wallet is connected: " + account);
      } else {
        console.log("Make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Please install MetaMask");
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const buyACoffee = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        console.log(buyMeACoffee);
        console.log(signer);
        console.log(provider);

        console.log("buying coffee..")

        const coffeeTxn = await buyMeACoffee.buyACoffee(
          name ? name : "person",
          message ? message : "Enjoy your coffee!",
          { value: ethers.utils.parseEther("0.001", "ether") }
        );


        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");
        setCoffeeCount(coffeeCount + 1);
        // Clear the form fields.
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("fetched!");
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getMemos();

    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name
        }
      ]);
    };

    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Buy Me A Coffee</title>
        <meta name="description" content="Buy Me A Coffee" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Main />
      <Description />
      <NameForm
        name={name}
        onNameChange={onNameChange}
        message={message}
        onMessageChange={onMessageChange}
        buyCoffee={buyACoffee}
        connectWallet={connectWallet}
        currentAccount={currentAccount}
        memos={memos}
      />
    </div>
  );
}
