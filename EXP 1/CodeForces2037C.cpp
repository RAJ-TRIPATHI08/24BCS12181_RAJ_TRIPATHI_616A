#include <bits/stdc++.h>
using namespace std;

void preCompute(vector<long long> &divArr)
{
      for (long long i = 1; i < 1e6 + 1; i++)
      {
            for (long long j = i; j < 1e6 + 1; j += i)
            {
                  divArr[j]++;
            }
      }
}
int main()
{
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      vector<long long> divArr(1e6 + 2);
      preCompute(divArr);
      int t;
      cin >> t;
      while (t--)
      {
            int n;
            cin >> n;
            if (n < 5)
            {
                  cout << -1 << endl;
                  continue;
            }
            vector<int> arr(n);
            for (int i = 0; i < n; i++)
                  arr[i] = i + 1;

            int leftptr = 1;
            int rightptr = n - 1;

            vector<int> ans(n);
            ans[0] = arr[0];

            int ptr = 0;
            bool flag = false;

            while (leftptr <= rightptr)
            {
                  if (divArr[ans[ptr] + arr[leftptr]] > 2)
                  {
                        ans[++ptr] = arr[leftptr];
                        leftptr++;
                  }
                  else if (divArr[ans[ptr] + arr[rightptr]] > 2)
                  {
                        ans[++ptr] = arr[rightptr];
                        rightptr--;
                  }
                  else
                  {
                        cout << -1;
                        flag = true;
                        break;
                  }
            }

            if (!flag)
            {
                  for (int i = 0; i < n; i++)
                  {
                        cout << ans[i] << " ";
                  }
            }
            cout << endl;
      }
      return 0;
}