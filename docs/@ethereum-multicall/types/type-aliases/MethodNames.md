[**@ethereum-multicall/types v3.0.0**](../README.md) • **Docs**

***

[Documentation v3.0.0](../../../packages.md) / [@ethereum-multicall/types](../README.md) / MethodNames

# Type Alias: MethodNames\<TContract\>

> **MethodNames**\<`TContract`\>: `{ [KMethodName in keyof TContract]: TContract[KMethodName] extends Function ? KMethodName : never }`\[keyof `TContract`\]

Represents the names of methods in a contract.

## Type Parameters

• **TContract**

The contract type.

## Defined in

[call.types.ts:39](https://github.com/niZmosis/ethereum-multicall/blob/759805f36c7ddb05e5fad0eb8478dcf22871af59/packages/types/src/call.types.ts#L39)
