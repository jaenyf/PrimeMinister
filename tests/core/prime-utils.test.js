import { precomputePrimes, checkIsPrime } from "../../src/core/prime-utils.js";

describe("prime-utils", () => {
    it("detects primes correctly", () => {
        precomputePrimes(1, 20);
        expect(checkIsPrime(2)).toBe(true);
        expect(checkIsPrime(17)).toBe(true);
        expect(checkIsPrime(9)).toBe(false);
    });

    it("precomputes prime table", () => {
        precomputePrimes(1, 20);
        expect(checkIsPrime(19)).toBe(true);
        expect(checkIsPrime(20)).toBe(false);
    });
});
