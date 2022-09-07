import React, {useState, useContext, useEffect} from 'react'
import {AppState} from "../App";
import {ethers} from "ethers";


 
const Recipients = () => {
  const App = useContext(AppState);

  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [data, setData] = useState([]);
  const [num,setNum] = useState(0);

  useEffect(() => {
    async function getData(){
      const recipients = await App.pipersContract.filters.recipeints(App.address);
      const recipientsData = await App.pipersContract.queryFilter(recipients);
      setData(recipientsData)
    }
    getData();
  },[num])

  const addRecipient = async () => {
    try{
      const tx = await App.pipersContract.addRecipient(recipientAddress, recipientName);
      await tx.wait();
      setMessage("Recipient Saved Sucessfully!")
      setRecipientAddress('');
      setRecipientName('');
    }catch (error) {
      setError(error.message)
    }
    let nextnum = num + 1
    setNum(nextnum);
  }

  const setRecipient = (address, name) => {
    App.setRecipientAddress(address)
    setMessage("Selected the " + name + "'s address")
  }

  return (
    <div className='flex flex-col items-center justify-center py-3 px-4 text-white'>
      <input onChange={(e) => setRecipientAddress(e.target.value)} value={recipientAddress} className='w-4/5 p-3 bg-black border-2 border-blue-900 border-opacity-60 bg-opacity-70 outline-none rounded-lg' placeholder='Paste Recipient Address'/>

      <input onChange={(e) => setRecipientName(e.target.value)} value={recipientName} className=' mt-2 w-4/5 p-3 bg-black border-2 border-blue-900 border-opacity-60 bg-opacity-70 outline-none rounded-lg' placeholder='Paste Recipient Name'/>

      <div onClick={addRecipient} className='flex mt-4 w-1/4 cursor-pointer justify-center items-center p-2 bg-green-700 hover:bg-green-900 bg-opacity-70 border-2 border-blue-900 border-opacity-80 text-xl font-medium rounded-lg'>
          Add Beneficiary
      </div>

      <p className='text-red-600 max-w-full flex overflow-hidden p-2 text-sm mt-2 px-3'>{error}</p>
      <p className='text-green-600 text-lg mt-2 px-1'>{message}</p>

      <div className='flex flex-col items-center justify-center mt-4 w-full'>
        {data.map ((e) => {
          return (
            <div onClick={() => setRecipient(e.args.recipient, e.args.recipentName)}  className={ ` bg-black cursor-pointer rounded-lg bg-opacity-60 border-2 border-blue-900 border-opacity-80 w-3/4  mt-2 ` }>
                <div className='flex  w-full items-center justify-center rounded-t-lg'>
                    <div className=' w-full py-2 px-2'>
                        <p className=' text-base  font-mono'>Name: {e.args.recipentName}</p>
                        <p className=' text-base pt-1  font-mono'>Addresh: {e.args.recipient} </p>
                    </div>
                </div>
            </div>
        )})}

      </div>
    </div>
  )
}

export default Recipients
 