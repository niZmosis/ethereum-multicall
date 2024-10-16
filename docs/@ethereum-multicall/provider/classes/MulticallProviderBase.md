[**@ethereum-multicall/provider v3.0.0**](../README.md) • **Docs**

***

[Documentation v3.0.0](../../../packages.md) / [@ethereum-multicall/provider](../README.md) / MulticallProviderBase

# Class: `abstract` MulticallProviderBase

## Constructors

### new MulticallProviderBase()

> **new MulticallProviderBase**(`multicallProviderContext`): [`MulticallProviderBase`](MulticallProviderBase.md)

#### Parameters

• **multicallProviderContext**: `MulticallProviderContext`

#### Returns

[`MulticallProviderBase`](MulticallProviderBase.md)

#### Defined in

[provider/src/multicall-provider-base.ts:19](https://github.com/niZmosis/ethereum-multicall/blob/759805f36c7ddb05e5fad0eb8478dcf22871af59/packages/provider/src/multicall-provider-base.ts#L19)

## Properties

### \_multicallProvider

> `protected` **\_multicallProvider**: [`MulticallProvider`](MulticallProvider.md)

#### Defined in

[provider/src/multicall-provider-base.ts:17](https://github.com/niZmosis/ethereum-multicall/blob/759805f36c7ddb05e5fad0eb8478dcf22871af59/packages/provider/src/multicall-provider-base.ts#L17)

## Accessors

### contractDetail

> `get` `abstract` **contractDetail**(): `ContractDetail`

Returns the contract details.

#### Returns

`ContractDetail`

The contract details of the concrete class.

#### Defined in

[provider/src/multicall-provider-base.ts:39](https://github.com/niZmosis/ethereum-multicall/blob/759805f36c7ddb05e5fad0eb8478dcf22871af59/packages/provider/src/multicall-provider-base.ts#L39)

***

### multicallProvider

> `get` **multicallProvider**(): [`MulticallProvider`](MulticallProvider.md)

Returns the underlying `MulticallProvider`.

#### Returns

[`MulticallProvider`](MulticallProvider.md)

The `MulticallProvider` instance used by this class.

#### Defined in

[provider/src/multicall-provider-base.ts:30](https://github.com/niZmosis/ethereum-multicall/blob/759805f36c7ddb05e5fad0eb8478dcf22871af59/packages/provider/src/multicall-provider-base.ts#L30)

## Methods

### executeCall()

> `protected` **executeCall**\<`TContract`, `TCalls`\>(`calls`, `options`): `Promise`\<`object`\>

Executes a multicall for the given contract methods.

#### Type Parameters

• **TContract** *extends* `Record`\<`string`, `any`\>

The contract type.

• **TCalls** *extends* `Record`\<`string`, `DiscriminatedMethodCalls`\<`TContract`\>\[`MethodNames`\<`TContract`\>\]\>

The type of the calls object.

#### Parameters

• **calls**: `TCalls`

An object describing the methods to call and their parameters.

• **options**: `ContractContextOptions` = `{}`

Optional configuration for the contract call.

#### Returns

`Promise`\<`object`\>

A promise that resolves to an object containing the block number,
         origin context, and the results of each method call.

##### blockNumber

> **blockNumber**: `number`

##### originContext

> **originContext**: `ContractContext`\<`TContract`, `TCalls`, `unknown`\>

##### results

> **results**: `ContractMethodResult`\<`TContract`, `TCalls`\>

#### Defined in

[provider/src/multicall-provider-base.ts:53](https://github.com/niZmosis/ethereum-multicall/blob/759805f36c7ddb05e5fad0eb8478dcf22871af59/packages/provider/src/multicall-provider-base.ts#L53)
