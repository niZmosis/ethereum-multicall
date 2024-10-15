import { MulticallProviderBase } from '@ethereum-multicall/provider'
import type {
  ContractDetail,
  ContractTransactionOverrides,
  MulticallProviderContext,
  Erc721Contract,
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
  defaultErc721MethodMap,
  erc721ABI,
} from '@ethereum-multicall/utils'
import type {
  BigNumber,
  BigNumberish,
  BytesLike,
  BytesLike as Arrayish,
  ContractTransaction,
} from 'ethers'
import { isBytesLike } from 'ethers/lib/utils'

export class Erc721ContractFactory
  extends MulticallProviderBase
  implements Erc721Contract.Contract
{
  protected _contractDetail: ContractDetail

  protected _contract: Erc721Contract.ContractContext

  protected _methodNames: Erc721Contract.MethodNameMap

  constructor(
    dexProviderContext: MulticallProviderContext,
    contractDetail: ContractDetailToken,
  ) {
    super(dexProviderContext)

    if (!contractDetail) {
      throw new MulticallError(
        'contractDetail is required',
        ErrorCodes.functionArgumentError,
      )
    }

    this._contractDetail = {
      ...contractDetail,
      abi: contractDetail.abi || erc721ABI,
    }

    this._contract =
      this._multicallProvider.getContract<Erc721Contract.ContractContext>(
        this._contractDetail,
      )

    this._methodNames = {
      ...defaultErc721MethodMap,
      ...this._contractDetail.methods,
    }
  }

  /** Get the contract detail */
  public get contractDetail(): ContractDetail {
    return this._contractDetail
  }

  /** Get the ERC721 contract */
  public get erc721Contract(): Erc721Contract.ContractContext {
    return this._contract
  }

  /** Get the method names */
  public get methodNames(): Erc721Contract.MethodNameMap {
    return this._methodNames
  }

  /**
   * Helper function to dynamically invoke a contract method based on custom or default method names.
   * @param methodName - The name of the method to invoke.
   * @param values - An array of values to pass as arguments to the method.
   * @returns The result of the contract method invocation with the appropriate return type.
   */
  protected async callContractMethod<T>(
    methodName: Erc721Contract.MethodNames,
    values?: any[],
  ): Promise<T> {
    const contractMethodName = this._methodNames[
      methodName
    ] as keyof Erc721Contract.ContractContext

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
    methodName: Erc721Contract.MethodNames,
    values?: any[],
  ): string {
    return this._contract.interface.encodeFunctionData(
      this._methodNames[methodName] as Erc721Contract.MethodNames,
      values,
    )
  }

  /**
   * Helper function to dynamically prepare a call context based on custom or default method names.
   * @param methodName - The name of the method to invoke.
   * @param methodParameters - The method parameters.
   * @returns The call context.
   */
  protected prepareCallContext<TMethod extends keyof Erc721Contract.Contract>(
    methodName: TMethod,
    methodParameters: any[] = [],
  ): MethodCall<Erc721Contract.Contract, TMethod> {
    const contractMethodName = this._methodNames[
      methodName
    ] as keyof Erc721Contract.Contract

    if (typeof this._contract[contractMethodName] === 'function') {
      return {
        methodName,
        methodParameters: methodParameters ?? [],
      } as MethodCall<Erc721Contract.Contract, TMethod>
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
      DiscriminatedMethodCalls<Erc721Contract.Contract>[MethodNames<Erc721Contract.Contract>]
    >,
  >(
    calls: TCalls,
    options: ContractContextOptions = {},
  ): Promise<{
    blockNumber: number
    originContext: ContractResults<
      Erc721Contract.Contract,
      TCalls
    >['originContext']
    results: ContractResults<Erc721Contract.Contract, TCalls>['results']
  }> {
    return super.multicall<Erc721Contract.Contract, TCalls>(calls, options)
  }

  /**
   * Deploys a new instance of the contract.
   * @param overrides - Optional transaction overrides.
   * @returns The contract transaction.
   */
  public async new(
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction> {
    return this.callContractMethod<ContractTransaction>('new', [overrides])
  }

  /**
   * Encodes the function call to deploy a new instance of the contract.
   * @param overrides - Optional transaction overrides.
   * @returns The encoded data as a string.
   */
  public encodeNew(overrides?: ContractTransactionOverrides): string {
    return this._contract.interface.encodeFunctionData('new', [overrides])
  }
  /**
   * Approves the specified token ID for the specified address.
   * @param to - The address to approve.
   * @param tokenId - The token ID to approve.
   * @param overrides - Optional transaction overrides.
   * @returns The contract transaction.
   */
  public async approve(
    to: string,
    tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction> {
    return this.callContractMethod<ContractTransaction>('approve', [
      to,
      tokenId,
      overrides,
    ])
  }

  /**
   * Encodes the function data for approving a token ID.
   * @param to - The address to approve.
   * @param tokenId - The token ID to approve.
   * @returns The encoded function data.
   */
  public encodeApprove(to: string, tokenId: BigNumberish): string {
    return this.encodeFunctionData('approve', [to, tokenId])
  }

  /**
   * Returns the balance of tokens owned by the specified address.
   * @param owner - The address to query.
   * @returns The balance of tokens owned by the specified address.
   */
  public async balanceOf(owner: string): Promise<BigNumber> {
    return this.callContractMethod<BigNumber>('balanceOf', [owner])
  }

  /**
   * Returns the call context for the balanceOf method.
   * @param owner - The address to query.
   * @returns The call context.
   */
  public balanceOfCallContext(
    owner: string,
  ): MethodCall<Erc721Contract.Contract, 'balanceOf'> {
    return this.prepareCallContext('balanceOf', [owner])
  }

  /**
   * Returns the address approved for the specified token ID.
   * @param tokenId - The token ID to query.
   * @returns The address approved for the specified token ID.
   */
  public async getApproved(tokenId: BigNumberish): Promise<string> {
    return this.callContractMethod<string>('getApproved', [tokenId])
  }

  /**
   * Returns the call context for the getApproved method.
   * @param tokenId - The token ID to query.
   * @returns The call context.
   */
  public getApprovedCallContext(
    tokenId: BigNumberish,
  ): MethodCall<Erc721Contract.Contract, 'getApproved'> {
    return this.prepareCallContext('getApproved', [tokenId])
  }

  /**
   * Checks if an operator is approved to manage all tokens of a specified owner.
   * @param owner - The address of the owner.
   * @param operator - The address of the operator.
   * @returns True if the operator is approved for all tokens, false otherwise.
   */
  public async isApprovedForAll(
    owner: string,
    operator: string,
  ): Promise<boolean> {
    return this.callContractMethod<boolean>('isApprovedForAll', [
      owner,
      operator,
    ])
  }

  /**
   * Returns the call context for the isApprovedForAll method.
   * @param owner - The address of the owner.
   * @param operator - The address of the operator.
   * @returns The call context.
   */
  public isApprovedForAllCallContext(
    owner: string,
    operator: string,
  ): MethodCall<Erc721Contract.Contract, 'isApprovedForAll'> {
    return this.prepareCallContext('isApprovedForAll', [owner, operator])
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
  public nameCallContext(): MethodCall<Erc721Contract.Contract, 'name'> {
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
  public symbolCallContext(): MethodCall<Erc721Contract.Contract, 'symbol'> {
    return this.prepareCallContext('symbol', [])
  }

  /**
   * Gets the token ID of the contract.
   * @returns The token ID as a BigNumber.
   */
  public async tokenId(): Promise<BigNumber> {
    return this.callContractMethod<BigNumber>('tokenId', [])
  }

  /**
   * Generates the call context for retrieving the token ID of the contract.
   * @returns The call context for the method.
   */
  public tokenIdCallContext(): MethodCall<Erc721Contract.Contract, 'tokenId'> {
    return this.prepareCallContext('tokenId', [])
  }

  /**
   * Returns the owner of the contract.
   * @returns The owner of the contract.
   */
  public async owner(): Promise<string> {
    return this.callContractMethod<string>('owner', [])
  }

  /**
   * Returns the call context for the owner method.
   * @returns The call context.
   */
  public ownerCallContext(): MethodCall<Erc721Contract.Contract, 'owner'> {
    return this.prepareCallContext('owner', [])
  }

  /**
   * Returns the owner of the specified token ID.
   * @param tokenId - The token ID to query.
   * @returns The owner of the specified token ID.
   */
  public async ownerOf(tokenId: BigNumberish): Promise<string> {
    return this.callContractMethod<string>('ownerOf', [tokenId])
  }

  /**
   * Returns the call context for the ownerOf method.
   * @param tokenId - The token ID to query.
   * @returns The call context.
   */
  public ownerOfCallContext(
    tokenId: BigNumberish,
  ): MethodCall<Erc721Contract.Contract, 'ownerOf'> {
    return this.prepareCallContext('ownerOf', [tokenId])
  }

  /**
   * Renounces ownership of the contract.
   * @param overrides - Optional transaction overrides.
   * @returns The contract transaction.
   */
  public async renounceOwnership(
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction> {
    return this.callContractMethod<ContractTransaction>('renounceOwnership', [
      overrides,
    ])
  }

  /**
   * Encodes the function call to renounce ownership of the contract.
   * @param overrides - Optional transaction overrides.
   * @returns The encoded data as a string.
   */
  public encodeRenounceOwnership(
    overrides?: ContractTransactionOverrides,
  ): string {
    return this.encodeFunctionData('renounceOwnership', [overrides])
  }

  /**
   * Safely transfers a token from one address to another.
   * @param from - The address to transfer from.
   * @param to - The address to transfer to.
   * @param tokenId - The token ID to transfer.
   * @param overrides - Optional transaction overrides.
   * @returns The contract transaction.
   */
  public async safeTransferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>

  /**
   * Safely transfers a token from one address to another with additional data.
   * @param from - The address to transfer from.
   * @param to - The address to transfer to.
   * @param tokenId - The token ID to transfer.
   * @param data - Additional data to include with the transfer.
   * @param overrides - Optional transaction overrides.
   * @returns The contract transaction.
   */
  public async safeTransferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    data: Arrayish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction>

  public async safeTransferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    dataOrOverrides?: Arrayish | ContractTransactionOverrides,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction> {
    if (
      typeof dataOrOverrides === 'string' ||
      dataOrOverrides instanceof Uint8Array ||
      isBytesLike(dataOrOverrides)
    ) {
      return this.callContractMethod<ContractTransaction>('safeTransferFrom', [
        from,
        to,
        tokenId,
        dataOrOverrides,
        overrides,
      ])
    } else {
      return this.callContractMethod<ContractTransaction>('safeTransferFrom', [
        from,
        to,
        tokenId,
        dataOrOverrides,
      ])
    }
  }

  /**
   * Encodes the function data for the `safeTransferFrom` method of the contract.
   *
   * @param from - The address to transfer the token from.
   * @param to - The address to transfer the token to.
   * @param tokenId - The ID of the token to transfer.
   * @param dataOrOverrides - (Optional) Additional data to include with the transfer, or transaction overrides if no additional data is provided.
   * @param overrides - (Optional) Transaction overrides for gas, nonce, etc.
   * @returns The encoded function data as a string.
   */
  public encodeSafeTransferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    dataOrOverrides?: Arrayish | ContractTransactionOverrides,
    overrides?: ContractTransactionOverrides,
  ): string {
    if (
      typeof dataOrOverrides === 'string' ||
      dataOrOverrides instanceof Uint8Array ||
      isBytesLike(dataOrOverrides)
    ) {
      const suffix = `(address,address,uint256,bytes)`
      const functionSignature = `${this.methodNames['safeTransferFrom']}${suffix}`
      const data = dataOrOverrides

      return this._contract.interface.encodeFunctionData(
        functionSignature as Erc721Contract.MethodNames,
        [from, to, tokenId, data, overrides],
      )
    } else {
      const suffix = `(address,address,uint256)`
      const functionSignature = `${this.methodNames['safeTransferFrom']}${suffix}`

      return this._contract.interface.encodeFunctionData(
        functionSignature as Erc721Contract.MethodNames,
        [from, to, tokenId, overrides],
      )
    }
  }

  /**
   * Sets or un-sets the approval of a given operator.
   * @param operator - The operator to set the approval for.
   * @param approved - Whether to approve or remove the operator.
   * @param overrides - Optional transaction overrides.
   * @returns The contract transaction.
   */
  public async setApprovalForAll(
    operator: string,
    approved: boolean,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction> {
    return this.callContractMethod<ContractTransaction>('setApprovalForAll', [
      operator,
      approved,
      overrides,
    ])
  }

  /**
   * Encodes the function data for setting or unsetting the approval of a given operator.
   * @param operator - The operator to set the approval for.
   * @param approved - Whether to approve or remove the operator.
   * @returns The encoded function data.
   */
  public encodeSetApprovalForAll(operator: string, approved: boolean): string {
    return this.encodeFunctionData('setApprovalForAll', [operator, approved])
  }

  /**
   * Checks if a contract implements an interface.
   * @param interfaceId - The interface ID to check.
   * @returns True if the contract implements the interface, false otherwise.
   */
  public async supportsInterface(interfaceId: BytesLike): Promise<boolean> {
    return this.callContractMethod<boolean>('supportsInterface', [interfaceId])
  }

  /**
   * Returns the call context for the supportsInterface method.
   * @param interfaceId - The interface ID to check.
   * @returns The call context.
   */
  public supportsInterfaceCallContext(
    interfaceId: BytesLike,
  ): MethodCall<Erc721Contract.Contract, 'supportsInterface'> {
    return this.prepareCallContext('supportsInterface', [interfaceId])
  }

  /**
   * Returns the token URI for the specified token ID.
   * @param tokenId - The token ID to query.
   * @returns The token URI.
   */
  public async tokenURI(tokenId: BigNumberish): Promise<string> {
    return this.callContractMethod<string>('tokenURI', [tokenId])
  }

  /**
   * Returns the call context for the tokenURI method.
   * @param tokenId - The token ID to query.
   * @returns The call context.
   */
  public tokenURICallContext(
    tokenId: BigNumberish,
  ): MethodCall<Erc721Contract.Contract, 'tokenURI'> {
    return this.prepareCallContext('tokenURI', [tokenId])
  }

  /**
   * Transfers a token from one address to another.
   * @param from - The address to transfer from.
   * @param to - The address to transfer to.
   * @param tokenId - The token ID to transfer.
   * @param overrides - Optional transaction overrides.
   * @returns The contract transaction.
   */
  public async transferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction> {
    return this.callContractMethod<ContractTransaction>('transferFrom', [
      from,
      to,
      tokenId,
      overrides,
    ])
  }

  /**
   * Encodes the function data for transferring a token from one address to another.
   * @param from - The address to transfer from.
   * @param to - The address to transfer to.
   * @param tokenId - The token ID to transfer.
   * @returns The encoded function data.
   */
  public encodeTransferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
  ): string {
    return this.encodeFunctionData('transferFrom', [from, to, tokenId])
  }

  /**
   * Transfers ownership of the contract to a new owner.
   * @param newOwner - The address of the new owner.
   * @param overrides - Optional transaction overrides.
   * @returns The contract transaction.
   */
  public async transferOwnership(
    newOwner: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction> {
    return this.callContractMethod<ContractTransaction>('transferOwnership', [
      newOwner,
      overrides,
    ])
  }

  /**
   * Encodes the function data for transferring ownership of the contract to a new owner.
   * @param newOwner - The address of the new owner.
   * @returns The encoded function data.
   */
  public encodeTransferOwnership(newOwner: string): string {
    return this.encodeFunctionData('transferOwnership', [newOwner])
  }

  /**
   * Mints a new NFT and assigns it to the recipient.
   * @param recipient - The address to receive the minted NFT.
   * @param tokenURI - The URI for the minted NFT's metadata.
   * @param overrides - Optional transaction overrides.
   * @returns The contract transaction.
   */
  public async mintNFT(
    recipient: string,
    tokenURI: string,
    overrides?: ContractTransactionOverrides,
  ): Promise<ContractTransaction> {
    return this.callContractMethod<ContractTransaction>('mintNFT', [
      recipient,
      tokenURI,
      overrides,
    ])
  }

  /**
   * Encodes the function data for minting a new NFT.
   * @param recipient - The address to receive the minted NFT.
   * @param tokenURI - The URI for the minted NFT's metadata.
   * @returns The encoded function data.
   */
  public encodeMintNFT(recipient: string, tokenURI: string): string {
    return this.encodeFunctionData('mintNFT', [recipient, tokenURI])
  }
}
