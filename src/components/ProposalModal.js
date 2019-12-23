import React, { Component } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';

class ProposalModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Proposal Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div>
              Proposal ID: 
            </div>
            <div>
              Proposal Type: 
            </div>
            <div>
              Title: 
            </div>
            <div>
              Body: 
            </div>
            <div>
              Predictions: 
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
            <div>
              Voted: 
            </div>
            <div>
              Approved: 
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ProposalModal;