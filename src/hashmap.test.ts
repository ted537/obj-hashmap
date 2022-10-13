import Hashmap from './Hashmap';
import { shallowEqualArrays, shallowHashArray } from './equal';

describe('HashMap', function() {
    it('Sets and gets a simple object', function() {
        interface MyCustomKey {bob: number};
        interface MyCustomValue {charlie: number};
        const hashmap = new Hashmap<MyCustomKey,MyCustomValue>({
            equals: (firstKey, secondKey) => firstKey.bob === secondKey.bob,
            hash: key => key.bob
        });
        hashmap.set({bob:3},{charlie:3});
        expect(hashmap.get({bob:3})).toEqual({charlie:3});
        hashmap.set({bob:3}, {charlie:4});
        expect(hashmap.get({bob:3})).toEqual({charlie:4});
    });

    it('Sets and gets a simple object with default operators', function() {
        interface MyCustomKey {bob: number};
        interface MyCustomValue {charlie: number};
        const hashmap = new Hashmap<MyCustomKey,MyCustomValue>();
        hashmap.set({bob:3},{charlie:3});
        expect(hashmap.get({bob:3})).toEqual({charlie:3});
        hashmap.set({bob:3}, {charlie:4});
        expect(hashmap.get({bob:3})).toEqual({charlie:4});
    });


    it('Has iterable entries', function() {
        interface MyCustomKey {bob: number};
        interface MyCustomValue {charlie: number};
        const hashmap = new Hashmap<MyCustomKey,MyCustomValue>({
            equals: (firstKey, secondKey) => firstKey.bob === secondKey.bob,
            hash: key => key.bob
        });

        hashmap.set({bob:3},{charlie:30});
        hashmap.set({bob:4},{charlie:40});

        const allEntries = new Set(hashmap.entries());
        expect(allEntries).toEqual(new Set([
            [{bob:3}, {charlie:30}],
            [{bob:4}, {charlie:40}]
        ]));
    });

    it('Supports tuple keys', function() {
        type MyCustomKey = [ string, number, string ];
        interface MyCustomValue {charlie: number};
        const hashmap = new Hashmap<MyCustomKey,MyCustomValue>({
            equals: shallowEqualArrays,
            hash: shallowHashArray
        });

        hashmap.set(['hi',4,'there'], {charlie:30});

        expect(hashmap.get(['hi',4,'there'])).toEqual({charlie:30});
    });

    it('Supports a 2d example', function() {
        interface Point { x: number; y: number };
        interface Color { r: number; g: number; b: number; };
        const hashmap = new Hashmap<Point,Color>();

        hashmap.set({x:2,y:3}, {r:0,g:0,b:0});
        hashmap.set({x:3,y:2}, {r:1,g:2,b:3});

        expect(hashmap.get({x:2,y:3})).toEqual({r:0,g:0,b:0});
        expect(hashmap.get({x:3,y:2})).toEqual({r:1,g:2,b:3});
    })
});