#include<bits/stdc++.h>
using namespace std;

class Solution {
public:
    typedef long long ll;
    int minSubarray(vector<int>& nums, int p) {
        int n = nums.size();
        ll preSum = 0;
        for(int x:nums)
            preSum += x;
        int remainder = preSum % p;
        if(remainder == 0)
            return 0;
        int minL = n;
        preSum = 0;
        unordered_map<int, int> preMod;
        preMod[0] = -1;
        for(int i = 0; i < n; i++){
            preSum += nums[i];
            int currMod = preSum % p;
            int targetMod = (currMod - remainder + p) % p;

            if(preMod.find(targetMod) != preMod.end())
            {
                minL = min(minL, i - preMod[targetMod]);
            }
            preMod[currMod] = i;
        }
        if(minL == n){
            return -1;
        }
        return minL;
    }
};