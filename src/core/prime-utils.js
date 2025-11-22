const primeCache = new Map();

function _isPrime(num) {
    if (num < 2) return num === 1;
    for (let i = 2; i <= Math.sqrt(num); i++)
        if (num % i === 0) return false;
    return true;
}

export function precomputePrimes(start, end) {
    for (let i = start; i <= end; i++)
        if (!primeCache.has(i))
            primeCache.set(i, _isPrime(i));
}

export function checkIsPrime(n) {
    return primeCache.get(n) || false;
}

// return the prime factors of a given number
// the result format is as following:
// [{value, power}]
export function getPrimesFactors(n) {

    if (!n) {
        return [{ value: 0, power: 1 }];
    }
    if (n == 1) {
        return [{ value: 1, power: 1 }];
    }

    let primeFactors = [];

    // Check for number of 2s that divide n
    let powerOfTwo = 0;
    while (n % 2 === 0) {
        powerOfTwo++;
        n = n / 2;
    }
    if (powerOfTwo > 0) {
        primeFactors.push({ value: 2, power: powerOfTwo });
    }

    // n must be odd at this point, so a skip of 2 is possible
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        let power = 0;
        // While i divides n, increment power and divide n
        while (n % i === 0) {
            power++;
            n = n / i;
        }
        if (power > 0) {
            primeFactors.push({ value: i, power: power });
        }
    }

    // If n is a prime number greater than 2
    if (n > 2) {
        primeFactors.push({ value: n, power: 1 });
    }

    return primeFactors;
}
