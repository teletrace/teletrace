# ElasticSearch SpanStorage Plugin

The `plugin` package interacts with elasticsearch using go-elasticsearch library (with the extensible to other libraries), and exposes interfaces for various configurations/indices/documents CRUD operations.

## Interactors

Currently 2 interactors are implementing different interactions with the cluster.
The purpose of the `factory.go` and the `interactor` package is to be able to combine both `TypedReqInteractor` interactions with `RawReqInteractor` in a way that the library consumers are unaware of the combination.

### TypedReqInteractor

go-elasticsearch recently released the first version of their typed API based on their [new API Spec](https://github.com/elastic/elasticsearch-specification) which should be the go-to api for most elasticsearch interactions. It is still young so some interactions are implemented in the raw request manner under `RawReqInteractor`.

### RawReqInteractor

Implements interactions with elasticsearch over the old raw API.

## Development

- When adding new interactions; please prioritize using the Typed API and use Raw API as a fallback.
- When creating new interactions with objects that are not yet implemented, please:
  - Create a new struct under `interactor/interfaces` that described the objects
  - Create a new file and/or function under `config` that instantiates a new instance of the struct, considering also the `pkg/config` cfg.
  - Add your new controllers to the `NewInteractor` factory.
