export type FormStateChangeAction<T = any> = {
    name: string;
    value: T;
}

interface ElementReplaceAction {
    operation: "replace";
    value: any;
    index: number;
}

interface ElementDeleteAction {
    operation: "delete";
    index: number;
}

interface ElementPushAction<Value = any> {
    operation: "push";
    value: Value;
}

export type ArrayFieldChangeAction<Value = any> = ElementReplaceAction | ElementDeleteAction | ElementPushAction<Value>; 
