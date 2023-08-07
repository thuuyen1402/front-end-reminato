type Obj<T>={
    [key:string]:T
}

type Pagination={
    cursor?: string,
    isEnd: boolean;
}