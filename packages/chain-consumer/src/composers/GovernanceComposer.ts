import { AccountAddress } from '@injectivelabs/ts-types'
import snakeCaseKeys from 'snakecase-keys'
import {
  MsgVote,
  MsgDeposit,
} from '@injectivelabs/chain-api/cosmos/gov/v1beta1/tx_pb'
import { VoteOptionMap } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/gov_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'

export class GovernanceComposer {
  static vote({
    proposalId,
    vote,
    voter,
  }: {
    proposalId: number
    vote: VoteOptionMap[keyof VoteOptionMap]
    voter: AccountAddress
  }) {
    const message = new MsgVote()
    message.setOption(vote)
    message.setProposalId(proposalId)
    message.setVoter(voter)

    return {
      ...snakeCaseKeys(message.toObject()),
      '@type': '/cosmos.gov.v1beta1.MsgVote',
    }
  }

  static deposit({
    proposalId,
    amount,
    denom,
    depositor,
  }: {
    proposalId: number
    denom: string
    amount: string
    depositor: AccountAddress
  }) {
    const deposit = new Coin()
    deposit.setAmount(amount)
    deposit.setDenom(denom)

    const message = new MsgDeposit()
    message.setDepositor(depositor)
    message.setProposalId(proposalId)

    const messageObj = {
      ...snakeCaseKeys(message.toObject()),
      amount: [{ ...snakeCaseKeys(deposit.toObject()) }],
      '@type': '/cosmos.gov.v1beta1.MsgDeposit',
    }

    // @ts-ignore
    delete messageObj.amount_list

    return messageObj
  }
}
