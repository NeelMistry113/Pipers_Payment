import {useState, createContext, useEffect} from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Login from './components/Login';
import {ethers} from 'ethers';
import pipers from "./pipers/pipers.json";

const AppState = createContext();

function App() {
  const {ethereum} = window; 
  const [login, setLogin] = useState(false);
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState(''); 
  const [symbol, setSymbol] = useState('');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('');
  const [ercTokenAddress, setErcTokenAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [pipersContractAddress, setPipersContractAddress] = useState('');
  const [explorer, setExplorer] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [tokenChanged, setTokenChanged] = useState(false);
  const [showErc, setShowErc] = useState(false);
  const [ercLoading ,setErcLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [showRecentTx, setShowRecentTx] = useState(false);
  const [recentTx, setRecentTx] = useState({
    txhash: '',
    from: '',
    to: '',
    amount: '',
    symbol: '',
  });
  const [saveTxLoad, setSaveTxload] = useState(false);


  /**
   * send.js function
   */
   const provider = new ethers.providers.Web3Provider(window.ethereum);
   const signer = provider.getSigner();

   // ABI fiching from user
   const ERCABI = [
       "function balanceOf(address) view returns (uint)",
       "function transfer(address to, uint amount) returns (bool)",
       "function symbol() external view returns (string memory)",
       "function name() external view returns (string memory)"
   ]
    
   // Contracts 
   const ERCContract = new ethers.Contract(ercTokenAddress, ERCABI, signer);

   const pipersContract = new ethers.Contract(pipersContractAddress, pipers.output.abi, signer);

   const selectToken = async () =>{
    try{
       setErcLoading(true);
       const name = await ERCContract.name();
       const balance = await ERCContract.balanceOf(address);
       const symbol = await ERCContract.symbol();
       setBalance(ethers.utils.formatEther(balance))
       setSymbol(symbol);
       setCurrency(name);
       setTokenChanged(true);
       setErcLoading(false);
     }catch(error){
      setError(error.message)
      setErcLoading(false)
      setMessage('');
     } 
   }

   const removeToken = async () => {
      try{
       if(chain === "Ropsten") {
           setCurrency("RopstenEther")
           setSymbol("rEth")
       } else if(chain === "Rinkeby") {
           setCurrency("RinkebyEther")
           setSymbol("rEth")
       }else if(chain === "polygon") {
           setCurrency("Matic")
           setSymbol("Matic")
       }

       setErcTokenAddress('');
       setShowErc(false);
       setTokenChanged(false);  
       getBal();
      }catch(error) {
        setError(error.message)
        setMessage('');
      }
   }


 const transferAmount = async () => {
  setMessage('');
  setTxLoading(true);
   try{
       if(tokenChanged) {
           const tx =  await ERCContract.transfer(recipientAddress, ethers.utils.parseEther(amount));
           await tx.wait();
           selectToken();

           setRecentTx({
            txhash: tx.hash,
            from: address,
            to: recipientAddress,
            amount: amount,
            symbol: symbol
           })

           setShowRecentTx(true);

       } else {
           //here contract function is used 
           const tx = await pipersContract._transfer(recipientAddress, symbol, {
               value: ethers.utils.parseEther(amount)
           });
           await tx.wait();
           getBal();
       }
       setMessage("Transction Sucessfull!")
       setAmount('');
   } catch (error) {
       setError(error.message);
       setAmount('');
       setMessage('');
   }
   setTxLoading(false);
 } 

  // savetx function
  const savetx = async () => {
    setSaveTxload(true)
    try{
      const tx = await pipersContract.saveTX(recentTx.from, recentTx.to, ethers.utils.parseEther(recentTx.amount), recentTx.symbol);
      await tx.wait();

      setMessage("Transaction Saved Sucessfully!")
    }catch (error) {
      setError(error.message)
    }

    setShowRecentTx(false);
    setSaveTxload(false);
  }


  // Balance Update
    async function getBal() {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner();
      const balance = await signer.getBalance();
      setBalance(ethers.utils.formatEther(balance))
    }

  // below useEffect work for change the chain
  useEffect(() => {
      ethereum.on("chainChanged", async (chainId) => {
        if(chainId == "0x3") {
          setChain("Ropsten")
          setCurrency("RopstenEther")
          setSymbol("rEth")
          setPipersContractAddress('0x698c6DFc6692e7cb17369A4d206c93F0BD137835')
          setExplorer("https://ropsten.etherscan.io/")
        } else if(chainId == "0x4"){
          setChain("Rinkeby")
          setCurrency("RinkebyEther")
          setSymbol("rEth")
          setPipersContractAddress('0x0c6C6cf873123Ccd93BcE6afFB6fA9D3740C50be')
          setExplorer("https://rinkeby.etherscan.io")
        } else if (chainId == "0x13881") {
          setChain("Polygon")
          setCurrency("Matic")
          setSymbol("Matic")
          setPipersContractAddress('0xD43E17ae054c60FB2e9B9afB7e54d630b73DfF04')
          setExplorer("https://mumbai.polygonscan.com/")
        } else {
          setLogin(false);
        }

        getBal();
      })

      ethereum.on("accountsChanged", async (accounts) => {
          setAddress(accounts[0])
      })
  }, [])

  useEffect(() => {
    if(tokenChanged){
      selectToken();
      setError();
    } else {
      getBal();
      setError();
    }
  }, [address])

  useEffect(() => {
    removeToken();
    setError();
  }, [chain])

  return (
    <AppState.Provider value={{login, setLogin, address, setAddress, chain, setChain ,symbol, setSymbol, balance, setBalance, currency, setCurrency, getBal, ercTokenAddress, setErcTokenAddress, recipientAddress, setRecipientAddress, amount, setAmount, pipersContractAddress, setPipersContractAddress, explorer, setExplorer, error,setError, message, setMessage, tokenChanged, setTokenChanged, selectToken, removeToken, transferAmount, showErc, setShowErc, ercLoading, setErcLoading, txLoading, showRecentTx, setShowRecentTx, recentTx, setRecentTx, saveTxLoad, setSaveTxload, savetx, pipersContract }}>
      <div className="min-w-full h-screen">
        { login ?
          <div className='min-w-full min-h-full'>
            {/* Main Application */}
            <Header/>
            <Main/>
          </div>
          :
          <Login/>  
        }
      </div>
    </AppState.Provider>
  );
}

export default App;
export {AppState}
