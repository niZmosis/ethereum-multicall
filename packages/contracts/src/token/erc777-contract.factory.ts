import { MulticallProviderBase } from '@ethereum-multicall/provider'
import type {
  ContractDetail,
  MulticallProviderContext,
  Erc777Contract,
  ContractTransactionOverrides,
  ContractDetailToken,
  MethodCall,
  DiscriminatedMethodCalls,
  MethodNames,
  ContractContextOptions,
  ContractResults,
} from '@ethereum-multicall/types'
import {
  MulticallError,
  ErrorCodes,
  defaultErc777MethodMap,
  erc777ABI,
} from '@ethereum-multicall/utils'
import type {
  BigNumberish,
  BytesLike,
  ContractTransaction,
  BigNumber,
} from 'ethers'

export class Erc777ContractFactory
  extends MulticallProviderBase
  implements Erc777Contract.Contract
{
  protected _contractDetail: ContractDetail

  protected _contract: Erc777Contract.ContractContext

  protected _methodNames: Erc777Contract.MethodNameMap

  constructor(
    multicallProviderContext: MulticallProviderContext,
    contractDetail: ContractDetailToken,
  ) {
    super(multicallProviderContext)

    if (!contractDetail) {
      throw new MulticallError(
        'contractDetail is required',
        ErrorCodes.functionArgumentError,
      )
    }

    this._contractDetail = {
      ...contractDetail,
      abi: contractDetail.abi || erc777ABI,
    }

    this._contract =
      this._multicallProvider.getContract<Erc777Contract.ContractContext>(
        this._contractDetail,
      )

    this._methodNames = {
      ...defaultErc777MethodMap,
      ...this._contractDetail.methods,
    }
  }

  /** Get the contract detail */
  public get contractDetail(): ContractDetail {
    return this._contractDetail
  }

  /** Get the ERC777 contract */
  public get erc777Contract(): Erc777Contract.ContractContext {
    return this._contract
  }

  /** Get the method names */
  public get methodNames(): Erc777Contract.MethodNameMap {
    return this._methodNames
  }

  /**
   * Helper function to dynamically invoke a contract method based on custom or default method names.
   * @param methodName - The name of the method to invoke.
   * @param values - An array of values to pass as arguments to the method.
   * @returns The result of the contract method invocation with the appropriate return type.
   */
  protected async callContractMethod<T>(
    methodName: Erc777Contract.MethodNames,
    values?: any[],
  ): Promise<T> {
    const contractMethodName = this._methodNames[
      methodName
    ] as keyof Erc777Contract.ContractContext

    if (typeof this._contract[contractMethodName] === 'function') {
      return (this._contract[contractMethodName] as any)(...(values || []))
    } else {
      throw new MulticallError(
        `Method ${methodName} does not exist on the contract`,
        ErrorCodes.functionArgumentError,
      )
    }
  }

  /**
   * Encodes the function data for the given method name, using custom method names if provided in the contract detail.
   * @param methodName - The method name.
   * @param values - The values to encode.
   * @returns The encoded function data.
   */
  protected encodeFunctionData(
    methodName: Erc777Contract.MethodNames,
    values?: any[],
  ): string {
    return this._contract.interface.encodeFunctionData(
      this._methodNames[methodName] as Erc777Contract.MethodNames,
      values,
    )
  }

  /**
   * Helper function to dynamically prepare a call context based on custom or default method names.
   * @param methodName - The name of the method to invoke.
   * @param methodParameters - The method parameters.
   * @returns The call context.
   */
  protected prepareCallContext<TMethod extends keyof Erc777Contract.Contract>(
    methodName: TMethod,
    methodParameters: any[] = [],
  ): MethodCall<Erc777Contract.Contract, TMethod> {
    const contractMethodName = this._methodNames[
      methodName
    ] as keyof Erc777Contract.Contract

    if (typeof this._contract[contractMethodName] === 'function') {
      return {
        methodName,
        methodParameters: methodParameters ?? [],
      } as MethodCall<Erc777Contract.Contract, TMethod>
    } else {
      throw new MulticallError(
        `Method ${String(methodName)} does not exist on the contract`,
        ErrorCodes.functionArgumentError,
      )
    }
  }

  /**
   * Executes a multicall for the given contract methods.
   *
   * @template TCalls - The type of the calls object.
   *
   * @param calls - An object describing the methods to call and their parameters.
   * @param options - Optional configuration for the contract call.
   * @returns A promise that resolves to an object containing the block number,
   *          origin context, and the results of each method call.
   *
   * @remarks
   * This method allows batch calling of multiple contract methods in a single transaction.
   * It uses the multicall provider to execute all calls efficiently.
   * The results are typed according to the return types of the called methods.
   */
  async call<
    TCalls extends Record<
      string,
      DiscriminatedMethodCalls<Erc777Contract.Contract>[MethodNames<Erc777Contract.Contract>]
    >,
  >(
    calls: TCalls,
    options: ContractContextOptions = {},
  ): Promise<{
    blockNumber: number
    originContext: ContractResults<
      Erc777Contract.Contract,
      TCalls
    >['originContext']
    results: ContractResults<Erc777Contract.Contract, TCalls>['results']
  }> {
    return super.multicall<Erc777Contract.Contract, TCalls>(calls, options)
  }

  /**
   * Returns the name of the token.
   * @returns The name of the token.
   */
  public async name(): Promise<string> {
    return this.callContractMethod<string>('name', [])
  }

  /**
   * Returns the call context for the name method.
   * @returns The call context.
   */
  public nameCallContext(): MethodCall<Erc777Contract.Contract, 'name'> {
    return this.prepareCallContext('name', [])
  }

  /**
   * Returns the symbol of the token.
   * @returns The symbol of the token.
   */
  public async symbol(): Promise<string> {
    return this.callContractMethod<string>('symbol', [])
  }

  /**
   * Returns the call context for the symbol method.
   * @returns The call context.
   */
  public symbolCallContext(): MethodCall<Erc777Contract.Contract, 'symbol'> {
    return this.prepareCallContext('symbol', [])
  }

  /**
   * Returns the granularity of the token.
   * @returns The granularity of the token.
   */
  public async granularity(): Promise<BigNumber> {
    return this.callContractMethod<BigNumber>('granularity', [])
  }

  /**
   * Returns the call context for the granularity method.
   * @returns The call context.
   */
  public granularityCallContext(): MethodCall<
    Erc777Contract.Contract,
    'granularity'
  > {
    return this.prepareCallContext('granularity', [])
  }

  /**
   * Returns the list of default operators.
   * @returns The list of default operators.
   */
  public async defaultOperators(): Promise<string[]> {
    return this.callContractMethod<string[]>('defaultOperators', [])
  }

  /**
   * Returns the call context for the defaultOperators method.
   * @returns The call context.
   */
  public defaultOperatorsCallContext(): MethodCall<
    Erc777Contract.Contract,
    'defaultOperators'
  > {
    return this.prepareCallContext('defaultOperators', [])
  }

  /**
   * Returns the balance of the specified address.
   * @param _tokenHolder - The address to query.
   * @returns The balance of the specified address.
   */
  public async balanceOf(_tokenHolder: string): Promise<BigNumber> {
    return this.callContractMethod<BigNumber>('balanceOf', [_tokenHolder])
  }

  /**
   * Returns the call context for the balanceOf method.
   * @param _tokenHolder - The address to query.
   * @returns The call context.
   */
  public balanceOfCallContext(
    _tokenHolder: string,
  ): MethodCall<Erc777Contract.Contract, 'balanceOf'> {
    return this.prepareCallContext('balanceOf', [_tokenHolder])
  }

  /**
   * Checks if an operator is authorized for a given token holder.
   * @param _tokenHolder - The address of the token holder.
   * @param _operator - The address of the operator.
   * @returns True if the operator is authorized, false otherwise.
   */
  public async isOperatorFor(
    _tokenHolder: string,
    _operator: string,
  ): Promise<boolean> {
    return this.callContractMethod<boolean>('isOperatorFor', [
      _tokenHolder,
      _operator,
    ])
  }

  /**
   * Returns the call context for the isOperatorFor method.
   * @param _tokenHolder - The address of the token holder.
   * @param _operator - The address of the operator.
   * @returns The call context.
   */
  public isOperatorForCallContext(
    _tokenHolder: string,
    _operator: string,
  ): MethodCall<Erc777Contract.Contract, 'isOperatorFor'> {
    return this.prepareCallContext('isOperatorFor', [_tokenHolder, _operator])
  }

  /**
   * Authorizes an operator for a given token holder.
   * @param _tokenHolder - The address of the token holder.
   * @param overrides - Optional transaction overrides.
   * @returns A promise that resolves to a void.
   */
  public async authorizeOperator(
    _tokenHolder: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<void> {
    return this.callContractMethod<void>('authorizeOperator', [
      _tokenHolder,
      overrides,
    ])
  }

  /**
   * Encodes the function data for authorizing an operator.
   * @param _tokenHolder - The address of the token holder.
   * @returns The encoded function data.
   */
  public encodeAuthorizeOperator(_tokenHolder: string): string {
    return this.encodeFunctionData('authorizeOperator', [_tokenHolder])
  }

  /**
   * Retrieves the default operators send function.
   * @param overrides - Optional call overrides.
   * @returns A promise that resolves to void.
   */
  public async defaultOperatorsSend(): Promise<void> {
    return this.callContractMethod<void>('defaultOperatorsSend', [])
  }

  /**
   * Retrieves the call context for the default operators send function.
   * @param overrides - Optional call overrides.
   * @returns The call context.
   */
  public defaultOperatorsSendCallContext(): MethodCall<
    Erc777Contract.Contract,
    'defaultOperatorsSend'
  > {
    return this.prepareCallContext('defaultOperatorsSend', [])
  }

  /**
   * Revokes an operator for the caller.
   * @param _operator - The address of the operator to revoke.
   * @param overrides - Optional transaction overrides.
   * @returns A promise that resolves to a contract transaction.
   */
  public async revokeOperator(
    _operator: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>

  /**
   * Revokes a set of default operators.
   * @param _newDefaultOperators - The array of operator addresses to revoke.
   * @param overrides - Optional transaction overrides.
   * @returns A promise that resolves to a contract transaction.
   */
  public async revokeOperator(
    _newDefaultOperators: string[],
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>

  public async revokeOperator(
    _operatorOrOperators: string | string[],
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction> {
    return this.callContractMethod<ContractTransaction>('revokeOperator', [
      _operatorOrOperators,
      overrides,
    ])
  }

  /**
   * Encodes the function data for revoking an operator.
   * @param _operatorOrOperators - The address(es) of the operator(s) to revoke.
   * @returns The encoded function data.
   */
  public encodeRevokeOperator(_operatorOrOperators: string | string[]): string {
    const suffix = Array.isArray(_operatorOrOperators)
      ? '(address[])'
      : '(address)'
    const functionSignature = `revokeOperator${suffix}`

    return this._contract.interface.encodeFunctionData(
      functionSignature as Erc777Contract.MethodNames,
      [_operatorOrOperators],
    )
  }

  /**
   * Sends tokens from the caller to a recipient.
   * @param _from - The address to send from.
   * @param _to - The address to send to.
   * @param _value - The amount to send.
   * @param _data - Additional data to include with the send.
   * @param _operatorData - Additional operator data to include with the send.
   * @param overrides - Optional transaction overrides.
   * @returns A promise that resolves to a contract transaction.
   */
  public async operatorSend(
    _from: string,
    _to: string,
    _value: BigNumberish,
    _data: BytesLike,
    _operatorData: BytesLike,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction> {
    return this.callContractMethod<ContractTransaction>('operatorSend', [
      _from,
      _to,
      _value,
      _data,
      _operatorData,
      overrides,
    ])
  }

  /**
   * Encodes the function data for sending tokens via an operator.
   * @param _from - The address to send from.
   * @param _to - The address to send to.
   * @param _value - The amount to send.
   * @param _data - Additional data to include with the send.
   * @param _operatorData - Additional operator data to include with the send.
   * @returns The encoded function data.
   */
  public encodeOperatorSend(
    _from: string,
    _to: string,
    _value: BigNumberish,
    _data: BytesLike,
    _operatorData: BytesLike,
  ): string {
    return this.encodeFunctionData('operatorSend', [
      _from,
      _to,
      _value,
      _data,
      _operatorData,
    ])
  }

  /**
   * Revokes default operators.
   * @param _defaultOperators - The array of default operators to revoke.
   * @param overrides - Optional transaction overrides.
   * @returns A promise that resolves to a contract transaction.
   */
  public async revokeDefaultOperators(
    _defaultOperators: string[],
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction> {
    return this.callContractMethod<ContractTransaction>(
      'revokeDefaultOperators',
      [_defaultOperators, overrides],
    )
  }

  /**
   * Encodes the function data for revoking default operators.
   * @param _defaultOperators - The array of default operators to revoke.
   * @returns The encoded function data.
   */
  public encodeRevokeDefaultOperators(_defaultOperators: string[]): string {
    return this.encodeFunctionData('revokeDefaultOperators', [
      _defaultOperators,
    ])
  }

  /**
   * Sends tokens to a recipient.
   * @param _from - The address to send from.
   * @param _to - The address to send to.
   * @param _value - The amount to send.
   * @param _data - Additional data to include with the send.
   * @param overrides - Optional transaction overrides.
   * @returns A promise that resolves to a contract transaction.
   */
  public async send(
    _from: string,
    _to: string,
    _value: BigNumberish,
    _data: BytesLike,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction> {
    return this.callContractMethod<ContractTransaction>('send', [
      _from,
      _to,
      _value,
      _data,
      overrides,
    ])
  }

  /**
   * Encodes the function data for sending tokens.
   * @param _from - The address to send from.
   * @param _to - The address to send to.
   * @param _value - The amount to send.
   * @param _data - Additional data to include with the send.
   * @returns The encoded function data.
   */
  public encodeSend(
    _from: string,
    _to: string,
    _value: BigNumberish,
    _data: BytesLike,
  ): string {
    return this.encodeFunctionData('send', [_from, _to, _value, _data])
  }

  /**
   * Sets default operators.
   * @param _defaultOperators - The array of new default operators.
   * @param overrides - Optional transaction overrides.
   * @returns A promise that resolves to a contract transaction.
   */
  public async setDefaultOperators(
    _defaultOperators: string[],
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction> {
    return this.callContractMethod<ContractTransaction>('setDefaultOperators', [
      _defaultOperators,
      overrides,
    ])
  }

  /**
   * Encodes the function data for setting default operators.
   * @param _defaultOperators - The array of new default operators.
   * @returns The encoded function data.
   */
  public encodeSetDefaultOperators(_defaultOperators: string[]): string {
    return this.encodeFunctionData('setDefaultOperators', [_defaultOperators])
  }
}
