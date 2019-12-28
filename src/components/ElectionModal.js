import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

class ElectionModal extends Component {
  
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
            Candidate Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div>
              Name: 
            </div>
            <div>
              Bio: 
            </div>
            <div>
              Votes: 
            </div>
            <div>
              Elected: 
            </div>
            <div>
              Account: 
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

export default ElectionModal;