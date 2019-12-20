# bitvote-system
Decentralized system for policy making

# System functioning
1. - Roles: Citizens, Candidates and Admins

-The Admin serves as a 'guardian' of the system. It is the Role with the most access of the system. For the system to operate correctly a clear legislation must be drafted so that it cannot abuse its power or destroy the democracy of the system. Ultimately, the admin answers to the laws dictated by the citizens, so it is in our hands that the admin is kept under constant control. We could refer to it as a vague equivalent to the spanish "Junta Electoral Central". In case of the admin being undemocratic, it could easily be sued and answer to law, in a modern democracy. Notice the admin is not a single person, but an institution.

A branch is created to continue the project with no admin. For more info see branch 'no-central-admin'.

-Citizens are all users of the Ethereum Blockchain granted the access to special functions, which indeed control the bitvote system. The citizen role is acquired by bureaucratic means specified by the spanish administration. And it is effectively given to an account by the admin. The admin can take away the citizenship of someone if that were needed.

-Candidates are all users with the same level of access as citizens, except for the right to stand for elections and the duty to legislate if elected. A citizen can become a candidate by bureaucratic means specified by the spanish administration. Once the process is fulfilled the admin grants the ability to be voted to the candidate. The admin can remove a citizen from the position of candidate if that were needed.

A branch is created in which the CandidateRole still exists. For more info see branch 'candidate-role'.

2. - Decentralized Democracy:

The essence of the proposed system is that power and responsibility are moved from the political elite back to the people of the nation. Under the bitvote-system ordinary people not only will be able to vote directly the laws to be passed, but also will have the means to propose their own laws, and all from the comfort of an internet-connected device such as a computer or laptop.

The procedure will be the following (to be revised): 
After government is elected, the proposals system will pause, allowing anyone to propose a law. Once that happens, the system will unpause and a period of time will be established to vote the law. When it expires, the admin will ratify the law and approve it or not, according to the result. 

Another possibility is to establish a period of time to create laws and when that time ends, vote one by one each of the proposed laws. Creating laws will have a price due to 'gas' and will be determined by the market.

Once the voting time expires, the admin should ratify the required laws in no more than 3 days (to be determined), meaning the opposite a call for general elections. The goverment will probably have powers within the admin should they be strictly stipulated by the constitution to avoid any abuse of power.

A law shall be voted twice to be approved, the first will serve as a draft, while the second will be written by government officials and lawyers, in collaboration with the author of the law, in a proccess that will have as its ultimate goal to make CLEAR to the GENERAL PUBLIC the content of the law, while being rigorous enough.

To avoid any partisan use of the institution, a maximum time for the proposed law's final version will be established.

Different types of laws will require different majority types to be approved. The existing types of laws and the required majority types for each kind shall be established in the constitution in an unambiguous manner. It is also of great importance that conflicting laws are correctly identified. For example, in the voting proccess of a law which contradicts with a previous law, the affected law shall be included in an 'affected laws' section. So that citizens know the consecuences (apparent or not) of the law to be voted. If the new law passes, the old one (or its affected articles) will be overwritten. Types of laws could help to identify contradicting laws.

3. - Multiplier and predictions:

The presented system could degenerate into chaos if the population acted following populist and unscientific agendas. The risk of populist proposals being approved increases dramaticaly in a direct democracy system. Due to this risk, a prediction-rewarding system is to be proposed. This is called the 'multiplier'. The system will work as follows:

Every proposal must include a prediction of the effects the proposals is to produce if approved, and a prediction of the consecuences of being denied. The predictions should be made with a margin of error (to be specified) and should be consistent, related with the issue of the law, and dependant on the law itself. Factors influencing the object to predict should be included in the prediction, as well as an explanation on how the object will behave according to the variation of those factors. Predictions shall be made for yearly data.

As predictions are checked, the value of the vote of the proposer will vary accordingly to the success of the predictions. The calculation of the amount of vote value to add or substract shall be calculated via algorithm. I do not have the answer as to which algorithm to use, but Artificial Intelligence could play a major role on the assigning and verifying process. The Blockchain structure will need of an Oracle to access real world data. Being myself a non-profesional developer nor researcher, I am not able to successfully implement an Oracle in this system, thus that should be made before long.

Predictions are not necessarily the only parameter to take into account to modify the value of vote. The profession of each individual may also be taken into account. Thereby, an economist may have a stronger vote than a surgeon when voting about fiscal policies. Or a farmer will have more to say than an engineer when deciding about agricultural regulation.

Some other criteria might be introduced in the future to modify the value of vote. Note that it should never, under no circumstances, be affected by race, sex, sexual condition, religion, ideology, or any other personal or social circumstances.

The multiplier system shall be put into practice to the demanded extend via a same-vote-value votation.

# Notes

I have temporarily decided to cancel further attemps on reading events from the blockchain. My knowledge is insufficient and given the situation (middle of school year) I consider way more important advancing in elementary steps rather than obsesing with perfectioning the current application. Thus I announce the following:

1 - No further attemps on solving the event-issue should be made until it is considered the last piece of the project puzzle

2 - Meanwhile I will work on several other things such as: perfectioning the createProposal function, creating pop-ups windows, being able to change the web screen fluidly...

3 - Currently, event data can be read only through console like this: 
1) props = await Proposals.deployed()
2) voteLaw = await props.voteLaw(1, 4)
3) event = voteLaw.logs[0].args
4) event._votesFor.toNumber()

4 - Not possible to access data through BOE getter

# Dependencies

The React-Implementation branch eliminated any dependency issue.