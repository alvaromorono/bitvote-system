const Proposals = artifacts.require('./Proposals.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Proposals', ([admin, citizen, citizenFor, citizenAgainst, citizenAbstention, noRoleAccount]) => {
    let proposals

    before(async () => {
        proposals = await Proposals.deployed({ from: admin })
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await proposals.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('sets deployer as admin', async () => {
            await proposals.addCitizen(citizen, { from: noRoleAccount}).should.be.rejected;
            await proposals.addCitizen(citizen, { from: admin })
            await proposals.addCitizen(citizenFor, { from: admin })
            await proposals.addCitizen(citizenAgainst, { from: admin })
            await proposals.addCitizen(citizenAbstention, { from: admin })
        })
    })

    describe('functioning', async () => {
        let lawProposal, voteFor, voteAgainst, voteAbstention, voteLaw

        it('allows citizens to create laws', async () => {
            await proposals.createProposal("Constitución", "Constitución Española", "Artículos", "Nación unida los próximos 150 años", { from: citizen }).should.be.rejected;         // must pause to work
            await proposals.pause({ from: admin })
            await proposals.createProposal("Constitución", "Constitución Española", "Artículos", "Nación unida los próximos 150 años", { from: noRoleAccount }).should.be.rejected;   // sender is not citizen
            await proposals.createProposal("", "Constitución Española", "Artículos", "Nación unida los próximos 150 años", { from: citizen }).should.be.rejected;                     // missing input
            await proposals.createProposal("Constitución", "", "Artículos", "Nación unida los próximos 150 años", { from: citizen }).should.be.rejected;                              // missing input
            await proposals.createProposal("Constitución", "Constitución Española", "", "Nación unida los próximos 150 años", { from: citizen }).should.be.rejected;                  // missing input
            await proposals.createProposal("Constitución", "Constitución Española", "Artículos", "", { from: citizen }).should.be.rejected;                                           // missing input
            lawProposal = await proposals.createProposal("Constitución", "Constitución Española", "Artículos", "Nación unida los próximos 150 años", { from: citizen })               // success
            const event = lawProposal.logs[0].args
            assert.equal(event._proposalIdentifier, 1, 'Proposal is registered correctly')
            assert.equal(event._proposalType, "Constitución", 'Proposal type is registered correctly')
            assert.equal(event._title, "Constitución Española", 'Proposal title is registered correctly')
            assert.equal(event._body, "Artículos", 'Proposal body is registered correctly')
            assert.equal(event._predictions, "Nación unida los próximos 150 años", 'Proposal predictions are registered correctly')
            assert.equal(event._author, citizen, 'Author is registered correctly')
            assert.notEqual(event._proposalIdentifier, 2, 'Proposal is registered correctly')
            assert.notEqual(event._proposalType, "Tipo incorrecto", 'Proposal type is registered correctly')
            assert.notEqual(event._title, "Título incorrecto", 'Proposal  title is registered correctly')
            assert.notEqual(event._body, "Cuerpo incorrecto", 'Proposal body is registered correctly')
            assert.notEqual(event._predictions, "Predicción incorrecta", 'Proposal predictions are registered correctly')
            assert.notEqual(event._author, admin, 'Author is registered correctly')  
        })

        it('allows citizens to vote for a law', async () => {
            await proposals.voteFor(1, { from: citizenFor }).should.be.rejected;         // must unpause to work
            await proposals.unpause({ from: admin })
            await proposals.voteFor(1, { from: noRoleAccount }).should.be.rejected;      // sender is not citizen
            await proposals.voteFor(0, { from: citizenFor }).should.be.rejected;         // proposal 0 does not exist
            await proposals.voteFor(2, { from: citizenFor }).should.be.rejected;         // proposal not in BOE
            voteFor = await proposals.voteFor(1, { from: citizenFor })                   // success
            await proposals.voteFor(1 , { from: citizenFor }).should.be.rejected;        // you have already voted
            const event = voteFor.logs[0].args
            assert.equal(event._proposalIdentifier, 1, 'Votes for correct proposal')
            assert.equal(event._voter, citizenFor, 'Records the citizen who voted it')
            assert.notEqual(event._proposalIdentifier, 2, 'Votes for correct proposal')
            assert.notEqual(event._voter, noRoleAccount, 'Records the citizen who voted it')
        })

        it('allows citizens to vote against a law', async () => {
            await proposals.pause({ from: admin })
            await proposals.voteAgainst(1, { from: citizenAgainst }).should.be.rejected;         // must unpause to work
            await proposals.unpause({ from: admin })
            await proposals.voteAgainst(1, { from: noRoleAccount }).should.be.rejected;          // sender is not citizen
            await proposals.voteAgainst(0, { from: citizenAgainst }).should.be.rejected;         // proposal 0 does not exist
            await proposals.voteAgainst(2, { from: citizenAgainst }).should.be.rejected;         // proposal not in BOE
            voteAgainst = await proposals.voteAgainst(1, { from: citizenAgainst })               // success
            await proposals.voteAgainst(1 , { from: citizenAgainst }).should.be.rejected;        // you have already voted
            const event = voteAgainst.logs[0].args
            assert.equal(event._proposalIdentifier, 1, 'Votes for correct proposal')
            assert.equal(event._voter, citizenAgainst, 'Records the citizen who voted it')
            assert.notEqual(event._proposalIdentifier, 2, 'Votes for correct proposal')
            assert.notEqual(event._voter, noRoleAccount, 'Records the citizen who voted it')
        })

        it('allows citizens to vote abstention', async () => {
            await proposals.pause({ from: admin })
            await proposals.voteAbstention(1, { from: citizenAbstention }).should.be.rejected;         // must unpause to work
            await proposals.unpause({ from: admin })
            await proposals.voteAbstention(1, { from: noRoleAccount }).should.be.rejected;             // sender is not citizen
            await proposals.voteAbstention(0, { from: citizenAbstention }).should.be.rejected;         // proposal 0 does not exist
            await proposals.voteAbstention(2, { from: citizenAbstention }).should.be.rejected;         // proposal not in BOE
            voteAbstention = await proposals.voteAbstention(1, { from: citizenAbstention })            // success
            await proposals.voteAbstention(1 , { from: citizenAbstention }).should.be.rejected;        // you have already voted
            const event = voteAbstention.logs[0].args
            assert.equal(event._proposalIdentifier, 1, 'Votes for correct proposal')
            assert.equal(event._voter, citizenAbstention, 'Records the citizen who voted it')
            assert.notEqual(event._proposalIdentifier, 2, 'Votes for correct proposal')
            assert.notEqual(event._voter, noRoleAccount, 'Records the citizen who voted it')
        })

        it('allows a law to be voted', async () => {
            await proposals.voteLaw(1, 1, { from: admin }).should.be.rejected;               // must pause to work
            await proposals.pause({ from: admin })
            await proposals.voteLaw(1, 1, { from: citizen }).should.be.rejected;             // sender must be admin
            await proposals.voteLaw(0, 1, { from: admin }).should.be.rejected;               // proposal 0 does not exist
            await proposals.voteLaw(23, 1, { from: admin }).should.be.rejected;              // proposal not in BOE
            await proposals.voteLaw(1, 0, { from: admin }).should.be.rejected;               // invalid majority type
            await proposals.voteLaw(1, 5, { from: admin }).should.be.rejected;               // invalid majority type
            voteLaw = await proposals.voteLaw(1, 1, { from: admin })                         // success
            await proposals.voteLaw(1, 2, { from: admin }).should.be.rejected;               // proposal already voted
            const event = voteLaw.logs[0].args
            assert.equal(event._proposalIdentifier, 1, 'Votes the correct proposal')
            assert.equal(event._votesFor, 1, 'Stores voted correctly')
            assert.equal(event._votesAgainst, 1, 'Stores voted correctly')
            assert.equal(event._abstentions, 1, 'Stores voted correctly')
            assert.equal(event._approved, false, 'Approves or rejects the proposal accordingly')
            assert.equal(event._majorityType, 1, 'Stores the correct majority type')

            // Special section: validating functioning of voting functions ("Proposal already voted" error)
            await proposals.unpause({ from: admin })
            await proposals.voteFor(1, { from: citizen }).should.be.rejected;
            await proposals.voteAgainst(1, { from: citizen }).should.be.rejected;
            await proposals.voteAbstention(1, { from: citizen }).should.be.rejected;
            await proposals.pause({ from: admin })
            // End of special section

            // Absolute majority
            await proposals.createProposal("Ley Ordinaria", "SMI", "Artículos", "Reducción del desempleo un 5%", { from: citizen })
            await proposals.unpause({ from: admin })
            await proposals.voteFor(2, { from: citizenFor })
            await proposals.voteFor(2, { from: citizenAbstention })
            await proposals.voteAgainst(2, { from: citizenAgainst })
            await proposals.pause({ from: admin })
            voteLaw = await proposals.voteLaw(2, 2, { from: admin })
            const Event = voteLaw.logs[0].args
            assert.equal(Event._proposalIdentifier, 2, 'Votes the correct proposal')
            assert.equal(Event._votesFor, 2, 'Stores voted correctly')
            assert.equal(Event._votesAgainst, 1, 'Stores voted correctly')
            assert.equal(Event._abstentions, 0, 'Stores voted correctly')
            assert.equal(Event._approved, true, 'Approves or rejects the proposal accordingly')
            assert.equal(Event._majorityType, 2, 'Stores the correct majority type')

            // 3/5 majority
            await proposals.createProposal("Ley Ordinaria", "Impuesto Sociedades", "Artículos", "Aumento de la inversión extranjera un 5%", { from: citizen })
            await proposals.unpause({ from: admin })
            await proposals.voteFor(3, { from: citizenFor })
            await proposals.voteFor(3, { from: citizenAbstention })
            await proposals.voteAgainst(3, { from: citizenAgainst })
            await proposals.pause({ from: admin })
            voteLaw = await proposals.voteLaw(3, 3, { from: admin })
            const EVENT = voteLaw.logs[0].args
            assert.equal(EVENT._proposalIdentifier, 3, 'Votes the correct proposal')
            assert.equal(EVENT._votesFor, 2, 'Stores voted correctly')
            assert.equal(EVENT._votesAgainst, 1, 'Stores voted correctly')
            assert.equal(EVENT._abstentions, 0, 'Stores voted correctly')
            assert.equal(EVENT._approved, true, 'Approves or rejects the proposal accordingly')
            assert.equal(EVENT._majorityType, 3, 'Stores the correct majority type')

            // 2/3 majority
            await proposals.createProposal("Ley Ordinaria", "IRPF", "Artículos", "Aumento de la recaudación extranjera un 5%", { from: citizen })
            await proposals.unpause({ from: admin })
            await proposals.voteFor(4, { from: citizenFor })
            await proposals.voteFor(4, { from: citizenAbstention })
            await proposals.voteAgainst(4, { from: citizenAgainst })
            await proposals.pause({ from: admin })
            voteLaw = await proposals.voteLaw(4, 4, { from: admin })
            const event_ = voteLaw.logs[0].args
            assert.equal(event_._proposalIdentifier, 4, 'Votes the correct proposal')
            assert.equal(event_._votesFor, 2, 'Stores voted correctly')
            assert.equal(event_._votesAgainst, 1, 'Stores voted correctly')
            assert.equal(event_._abstentions, 0, 'Stores voted correctly')
            assert.equal(event_._approved, true, 'Approves or rejects the proposal accordingly')
            assert.equal(event_._majorityType, 4, 'Stores the correct majority type')
        })
    })
})