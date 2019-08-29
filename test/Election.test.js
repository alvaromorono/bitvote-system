const Election = artifacts.require('./Election.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Election', ([admin, candidate, citizen]) => {
    let election

    before(async () => {
        election = await Election.deployed()
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
})