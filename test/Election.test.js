const Election = artifacts.require('./Election.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Election', ([admin, candidate, citizen]) => {
    let election

    before(async () => {
        election = await Election.deployed({ from: admin })
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await election.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
        /*
        it('sets deployer as admin', async () => {
            const name = await marketplace.name()
            assert.equal(name, 'Dapp University Marketplace')
        })*/
    })

    describe('functioning', async () => {
        let vote, application

        before(async () => {
            
        })

        it('allows candidates to stand for elections', async () => {
            await election.standForElections('PSOE', { from: candidate }).should.be.rejected; // sender is not candidate
            await election.addCandidate(candidate, { from: admin })
            await election.standForElections('PSOE', { from: candidate }).should.be.rejected; // must pause to work
            await election.pause({ from: admin })
            application = await election.standForElections('PSOE', { from: candidate }) // Success
            const event = application.logs[0].args
            assert.equal(event._applicant, candidate, 'candidate can stand for elections')
        })

        it('allows candidates to withdraw from elecitons', async () => {
            //await election.addCandidate(candidate, { from: admin })
            await election.withdrawFromElections({ from: candidate }) // must pause to work
            //await election.pause({ from: admin })
        })
        /** 
        it('allows to vote', async () => {

            // Failure - sender is not a citizen
            await election.vote(candidate, { from: citizen}).should.be.rejected;
            await election.addCitizen(citizen, {from: admin})
            /*await election.addCandidate(citizen, {from: admin})
            // Failure - candidate is not running for the election
            await election.vote(candidate, { from: citizen}).should.be.rejected;
            // Failure - sender is not a candidate
            await election.vote(candidate, { from: citizen}).should.be.rejected;
            // Failure - addCandidate only works when paused
            await election.addCandidate(candidate, { from: admin })
            await election.pause({ from: admin })
            //
            
            await election.unpause({ from: admin })
            vote = await election.vote(candidate, {from: citizen })
            // Success cases
            const event = vote.logs[0].args
            assert.equal(event._candidate, candidate, 'votes for the selected candidate')
            assert.equal(event._voter, citizen, 'the user voted from their account')
            
        })*/
    })
})