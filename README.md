# bitvote-system
Decentralized system for policy making

# System functioning
1 - Roles: Citizens, Candidates and Admins

-The Admin serves as a 'guardian' of the system. It is the Role with the most access of the system. For the system to operate correctly a clear legislation must be drafted so that it cannot abuse its power or destroy the democracy of the system. Ultimately, the admin answers to the laws dictated by the citizens, so it is in our hands that the admin is kept under constant control. We could refer to it as a vague equivalent to the spanish "Junta Electoral Central". In case of the admin being undemocratic, it could easily be sued and answer to law, in a modern democracy. Note that the admin is not a single person, but an institution.

A branch is created to continue the project with no admin. For more info see branch 'no-central-admin'.

-Citizens are all users of the Ethereum Blockchain granted the access to special functions, which indeed control the bitvote system. The citizen role is acquired by bureaucratic means specified by the spanish administration. And it is effectively given to an account by the admin. The admin can take away the citizenship of someone if that were needed.

-Candidates are all users with the same level of access as citizens, except for the right to stand for elections and the duty of legislate if elected. A citizen can become a candidate by bureaucratic means specified by the spanish administration. Once the process is fulfilled the admin grants the ability to be voted to the candidate. The admin can remove a citizen from the position of candidate if that were needed.

A branch is created in which the CandidateRole still exists. For more info see branch 'candidate-role'.

# Dependencies
The following section describes the state of project dependencies:

1 - 2 low severity vulnerabilities existing:
These vulnerabilities are the web3 "Insecure Credential Storage" which currently does not support any fix.

                                                                                                                
                                                    === npm audit security report ===                        
                                                                                                                
                                                                                                                
                                                                Manual Review                                  
                                            Some vulnerabilities require your attention to resolve             
                                                                                                                
                                        Visit https://go.npm.me/audit-guide for additional guidance           
                                                                                                                
                                                                                                                
                                Low             Insecure Credential Storage                                   
                                                                                                                
                                Package         web3                                                          
                                                                                                                
                                Patched in      No patch available                                            
                                                                                                                
                                Dependency of   truffle-contract [dev]                                        
                                                                                                                
                                Path            truffle-contract > web3                                       
                                                                                                                
                                More info       https://npmjs.com/advisories/877                              
                                                                                                                
                                                                                                                
                                Low             Insecure Credential Storage                                   
                                                                                                                
                                Package         web3                                                          
                                                                                                                
                                Patched in      No patch available                                            
                                                                                                                
                                Dependency of   truffle-hdwallet-provider [dev]                               
                                                                                                                
                                Path            truffle-hdwallet-provider > web3                              
                                                                                                                
                                More info       https://npmjs.com/advisories/877                              
                                                                                                                
                                found 2 low severity vulnerabilities in 122742 scanned packages
                                2 vulnerabilities require manual review. See the full report for details.

2 - web3 dependency:
The web3: 2.0.0-alpha.1 is not vulnerable to the "Insecure Credential Storage" vulnerability BUT it cannot be used in the web3 dependencies of 'truffle-contract' and 'truffle-hdwallet-provider' which use current web3 verison instead (1.2.1)

3 - Non-updated packages are "truffle-contract": "3.0.6", so that a 3rd vulnerability (ICS) is avoided. Current version "4.0.28"

4 - drizzle dependency not needed finally

5 - "preinstall": "rm -rf node_modules/*/.git/"
This command is needed to avoid the websocket .git repository issue which indeed breaks the 'npm install' command making it unavailable

    npm ERR! path C:\Users\amoro\Desktop\PROYECTOS\Blockchain\Ethereum\BitVoteSystem\System\bitvote-system\node_modules\web3-core\node_modules\websocket
    npm ERR! code EISGIT
    npm ERR! git C:\Users\amoro\Desktop\PROYECTOS\Blockchain\Ethereum\BitVoteSystem\System\bitvote-system\node_modules\web3-core\node_modules\websocket: Appears to be a
    git repo or submodule.
    npm ERR! git     C:\Users\amoro\Desktop\PROYECTOS\Blockchain\Ethereum\BitVoteSystem\System\bitvote-system\node_modules\web3-core\node_modules\websocket
    npm ERR! git Refusing to remove it. Update manually,
    npm ERR! git or move it out of the way first.