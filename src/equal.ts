export function shallowEqualArrays(
    firstArray: unknown[], secondArray: unknown[]
): boolean {
    if (firstArray.length !== secondArray.length) return false;
    for (let i=0;i<firstArray.length;++i) {
        if (firstArray[i] !== secondArray[i]) return false;
    }
    return true;
}

export function shallowHashArray(array: unknown[]) {
    return JSON.stringify(array);
}