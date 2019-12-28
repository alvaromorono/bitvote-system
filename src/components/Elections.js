import React, { Component } from 'react';
import Identicon from 'identicon.js';
import { Button, ButtonToolbar } from 'react-bootstrap';
import ElectionModal from './ElectionModal';

class Elections extends Component {

  constructor(props) {
    super(props)
    this.state = {
      addModalShow: false
    }
  }

  render() {
    let addModalClose = () => this.setState({ addModalShow: false });
    return(
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="card mb-4 ml-2 mt-3 text-center">Admin Actions
            <button
              className="btn btn-link btn-sm float-left pt-4"
              onClick={(event) => {
                this.props.Pause()
              }}
            >
              PAUSE
            </button>
            <button
              className="btn btn-link btn-sm float-left pt-4"
              onClick={(event) => {
                this.props.Unpause()
              }}
            >
              UNPAUSE
            </button>
            <p>&nbsp;</p>
            <form onSubmit={(event)=> {
              event.preventDefault()
              const content = this.citizen.value
              this.props.AddCitizen(content)
            }}>
              <div className="form-group mr-sm-2">
                <input
                  id="citizen"
                  type="text"
                  ref={(input) => { this.citizen = input }}
                  className="form-control"
                  placeholder="Account"
                  required />
              </div>
            <button type="submit" className="btn btn-primary btn-block">ADD CITIZEN</button>
            </form>
            <p>&nbsp;</p>
            <form onSubmit={(event)=> {
              event.preventDefault()
              const arg_1 = this.candidate.value
              const arg_2 = this.name.value
              this.props.standForElections(arg_1, arg_2)
            }}>
              <div className="form-group mr-sm-2">
                <input
                  id="candidate"
                  type="text"
                  ref={(input) => { this.candidate = input }}
                  className="form-control"
                  placeholder="Account"
                  required />
              </div>
              <div className="form-group mr-sm-2">
                <input
                  id="name"
                  type="text"
                  ref={(input) => { this.name = input }}
                  className="form-control"
                  placeholder="Name"
                  required />
              </div>
            <button type="submit" className="btn btn-primary btn-block">ADD CANDIDATE</button>
            </form>
            <p>&nbsp;</p>
            <form onSubmit={(event)=> {
              event.preventDefault()
              const content = this.id.value
              this.props.withdrawFromElections(content)
            }}>
              <div className="form-group mr-sm-2">
                <input
                  id="id"
                  type="number"
                  ref={(input) => { this.id = input }}
                  className="form-control"
                  placeholder="Candidate ID"
                  required />
              </div>
            <button type="submit" className="btn btn-primary btn-block">REMOVE CANDIDATE</button>
            </form>
            <button
              className="btn btn-link btn-sm float-left pt-4"
              onClick={(event) => {
                this.props.resetVoters()
              }}
            >
              RESET VOTERS
            </button>
          </div>
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '550px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              { this.props.candidates.map((candidate, key) => {
                if(candidate.eligible) {
                  return(
                    <div className="card mb-4" key={key} >
                      <div className="card-header">
                        <img 
                          className='mr-2'
                          width='30'
                          height='30'
                          src={`data:image/png;base64,${new Identicon(candidate.account, 30).toString()}`}
                        />
                        <small className="text-muted">{candidate.name}</small>
                      </div>
                      <ul id="candidateList" className="list-group list-group-flush">
                        <li className="list-group-item">
                          <h1>Candidate Details</h1>
                          <div>
                            ID: {candidate.id.toString()}
                          </div>
                          <div>
                            Name: {candidate.name}
                          </div>
                          <div>
                            Account: {candidate.account}
                          </div>
                          <div>
                            Votes: {candidate.voteCount.toString()}
                          </div>
                          <div>
                            Eligible: {candidate.eligible.toString()}
                          </div>
                          <p>&nbsp;</p>
                          <ButtonToolbar>
                            <Button
                              variant="primary"
                              onClick={()=> this.setState({ addModalShow: true })}
                            >SEE CANDIDATE</Button>
                            <ElectionModal
                              show={this.state.addModalShow}
                              onHide={addModalClose}
                            />
                          </ButtonToolbar>
                        </li>
                        <li key={key} className="list-group-item py-2">
                          <button
                            className="btn btn-link btn-sm float-right pt-0"
                            name={candidate.id}
                            onClick={(event) => {
                              this.props.vote(event.target.name)
                            }}
                          >
                            VOTE CANDIDATE
                          </button>
                        </li>
                      </ul>
                    </div>
                  );
                }
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Elections;
