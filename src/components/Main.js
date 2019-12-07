import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {

  render() {
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
          </div>
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '550px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <form onSubmit={(event)=> {
                event.preventDefault()
                const content = this.proposalContent.value
                this.props.createProposal(content)
              }}>
                <div className="form-group mr-sm-2">
                  <input
                    id="proposalContent"
                    type="text"
                    ref={(input) => { this.proposalContent = input }}
                    className="form-control"
                    placeholder="Enter Law description:"
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
                      <button
                        className="btn btn-link btn-sm float-right pt-0"
                        //name={}
                        //onClick=
                      >
                        SEE PROPOSAL
                      </button>
                    </div>
                    <ul id="proposalList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p>{proposal.title}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <button 
                          className="btn btn-link btn-sm float-left pt-0"
                          name={proposal.id}
                          onClick={(event) => {
                            this.props.voteFor(event.target.name)
                          }}
                        >
                          VOTE FOR
                        </button>
                        <button
                          className="btn btn-link btn-sm float-left pt-0"
                          name={proposal.id}
                          onClick={(event) => {
                            this.props.voteAbstention(event.target.name)
                          }}
                        >
                          ABSTENTION
                        </button>
                        <button 
                          className="btn btn-link btn-sm float-right pt-0"
                          name={proposal.id}
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
