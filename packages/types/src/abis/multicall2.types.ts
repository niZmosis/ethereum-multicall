import type { EthersContractContextV5 } from '@ethereum-abi-types-generator/converter-typescript'
import type { ContractTransaction, BytesLike as Arrayish } from 'ethers'

import type { ContractTransactionOverrides } from './common.types'

export type ContractContext = EthersContractContextV5<
  Contract,
  MethodNames,
  EventsContext,
  Events
>
export type Events = undefined
export interface EventsContext {}
export type MethodNames = 'aggregate' | 'tryBlockAndAggregate'
export type MethodNameMap = {
  [key in MethodNames]: string
}
export interface AggregateCallsRequest {
  target: string
  callData: Arrayish
}
export interface TryBlockAndAggregateCallsRequest {
  target: string
  callData: Arrayish
}
export interface Contract {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param calls Type: tuple[], Indexed: false
   */
  aggregate(
    calls: AggregateCallsRequest[],
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param requireSuccess Type: bool, Indexed: false
   * @param calls Type: tuple[], Indexed: false
   */
  tryBlockAndAggregate(
    requireSuccess: boolean,
    calls: TryBlockAndAggregateCallsRequest[],
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>
}
