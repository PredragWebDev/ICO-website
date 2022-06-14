import React, { Component } from 'react'

import RomanCrowdsale from '../build/contracts/RomanCrowdsale.json'
import MintableToken from '../build/contracts/MintableToken.json'
import getWeb3 from './utils/getWeb3'
import Loading from './Loading'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.onClickBuy = this.onClickBuy.bind(this)
    this.crowdsaleAddress = '0x6b070d930bB22990c83fBBfcba6faB129AD7E385'
    this.state = {
      web3: null,
      netId: null,
      defaultAccount: null,
      tokenAddress: 0x0,
      disabledBtn: false,
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3,
        })

        // Instantiate contract once web3 provided.
        this.instantiateContract()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const romanCrowdsale = contract(RomanCrowdsale)
    const mintableToken = contract(MintableToken)
    romanCrowdsale.setProvider(this.state.web3.currentProvider)
    mintableToken.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on romanCrowdsale.
    var romanCrowdsaleInstance, tokenInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      let token, totalSupply;
      romanCrowdsale.at(this.crowdsaleAddress).then((instance) => {
        this.romanCrowdsaleInstance = instance
        romanCrowdsaleInstance = instance
        console.log('cr', romanCrowdsaleInstance)
        // Stores a given value, 5 by default.
        return romanCrowdsaleInstance.token()
      }).then((_token) => {
        token = _token;
        // Get the value from the contract to prove it worked.
        tokenInstance = mintableToken.at(token);
        this.tokenInstance = tokenInstance
        console.log('tt', tokenInstance)
        return tokenInstance.totalSupply.call()
      }).then((totalSupply) => {
        totalSupply = this.state.web3.fromWei(totalSupply.toNumber(), 'ether')
        this.updateBalance(accounts[0]);
        this.setState({
          defaultAccount: accounts[0] || "Please Unlock Metamask",
          tokenAddress: token,
          crowdsaleAddress: romanCrowdsaleInstance.address,
          totalSupply: totalSupply
        })
      }).catch((e) => {
        console.error(e);
      })
    })

  }
  updateBalance(account) {
    return this.tokenInstance.balanceOf.call(account).then((balance) => {
      balance = this.state.web3.fromWei(balance.toNumber(), 'ether')
      this.setState({ tokenBalance: balance })
    })
  }

  checkTransaction(txId) {
    this.state.web3.eth.getTransaction(txId, (error, res) => {
      if (res.blockHash) {
        console.log('mined!', res.blockNumber)
        this.updateBalance(this.state.defaultAccount);
        this.setState({ txStatus: `Mined at ${res.blockNumber}`, disabledBtn: false })
      } else {
        console.log('Not mined yet')
        this.checkTransaction(txId)
      }
    })
  }

  onClickBuy() {
    let amount = Number(this.refs.amount.value);
    if (!isNaN(amount)) {
      this.setState({ disabledBtn: true })
      amount = this.state.web3.toWei(amount, 'ether');
      this.romanCrowdsaleInstance.buyTokens(this.state.defaultAccount, { value: amount, from: this.state.defaultAccount }).then((result) => {
        console.log(result);
        this.setState({ txId: result.tx, txStatus: 'pending' });
        setTimeout(this.checkTransaction.bind(this, result.tx), 5);
      })
    }
  }

  render() {
    const loading = !this.state.web3;
    if (loading) {
      return (
        <Loading />
      )
    }
    const currentAccount = `https://kovan.etherscan.io/address/${this.state.defaultAccount}`
    const tokenAddress = `https://kovan.etherscan.io/address/${this.state.tokenAddress}`
    const crowdsaleAddress = `https://kovan.etherscan.io/address/${this.state.crowdsaleAddress}`
    const disabledBtn = this.state.disabledBtn;
    let txId, txStatus;
    if (this.state.txId) {
      txId = (<tr>
        <td>TransactionID</td>
        <td>{this.state.txId}</td>
      </tr>)
      txStatus = (<tr>
        <td>Transaction Status </td>
        <td>{this.state.txStatus}</td>
      </tr>)
    }
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="https://github.com/rstormsf/ICO_Truffle_Example" className="pure-menu-heading pure-menu-link">Github</a>

        </nav>
        <main className="container pure-g">
          <div className="pure-u-1-5 pure-u-md-1-4"></div>
          <div className="pure-u-3-5 pure-u-md-2-4">
            <p>
              Please point Metamask to Kovan chain
            </p>
            <table className="pure-table pure-table-bordered">
              <tbody>
                <tr>
                  <td>Current Account</td>
                  <td>
                    <a href={currentAccount} target="_blank">{this.state.defaultAccount}</a>
                  </td>
                </tr>

                <tr>
                  <td>Token Address</td>
                  <td><a href={tokenAddress} target="_blank">{this.state.tokenAddress}</a></td>
                </tr>

                <tr>
                  <td>Crowdsale Contract Address</td>
                  <td><a href={crowdsaleAddress} target="_blank">{this.state.crowdsaleAddress}</a></td>
                </tr>

                <tr>
                  <td>Total Supply</td>
                  <td>{this.state.totalSupply} RST</td>
                </tr>
                <tr>
                  <td>Balance</td>
                  <td> {this.state.tokenBalance} RST</td>
                </tr>
                {txId}
                {txStatus}
              </tbody>
            </table>
          </div>
          <div className="pure-u-1-5 pure-u-md-1-4"></div>
          <div className="pure-u-1-5 pure-u-md-1-4"></div>
          <div className="pure-u-4-5">
            <form className="pure-form pure-form-aligned" style={{ padding: '10px 0' }}>
              <div className="pure-g">
                <div className="pure-u-5-5 pure-u-md-1-3">
                  <label htmlFor="foo">Amount in Kether: </label>
                  <input className="pure-input-1-3" ref="amount" type="number" step="0.00001" placeholder="Please enter amount in Kether" />
                </div>
                <div className="pure-u-1 pure-u-md-1-3">
                  <button className="pure-button pure-button-primary pure-input-1-5" disabled={disabledBtn} onClick={this.onClickBuy}>Buy Tokens</button>
                </div>
              </div>
            </form>
          </div>

        </main>
      </div>
    );
  }
}

export default App
