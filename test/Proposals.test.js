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
        let lawProposal, voteFor, voteAgainst, voteAbstention

        it('allows citizens to create laws', async () => {
            await proposals.pause({ from: admin })
            await proposals.createProposal("Constitución", "Constitución Española", "Artículos", "Nación unida los próximos 150 años", { from: citizen }).should.be.rejected;         // must unpause to work
            await proposals.unpause({ from: admin })
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
            await proposals.pause({ from: admin })
            await proposals.voteFor(1, { from: citizenFor }).should.be.rejected;         // must unpause to work
            await proposals.unpause({ from: admin })
            await proposals.voteFor(1, { from: noRoleAccount }).should.be.rejected;      // sender is not citizen
            await proposals.voteFor(2, { from: citizenFor }).should.be.rejected;         // proposal not in BOE
            // Pendiente: "proposal already voted" en realidad es complicado eh cabrón. en teoria cnd el tiempo para votar expira se pone voted = true. Ese momento debe ser el de la funcion approve dnd se hace el recuendo con el sistema PAUSADO
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
            await proposals.voteAgainst(2, { from: citizenAgainst }).should.be.rejected;         // proposal not in BOE
            // Pendiente: "proposal already voted" en realidad es complicado eh cabrón. en teoria cnd el tiempo para votar expira se pone voted = true. Ese momento debe ser el de la funcion approve dnd se hace el recuendo con el sistema PAUSADO
            voteFor = await proposals.voteAgainst(1, { from: citizenAgainst })                   // success
            await proposals.voteAgainst(1 , { from: citizenAgainst }).should.be.rejected;        // you have already voted
            const event = voteFor.logs[0].args
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
            await proposals.voteAbstention(2, { from: citizenAbstention }).should.be.rejected;         // proposal not in BOE
            // Pendiente: "proposal already voted" en realidad es complicado eh cabrón. en teoria cnd el tiempo para votar expira se pone voted = true. Ese momento debe ser el de la funcion approve dnd se hace el recuendo con el sistema PAUSADO
            voteFor = await proposals.voteAbstention(1, { from: citizenAbstention })                   // success
            await proposals.voteAbstention(1 , { from: citizenAbstention }).should.be.rejected;        // you have already voted
            const event = voteFor.logs[0].args
            assert.equal(event._proposalIdentifier, 1, 'Votes for correct proposal')
            assert.equal(event._voter, citizenAbstention, 'Records the citizen who voted it')
            assert.notEqual(event._proposalIdentifier, 2, 'Votes for correct proposal')
            assert.notEqual(event._voter, noRoleAccount, 'Records the citizen who voted it')
        })
    })
})