export type NodeHandler = ( node: Node ) => Node

export type Interpreter<State = any> = ( state?: State ) => NodeHandler
