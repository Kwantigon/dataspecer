# PIM level

See [model-driven architecture in data modeling](../../../../documentation/2022-04-21-model-driven-architecture.md) for more details.

This directory is divided into several subdirectories:
- [adapter](adapter) - contains functionality to recreate or save the model, such as RDF representation
- [model](model) - classes representing PIM entities - class, attribute, association, etc.
- [operation](operation) - `CoreOperation` to manipulate the model, such as create class, remove the attribute, etc.
- [executor](executor) - methods that can execute the operations above and modify the model
