import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Proposals from '../abis/Proposals.json';
import Navbar from './Navbar';
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = Proposals.networks[networkId]
    if (networkData) {
      const proposals = web3.eth.Contract(Proposals.abi, networkData.address)
      this.setState({ proposals })
      const counter = await proposals.methods.counter().call()
      this.setState({ counter })
      // Load Proposals
      for (var i = 1; i <= counter; i++) {
        const proposal = await proposals.methods.BOE(i).call()
        this.setState({
          BOE: [...this.state.BOE, proposal]
        })
      }
      this.setState({ loading: false })
    } else {
      window.alert('Proposals contract not deployed to detected network.')
    }
  }

  pause() {
    this.setState({ loading: true })
    this.state.proposals.methods.pause().send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }
  
  unpause() {
    this.setState({ loading: true })
    this.state.proposals.methods.unpause().send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  addCitizen(content) {
    this.setState({ loading: true })
    this.state.proposals.methods.addCitizen(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  voteLaw(id, majorityType) {
    this.setState({ loading: true })
    this.state.proposals.methods.voteLaw(id, majorityType).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  createProposal(content) {
    this.setState({ loading: true })
    this.state.proposals.methods.createProposal(content, content, content, content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  voteFor(id) {
    this.setState({ loading: true })
    this.state.proposals.methods.voteFor(id).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  voteAgainst(id) {
    this.setState({ loading: true })
    this.state.proposals.methods.voteAgainst(id).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  voteAbstention(id) {
    this.setState({ loading: true })
    this.state.proposals.methods.voteAbstention(id).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  getVotes(id) {
    /*var proposalVotedEvent = this.state.proposals.events.proposalVotedEvent();
    proposalVotedEvent.watch(function(err, result) {
    if (err) {
      console.log(err)
      return;
    }
    console.log(result.args._votesFor)
    // check that result.args._from is web3.eth.coinbase then
    // display result.args._value in the UI and call    
    // exampleEvent.stopWatching()
  })

  let events = await contract.getPastEvents(  
    "proposalVotedEvent",  
    {  
      filter: {from:'0x2Fb623a152506960EC3Dfa02a9C1ABe6C0C8cA59'},  
      fromBlock: 0,  
      toBlock: 'latest'  
    }  
  );*/

  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      proposals: null,
      counter: 0,
      BOE: [],
      loading: true
    }

    this.pause = this.pause.bind(this)
    this.unpause = this.unpause.bind(this)
    this.addCitizen = this.addCitizen.bind(this)
    this.voteLaw = this.voteLaw.bind(this)
    this.createProposal = this.createProposal.bind(this)
    this.voteFor = this.voteFor.bind(this)
    this.voteAgainst = this.voteAgainst.bind(this)
    this.voteAbstention = this.voteAbstention.bind(this)
    this.getVotes = this.getVotes.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              BOE={this.state.BOE}
              pause={this.pause}
              unpause={this.unpause}
              addCitizen={this.addCitizen}
              voteLaw={this.voteLaw}
              createProposal={this.createProposal}
              voteFor={this.voteFor}
              voteAgainst={this.voteAgainst}
              voteAbstention={this.voteAbstention}
              getVotes={this.getVotes}
            />
        }
      </div>
    );
  }
}

export default App;