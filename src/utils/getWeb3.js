import Web3 from 'web3'
import sweetAlert from 'sweetalert';
import 'sweetalert/dist/sweetalert.css';
import gif from '../gif_metamask.gif';


let getWeb3 = new Promise(function (resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function () {
    var results
    var web3 = window.web3;
    var netId

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)

      web3.version.getNetwork((err, netId) => {
        if (netId !== "42") {
          sweetAlert({
            title: "Oopss...",
            text: "Please change to Kovan testnet",
            imageUrl: gif,
            allowOutsideClick: true,
            imageSize: '386x538'
          });
        }
        switch (netId) {
          case "1":
            console.log('This is mainnet')
            break
          case "2":
            console.log('This is the deprecated Morden test network.')
            break
          case "3":
            console.log('This is the ropsten test network.')
            break
          case "42":
            console.log('This is kovan')
            break
          default:
            console.log('This is an unknown network.')
        }
        resolve({
          web3,
          netId
        });
      })
      console.log('Injected web3 detected.');

    } else {
      sweetAlert({
        title: "Oopss...",
        text: "Please Install <a href='https://metamask.io/' target='_blank'>Metamask.io</a> chrome extension",
        html: true,
        type: "error"
      });
      // // Fallback to localhost if no web3 injection.
      // var provider = new Web3.providers.HttpProvider('http://localhost:8545')

      // web3 = new Web3(provider)

      // results = {
      //   web3: web3
      // }

      // console.log('No web3 instance injected, using Local web3.');

      // resolve(results)
    }
  })
})

export default getWeb3
