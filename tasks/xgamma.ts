import { expect } from 'chai'
import { constants, Wallet } from 'ethers'
import { formatEther, parseEther} from 'ethers/lib/utils'
import { task } from 'hardhat/config'
import { deployContract } from './utils'

task('deploy-xgamma', 'Deploy xGAMMA contract')
  .addParam('token', 'GAMMA token address')
  .setAction(async (args, { ethers, run, network }) => {

    console.log('Network')
    console.log('  ', network.name)
    console.log('Task Args')
    console.log(args)

    // compile

    await run('compile')

    // get signer

    const signer = (await ethers.getSigners())[0]
    console.log('Signer')
    console.log('  at', signer.address)
    console.log('  ETH', formatEther(await signer.getBalance()))

    // deploy contracts
    const xgamma = await deployContract(
      'xGamma',
      await ethers.getContractFactory('xGamma'),
      signer,
      [args.token]
    )
    await xgamma.deployTransaction.wait(5)
    await run('verify:verify', {
      address: xgamma.address,
      constructorArguments: [args.token]
    })
})
