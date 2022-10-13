type Hash = string|number;

interface HashmapOperators<K,V> {
    hash(key: K):  Hash;
    equals(firstKey: K, secondKey: K): boolean;
}

export const DEFAULT_OPERATORS: HashmapOperators<unknown,unknown> = {
    hash: JSON.stringify,
    equals: (a,b) => JSON.stringify(a) === JSON.stringify(b)
};

interface HashmapEntry<K,V> {
    key: K;
    value: V;
}

/** Hash map where you can use objects as keys properly. */
export default class Hashmap<K,V> {
    private _map = new Map<Hash, HashmapEntry<K,V>[]>();
    
    constructor(private ops: HashmapOperators<K,V> = DEFAULT_OPERATORS) {

    }

    public set(key: K, value: V): void {
        const hash = this.ops.hash(key);
        // Fetch entries for this hash. May be empty.
        let entries = this._map.get(hash) ?? [];
        // Remove any existing entries with the same key
        entries = entries.filter(entry => !this.ops.equals(key,entry.key));
        // Add the current entry with this key.
        entries.push({key,value});
        // Set the map again.
        this._map.set(hash, entries);
    }

    public get(key: K): V|undefined {
        const hash = this.ops.hash(key);
        const entries = this._map.get(hash);
        if (entries === undefined) return undefined;
        return entries.find(
            entry => this.ops.equals(key, entry.key)
        )?.value;
    }

    public has(key: K): boolean {
        const hash = this.ops.hash(key);
        const entries = this._map.get(hash);
        if (entries === undefined) return false;
        return entries.some(entry => this.ops.equals(key, entry.key));
    }

    public *entries(): Iterable<[K,V]> {
        for (const entries of this._map.values()) {
            for (const entry of entries) {
                yield [entry.key,entry.value];
            }
        }
    }
}