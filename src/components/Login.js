import React, { useState, useContext } from 'react'
import { AppState } from '../App';


const Login = () => {
  const App = useContext(AppState)

  const {ethereum} = window;  
  const [error, setError] = useState('');


  const LoginWallet = async () => {
    try {
      await ethereum.request({method: "wallet_requestPermissions", params: [{eth_accounts: {}}]})
      const accounts = await ethereum.request({method: "eth_requestAccounts"})
      App.setAddress(accounts[0]);

      const chainId = await ethereum.request({method: "eth_chainId"})

      App.getBal();
      
      if(chainId == "0x3") {
        App.setChain("Ropsten")
        App.setLogin(true);
        App.setCurrency("RopstenEther")
        App.setSymbol("rEth")
        App.setPipersContractAddress('0x698c6DFc6692e7cb17369A4d206c93F0BD137835')
        App.setExplorer("https://ropsten.etherscan.io/")
      } else if(chainId == "0x4"){
        App.setChain("Rinkeby")
        App.setLogin(true);
        App.setCurrency("RinkebyEther")
        App.setSymbol("rEth")
        App.setPipersContractAddress('0x0c6C6cf873123Ccd93BcE6afFB6fA9D3740C50be')
        App.setExplorer("https://rinkeby.etherscan.io")
      } else if (chainId == "0x13881") {
        App.setChain("Polygon")
        App.setLogin(true);
        App.setCurrency("Matic")
        App.setSymbol("Matic")
        App.setPipersContractAddress('0xD43E17ae054c60FB2e9B9afB7e54d630b73DfF04')
        App.setExplorer("https://mumbai.polygonscan.com/")
      } else {
        setError("Please Use Polygon Mumbai either Rinkeby or Ropsten")
        App.setLogin(false);
      }

    } catch (error) {
      setError(`"${error.message}"`)
    }
  }

  return (
    <div className='min-w-full h-4/5 flex justify-center items-center flex-col'>
      <div className='flex flex-row items-center justify-center'>
        <img className='h-20' src='pied-piper.png'/>
        <p className='text-4xl font-mono font-bold text-green-500 ml-4'>Pipers Payment</p>
      </div>
     
      <div className='w-1/3 h-40 mt-4 bg-black bg-opacity-70 p-2 rounded-lg shadow-lg border-opacity-40 border-4 border-black flex flex-col justify-center items-center'>
      <h1 className='text-white text-2xl font-medium text-center'>Login</h1>
      {ethereum != undefined ?
        <div onClick={LoginWallet} className='flex border-opacity-60 bg-opacity-90 text-lg font-medium border-blue-800 cursor-pointer bg-green-700 hover:bg-green-900 text-white mt-4 rounded-lg justify-center items-center py-1 pl-2'>
            Connect With Metamask
            <img className='h-10' src='metamask.png'/>
        </div> 
        :
        <div className='flex flex-col justify-center items-center'>
          {/*Install Metamask*/}
          <a target={"_blank"} href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'>
          <div className='flex border-opacity-60 bg-opacity-90 text-lg  font-medium border-blue-800 cursor-pointer bg-green-800 text-white mt-4 rounded-lg justify-center items-center py-1 px-2'>
            Install Metamask
            <img className='h-10' src='metamask.png'/>
          </div> 
          </a>
          <p className='text-red-600 text-lg mt-2'>Login Required Metamask Extension</p>
        </div>
      }
      <p className='text-red-600 text-lg mt-2'>{error}</p>
      </div>
      <p className='font-mono text-base font-bold text-green-200 mt-2'>Acquired by Pied Piper</p>
    </div>
  )
}

export default Login
