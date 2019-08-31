const Election = artifacts.require('./Election.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Election', ([admin, candidate, citizen, noRoleAccount]) => {
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

        it('sets deployer as admin', async () => {
            await election.addCitizen(citizen, { from: candidate}).should.be.rejected;
            await election.addCandidate(candidate, { from: citizen}).should.be.rejected;
            await election.addCitizen(citizen, { from: admin })
            await election.addCitizen(candidate, { from: admin })
            await election.addCandidate(candidate, { from: admin})
        })
    })

    describe('functioning', async () => {
        let vote, application, withdrawal, result

        it('allows candidates to stand for elections', async () => {
            await election.standForElections('PSOE', { from: candidate }).should.be.rejected;   // Must pause to work
            await election.pause({ from: admin })
            await election.standForElections('PSOE', { from: citizen }).should.be.rejected;     // Sender is not candidate
            await election.standForElections('', { from: candidate }).should.be.rejected;       // Invalid name
            application = await election.standForElections('PSOE', { from: candidate })         // Success
            await election.standForElections('PSOE', { from: candidate }).should.be.rejected;   // Already running
            const event = application.logs[0].args
            assert.equal(event._applicant, candidate, 'candidate can stand for elections')
            assert.equal(event._addedParty, 'PSOE', 'adds the correct political party')
            assert.notEqual(event._applicant, citizen, 'candidate can stand for elections')
            assert.notEqual(event._addedParty, 'PP', 'Political party is registered correctly')
        })

        it('allows candidates to withdraw from elecitons', async () => {
            await election.unpause({ from: admin })
            await election.withdrawFromElections({ from: candidate }).should.be.rejected;   // Must pause to work
            await election.pause({ from: admin })
            await election.withdrawFromElections({ from: citizen }).should.be.rejected;     // Sender is not candidate
            withdrawal = await election.withdrawFromElections({ from: candidate })          // Success
            await election.withdrawFromElections({ from: candidate }).should.be.rejected    // Not running currently
            const event = withdrawal.logs[0].args
            assert.equal(event._candidate, candidate, 'candidate removed itself from election')
            assert.equal(event._removedParty, 'PSOE', 'withdraws correct political party')
            assert.notEqual(event._candidate, citizen, 'candidate removed correctly')
            assert.notEqual(event._removedParty, 'PP', 'withdraws correct political party')
        })
         
        it('allows to vote', async () => {
            await election.vote(candidate, { from: citizen}).should.be.rejected;       // Must unpause to work
            await election.unpause({ from: admin })
            await election.vote(candidate, {from: noRoleAccount}).should.be.rejected;  // Sender is not citizen
            await election.vote(noRoleAccount, { from: citizen}).should.be.rejected;   // Candidate not running
            await election.pause({ from: admin })
            await election.standForElections('PSOE', { from: candidate })
            await election.unpause({ from: admin })
            vote = await election.vote(candidate, {from: citizen })                    // Success
            await election.vote(candidate, {from: citizen }).should.be.rejected        // You have already voted
            const event = vote.logs[0].args
            assert.equal(event._candidate, candidate, 'votes for the selected candidate')
            assert.equal(event._voter, citizen, 'the user voted from their account')
            assert.notEqual(event._candidate, citizen, 'votes for the selected candidate')
            assert.notEqual(event._voter, noRoleAccount, 'the user voted from their account')
        })

        it('provides scrutiny', async () => {
            await election.scrutiny(candidate, { from: citizen }).should.be.rejected;      // Must pause to work
            await election.pause({ from: admin })
            await election.scrutiny(candidate, {from: noRoleAccount}).should.be.rejected;  // Sender is not citizen
            await election.scrutiny(candidate, {from: citizen })                           // Success
            result = await election.candidates(candidate)
            assert.equal(result.voteCount.toNumber(), 1, 'votes are stored correctly')
            assert.notEqual(result.voteCount.toNumber(), 11, 'votes are stored correctly')
            await election.withdrawFromElections({ from: candidate })
            await election.scrutiny(candidate, {from: citizen }).should.be.rejected;       // Candidate not running
        })
    })
})