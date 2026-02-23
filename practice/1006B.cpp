#include <iostream>
#include <algorithm>
#include <map>
using namespace std;
int main()
{
    int n, k;
    cin >> n >> k;
    int a[n], b[n];
    for (int i = 0; i < n; i++)
    {
        cin >> a[i];
        b[i] = a[i];
    }
    sort(b, b + n);
    int sum = 0;
    map<int, int> profit;
    for (int i = n - 1; i >= n - k; i--)
    {
        sum += b[i];
        profit[b[i]]++;
    }
    cout << sum << endl;

    int lasti = -1;
    int c = k;
    for (int i = 0; i < n; i++)
    {
        if (c > 1 && profit[a[i]])
        {
            cout << (i - lasti) << " ";
            lasti = i;
            profit[a[i]]--;
            c--;
        }
    }
    cout << n - 1 - lasti;
}