import React, { Component } from 'react';
import Identicon from 'identicon.js';
import { Button, ButtonToolbar } from 'react-bootstrap';
import ProposalModal from './ProposalModal';

class Main extends Component {

  constructor(props) {
    super(props)
    this.state = {
      addModalShow: false
    }
  }

  render() {
    let addModalClose = () => this.setState({ addModalShow: false });
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="card mb-4 ml-2 mt-3 text-center">Admin Actions
            <button
              className="btn btn-link btn-sm float-left pt-4"
              onClick={(event) => {
                this.props.pause()
              }}
            >
              PAUSE
            </button>
            <button
              className="btn btn-link btn-sm float-left pt-4"
              onClick={(event) => {
                this.props.unpause()
              }}
            >
              UNPAUSE
            </button>
            <form onSubmit={(event)=> {
              event.preventDefault()
              const content = this.address.value
              this.props.addCitizen(content)
            }}>
              <div className="form-group mr-sm-2">
                <input
                  id="address"
                  type="text"
                  ref={(input) => { this.address = input }}
                  className="form-control"
                  placeholder="Account"
                  required />
              </div>
            <button type="submit" className="btn btn-primary btn-block">ADD CITIZEN</button>
            </form>
            <p>&nbsp;</p>
            <form onSubmit={(event)=> {
              event.preventDefault()
              const arg_1 = this.identifier.value
              const arg_2 = this.majority.value
              this.props.voteLaw(arg_1, arg_2)
            }}>
              <div className="form-group mr-sm-2">
                <input
                  id="identifier"
                  type="number"
                  ref={(input) => { this.identifier = input }}
                  className="form-control"
                  placeholder="Proposal Identifier"
                  required />
              </div>
              <div className="form-group mr-sm-2">
                <input
                  id="majority"
                  type="number"
                  ref={(input) => { this.majority = input }}
                  className="form-control"
                  placeholder="Majority Type"
                  required />
              </div>
            <button type="submit" className="btn btn-primary btn-block">VOTE LAW</button>
            </form>
            <p>&nbsp;</p>
            <form onSubmit={(event)=> {
              event.preventDefault()
              const id = this.id.value
              this.props.getVotes(id)
            }}>
              <div className="form-group mr-sm-2">
                <input
                  id="id"
                  type="number"
                  ref={(input) => { this.id = input }}
                  className="form-control"
                  placeholder="Proposal ID"
                  required />
              </div>
              <button type="submit" className="btn btn-primary btn-block">SEE VOTES</button>
            </form>
            <p>&nbsp;</p>
            <div>
              Proposal ID: 
            </div>
            <div>
              Votes for: 
            </div>
            <div>
              Votes against: 
            </div>
            <div>
              Abstentions: 
            </div>
          </div>
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '550px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <form onSubmit={(event)=> {
                event.preventDefault()
                const arg_1 = this.proposalType.value
                const arg_2 = this.title.value
                const arg_3 = this.body.value
                const arg_4 = this.predictions.value
                this.props.createProposal(arg_1, arg_2, arg_3, arg_4)
              }}>
                <div className="form-group mr-sm-2">
                  <input
                    id="proposalType"
                    type="text"
                    ref={(input) => { this.proposalType = input }}
                    className="form-control"
                    placeholder="Enter Law Type:"
                    required />
                </div>
                <div className="form-group mr-sm-2">
                  <input
                    id="title"
                    type="text"
                    ref={(input) => { this.title = input }}
                    className="form-control"
                    placeholder="Enter Law Title:"
                    required />
                </div>
                <div className="form-group mr-sm-2">
                  <input
                    id="body"
                    type="text"
                    ref={(input) => { this.body = input }}
                    className="form-control"
                    placeholder="Enter Law Body:"
                    required />
                </div>
                <div className="form-group mr-sm-2">
                  <input
                    id="predictions"
                    type="text"
                    ref={(input) => { this.predictions = input }}
                    className="form-control"
                    placeholder="Enter Law Predictions:"
                    required />
                </div>
              <button type="submit" className="btn btn-primary btn-block">Create Law</button>
              </form>
              <p>&nbsp;</p>
              { this.props.BOE.map((proposal, key) => {
                return(
                  <div className="card mb-4" key={key} >
                    <div className="card-header">
                      <img 
                        className='mr-2'
                        width='30'
                        height='30'
                        src={`data:image/png;base64,${new Identicon(proposal.author, 30).toString()}`}
                      />
                      <small className="text-muted">{proposal.author}</small>
                    </div>
                    <ul id="proposalList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p>{proposal.title}</p>
                        <ButtonToolbar>
                          <Button
                            variant="primary"
                            onClick={()=> this.setState({ addModalShow: true })}
                          >SEE PROPOSAL</Button>
                          <ProposalModal
                            show={this.state.addModalShow}
                            onHide={addModalClose}
                          />
                        </ButtonToolbar>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <button 
                          className="btn btn-link btn-sm float-left pt-0"
                          name={proposal.identifier}
                          onClick={(event) => {
                            this.props.voteFor(event.target.name)
                          }}
                        >
                          VOTE FOR
                        </button>
                        <button
                          className="btn btn-link btn-sm float-left pt-0"
                          name={proposal.identifier}
                          onClick={(event) => {
                            this.props.voteAbstention(event.target.name)
                          }}
                        >
                          ABSTENTION
                        </button>
                        <button 
                          className="btn btn-link btn-sm float-right pt-0"
                          name={proposal.identifier}
                          onClick={(event) => {
                            this.props.voteAgainst(event.target.name)
                          }}
                        >
                          VOTE AGAINST
                        </button>
                      </li>
                    </ul>
                  </div>
                )
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;
