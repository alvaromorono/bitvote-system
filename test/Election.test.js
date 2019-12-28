const Election = artifacts.require('./Election.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Election', ([admin, citizen, candidate, noRoleAccount]) => {
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
            await election.addCitizen(citizen, { from: noRoleAccount}).should.be.rejected;
            await election.addCitizen(citizen, { from: admin })
        })
    })

    describe('functioning', async () => {
        let vote, application, withdrawal, result, reset

        it('allows candidates to stand for elections', async () => {
            await election.standForElections(candidate, 'PSOE', { from: admin }).should.be.rejected;            // must pause to work
            await election.pause({ from: admin })
            await election.standForElections(candidate, 'PSOE', { from: noRoleAccount }).should.be.rejected;    // sender is not admin
            await election.standForElections(candidate, '', { from: admin }).should.be.rejected;                // Invalid name
            application = await election.standForElections(candidate, 'PSOE', { from: admin })                  // Success
            await election.standForElections(candidate, 'PSOE', { from: admin }).should.be.rejected;            // Already running
            const event = application.logs[0].args
            assert.equal(event._applicant, candidate, 'candidate can stand for elections')
            assert.equal(event._addedParty, 'PSOE', 'Political party is registered correctly')
            assert.notEqual(event._applicant, citizen, 'candidate can stand for elections')
            assert.notEqual(event._addedParty, 'PP', 'Political party is registered correctly')
        })

        it('allows candidates to withdraw from elecitons', async () => {
            // This is an exception: serves to confirm functioning of resetVoters
            await election.resetVoters({ from: admin }).should.be.rejected;                 // There are no voters
            // No votes are needed in order to confirm functioning
            await election.unpause({ from: admin })
            await election.withdrawFromElections(1, { from: admin }).should.be.rejected;    // Must pause to work
            await election.pause({ from: admin })
            await election.withdrawFromElections(1, { from: citizen }).should.be.rejected;  // Sender is not admin
            withdrawal = await election.withdrawFromElections(1, { from: admin })           // Success
            await election.withdrawFromElections(1, { from: admin }).should.be.rejected;    // Not running currently
            const event = withdrawal.logs[0].args
            assert.equal(event._candidate, candidate, 'candidate removed correctly')
            assert.equal(event._removedParty, 'PSOE', 'withdraws correct political party')
            assert.notEqual(event._candidate, citizen, 'candidate removed correctly')
            assert.notEqual(event._removedParty, 'PP', 'withdraws correct political party')
        })
        
        it('allows to vote', async () => {
            await election.standForElections(candidate, 'PSOE', { from: admin })
            await election.vote(2, { from: citizen}).should.be.rejected;       // Must unpause to work
            await election.unpause({ from: admin })
            await election.vote(2, {from: noRoleAccount}).should.be.rejected;  // Sender is not citizen
            await election.vote(1, { from: citizen}).should.be.rejected;       // Candidate not running
            vote = await election.vote(2, {from: citizen })                    // Success
            await election.vote(2, {from: citizen }).should.be.rejected        // You have already voted
            const event = vote.logs[0].args
            assert.equal(event._candidate, candidate, 'votes for the selected candidate')
            assert.equal(event._voter, citizen, 'the user voted from their account')
            assert.notEqual(event._candidate, citizen, 'votes for the selected candidate')
            assert.notEqual(event._voter, noRoleAccount, 'the user voted from their account')
        })

        it('provides scrutiny', async () => {
            await election.scrutiny(2, { from: citizen }).should.be.rejected;      // Must pause to work
            await election.pause({ from: admin })
            await election.scrutiny(2, {from: noRoleAccount}).should.be.rejected;  // Sender is not citizen
            result = await election.scrutiny(2, {from: admin })                    // Success
            const event = result.logs[0].args
            assert.equal(event._name, 'PSOE', 'scrutiny provides correct candidate')
            assert.equal(event._votes, 1, 'votes are stored correctly')
            assert.notEqual(event._name, 'PP', 'scrutiny provides correct candidate')
            assert.notEqual(event._votes, 11, 'votes are stored correctly')
            await election.scrutiny(1, {from: citizen }).should.be.rejected;       // Candidate not running
        })

        it('resets voters', async () => {
            await election.unpause({ from: admin })
            await election.resetVoters({ from: admin }).should.be.rejected;     // must pause to work
            await election.pause({ from: admin })
            await election.resetVoters({ from: citizen }).should.be.rejected;   // sender must be admin
            reset = await election.resetVoters({ from: admin })                 // success
            await election.resetVoters({ from:admin }).should.be.rejected;      // voters already reset
            const event = reset.logs[0].args
            assert.equal(event._admin, admin, 'admin resets voters')
            assert.notEqual(event._admin, citizen, 'admin resets voters')
        })
    })
})