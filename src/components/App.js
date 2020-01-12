import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Proposals from '../abis/Proposals.json';
import Election from '../abis/Election.json';
import Navbar from './Navbar';
import Main from './Main';
import Elections from './Elections';
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';

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
    // Network ID
    const electionNetworkData = Election.networks[networkId]
    if (electionNetworkData) {
      const election = web3.eth.Contract(Election.abi, electionNetworkData.address)
      this.setState({ election })
      const electionCounter = await election.methods.counter().call()
      this.setState({ electionCounter })
      // Load Candidates
      for (var ii = 1; ii <= electionCounter; ii++) {
        const candidate = await election.methods.candidates(ii).call()
        this.setState({
          candidates: [...this.state.candidates, candidate]
        })
      }
      this.setState({ loading: false })
    } else {
      window.alert('Election contract not deployed to detected network')
    }
  }

  // Proposals functions

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

  createProposal(proposalType, title, body, predictions) {
    this.setState({ loading: true })
    this.state.proposals.methods.createProposal(proposalType, title, body, predictions).send({ from: this.state.account })
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

  // Election functions

  Pause() {
    this.setState({ loading: true })
    this.state.election.methods.pause().send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }
  
  Unpause() {
    this.setState({ loading: true })
    this.state.election.methods.unpause().send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  AddCitizen(content) {
    this.setState({ loading: true })
    this.state.election.methods.addCitizen(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

 standForElections(candidate, name) {
   this.setState({ loading: true })
   this.state.election.methods.standForElections(candidate, name).send({ from: this.state.account })
   .once('recipt', (receipt) => {
     this.setState({ loading: false })
   })
 }

 withdrawFromElections(id) {
  this.setState({ loading: true })
  this.state.election.methods.withdrawFromElections(id).send({ from: this.state.account })
  .once('recipt', (receipt) => {
    this.setState({ loading: false })
  })
 }

 vote(id) {
   this.setState({ loading: true })
   this.state.election.methods.vote(id).send({ from: this.state.account })
   .once('receipt', (receipt) => {
     this.setState({ loading: true })
   })
 }

 resetVoters() {
   this.setState({ loading: true })
   this.state.election.methods.resetVoters().send({ from: this.state.account })
   .once('receipt', (receipt) => {
    this.setState({ loading: true })
  })
 }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      proposals: null,
      election: null,
      counter: 0,
      electionCounter: 0,
      BOE: [],
      candidates: [],
      loading: true
    }

    // Proposals functions

    this.pause = this.pause.bind(this)
    this.unpause = this.unpause.bind(this)
    this.addCitizen = this.addCitizen.bind(this)
    this.voteLaw = this.voteLaw.bind(this)
    this.createProposal = this.createProposal.bind(this)
    this.voteFor = this.voteFor.bind(this)
    this.voteAgainst = this.voteAgainst.bind(this)
    this.voteAbstention = this.voteAbstention.bind(this)

    // Election functions

    this.Pause = this.Pause.bind(this)
    this.Unpause = this.Unpause.bind(this)
    this.AddCitizen = this.AddCitizen.bind(this)
    this.standForElections = this.standForElections.bind(this)
    this.withdrawFromElections = this.withdrawFromElections.bind(this)
    this.vote = this.vote.bind(this)
    this.resetVoters = this.resetVoters.bind(this)
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar account={this.state.account} />
          <Route path="/proposals" exact render={
            () => {
              return(
                <div>
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
                      />
                  }
                </div>
              );
            }
          }/>
          <Route path="/election" exact render={
            () => {
              return(
                <div>
                  { this.state.loading
                    ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
                    : <Elections
                        candidates={this.state.candidates}
                        Pause={this.Pause}
                        Unpause={this.Unpause}
                        AddCitizen={this.AddCitizen}
                        standForElections={this.standForElections}
                        withdrawFromElections={this.withdrawFromElections}
                        vote={this.vote}
                        resetVoters={this.resetVoters}
                      />
                  }
                </div>
              );
            }
          }/>
        </div>
      </Router>
    );
  }
}

export default App;