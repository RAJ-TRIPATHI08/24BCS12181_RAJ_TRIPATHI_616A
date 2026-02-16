#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    const int MAXN = 1000000;
    vector<long long> divisors(MAXN + 1, 0);

    // Precompute divisor counts
    for (long long i = 1; i <= MAXN; i++) {
        for (long long j = i; j <= MAXN; j += i) {
            divisors[j]++;
        }
    }

    long long n;
    cin >> n;
    while (n--) {
        long long x;
        cin >> x;
        cout << divisors[x] << "\n";
    }
    return 0;
}
