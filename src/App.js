import React from 'react'
import Web3 from 'web3';
import "./App.css"

const App = () => {
  let account = null;
  let accessToken = null;
  const connect = async () => {
    if(window.ethereum){
      await window.ethereum.send('eth_requestAccounts')
      window.w3 = new Web3(window.ethereum)
      var accounts = await window.w3.eth.getAccounts()
      account = accounts[0]

      accessToken = await authenticate()
      // 
      console.log("accessToken:>>>>>",accessToken)
      alert(accessToken)

      let opts = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }

      let res = await fetch(`http://localhost:5000/api/v1/wallet/auth/secret`, opts)
      console.log("Res from secret route:>>", res)
      alert(await res.text())
    }
  }


  const authenticate = async() => {
    // let res = await fetch(`http://localhost:8000/api/v1/nonce?address=${account}`)
    let res = await fetch(`http://localhost:8000/api/v1/wallet/auth/nonce/${account}`)
    let resBody = await res.json()

    // console.log(resBody)
    let signature = await window.w3.eth.personal.sign(resBody.message, account)

    let opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resBody.tempToken}`
        }
    }

    res = await fetch(`http://localhost:8000/api/v1/wallet/auth/verify/${signature}`, opts)
    resBody = await res.json()
    console.log("resBody:>>>>", resBody)

    return resBody.token
  }

  return (
    <div className='main'>
      <h1>Login With Wallet</h1>
      <button onClick={connect}>Login</button>
    </div>
  )
}

export default App