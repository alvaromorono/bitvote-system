App = {
  web3Provider: null,
  contracts: {},
  admin: '0x757b7893c51861ebe4e0a948b4ee11a2263f501a',  // Setup manually
  loading: false,
  multiplier: false,
  eventCounter: 0,

  init: async function() {
    console.log("App initialized...")
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      App.contracts.Election = TruffleContract(election);
      App.contracts.Election.setProvider(App.web3Provider);
      App.contracts.Election.deployed({ from: App.admin }).then(function(election) {
        console.log("Election Contract Address:", election.address);
      });
      App.listenForEvents();
      return App.render();
    });
  },
  listenForEvents: function() {
    App.contracts.Election.deployed({ from: App.admin }).then(function(instance){
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("Event triggered", event);
        App.eventCounter ++;
        App.render();
      });
    });
  },
  render: async function() {
    if (App.loading) { // Aqui esta la clave para que el administrador pueda ver cosas que el ciudadano no. Ver INSTRUCCIONES.txt
      return;
    }
    App.loading = true;

    var loader = $('#loader');
    var voting = $('#voting');

    loader.show();
    voting.hide();

    // Accessing the account the user is connected to
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        console.log("Account: ", account);
        App.account = account;
        // Wiring it up with html. You need extra code (at the bottom) to surpass MetaMask's privacy mode
        $('#accountAddress').html("Your Account: " + account);
      }
    })

    // This is asynchronous JavaScript, also used in tests. (JavaScript promises)
    // Load election contract
    election = await App.contracts.Election.deployed({ from: App.admin })
    console.log(await election.address)


    // Asynchronous JavaScript ends here
    App.loading = false;
    loader.hide();
    voting.show();
  },

  addCandidate: async function() {
    
  },

  castVotes: async function() {
    $('#voting').hide();
    $('#loader').show();

    election = await App.contracts.Election.deployed({ from: App.admin })
    await election.vote()
  }
};



// Whenever the window loads, we want to initialize our app
$(function() {
  $(window).load(function() {
    App.init();
  });
});
// Allow Metamask to ask for permission to connect to the user's account
window.addEventListener('load', async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
          // Request account access if needed
          await ethereum.enable();
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */});
      } catch (error) {
          // User denied account access...
      }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */});
  }
  // Non-dapp browsers...
  else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
});