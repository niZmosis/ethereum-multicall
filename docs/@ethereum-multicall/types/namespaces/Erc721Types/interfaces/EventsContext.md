[**@ethereum-multicall/types v1.0.0**](../../../README.md) • **Docs**

***

[Documentation v1.0.0](../../../../../packages.md) / [@ethereum-multicall/types](../../../README.md) / [Erc721Types](../README.md) / EventsContext

# Interface: EventsContext

## Methods

### Approval()

> **Approval**(`owner`, `approved`, `tokenId`): [`EventFilter`](../../../type-aliases/EventFilter.md)

#### Parameters

• **owner**: `string`

• **approved**: `string`

• **tokenId**: `BigNumberish`

#### Returns

[`EventFilter`](../../../type-aliases/EventFilter.md)

#### Defined in

[abis/erc721.types.ts:29](https://github.com/niZmosis/ethereum-multicall/blob/2a2d077a99c23b464a4e40dd6375d06ce98594bd/packages/types/src/abis/erc721.types.ts#L29)

***

### ApprovalForAll()

> **ApprovalForAll**(`owner`, `operator`, `approved`): [`EventFilter`](../../../type-aliases/EventFilter.md)

#### Parameters

• **owner**: `string`

• **operator**: `string`

• **approved**: `boolean`

#### Returns

[`EventFilter`](../../../type-aliases/EventFilter.md)

#### Defined in

[abis/erc721.types.ts:30](https://github.com/niZmosis/ethereum-multicall/blob/2a2d077a99c23b464a4e40dd6375d06ce98594bd/packages/types/src/abis/erc721.types.ts#L30)

***

### BatchMetadataUpdate()

> **BatchMetadataUpdate**(`_fromTokenId`, `_toTokenId`): [`EventFilter`](../../../type-aliases/EventFilter.md)

#### Parameters

• **\_fromTokenId**: `BigNumberish`

• **\_toTokenId**: `BigNumberish`

#### Returns

[`EventFilter`](../../../type-aliases/EventFilter.md)

#### Defined in

[abis/erc721.types.ts:35](https://github.com/niZmosis/ethereum-multicall/blob/2a2d077a99c23b464a4e40dd6375d06ce98594bd/packages/types/src/abis/erc721.types.ts#L35)

***

### MetadataUpdate()

> **MetadataUpdate**(`_tokenId`): [`EventFilter`](../../../type-aliases/EventFilter.md)

#### Parameters

• **\_tokenId**: `BigNumberish`

#### Returns

[`EventFilter`](../../../type-aliases/EventFilter.md)

#### Defined in

[abis/erc721.types.ts:39](https://github.com/niZmosis/ethereum-multicall/blob/2a2d077a99c23b464a4e40dd6375d06ce98594bd/packages/types/src/abis/erc721.types.ts#L39)

***

### OwnershipTransferred()

> **OwnershipTransferred**(`previousOwner`, `newOwner`): [`EventFilter`](../../../type-aliases/EventFilter.md)

#### Parameters

• **previousOwner**: `string`

• **newOwner**: `string`

#### Returns

[`EventFilter`](../../../type-aliases/EventFilter.md)

#### Defined in

[abis/erc721.types.ts:40](https://github.com/niZmosis/ethereum-multicall/blob/2a2d077a99c23b464a4e40dd6375d06ce98594bd/packages/types/src/abis/erc721.types.ts#L40)

***

### Transfer()

> **Transfer**(`from`, `to`, `tokenId`): [`EventFilter`](../../../type-aliases/EventFilter.md)

#### Parameters

• **from**: `string`

• **to**: `string`

• **tokenId**: `BigNumberish`

#### Returns

[`EventFilter`](../../../type-aliases/EventFilter.md)

#### Defined in

[abis/erc721.types.ts:41](https://github.com/niZmosis/ethereum-multicall/blob/2a2d077a99c23b464a4e40dd6375d06ce98594bd/packages/types/src/abis/erc721.types.ts#L41)