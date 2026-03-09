#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int numSubarrayProductLessThanK(vector<int>& nums, int k) {
        int left = 0;
        int count = 0;
        int right = 0;
        int product = 1;
        int n =nums.size();
        while(right<n){
            product*=nums[right];
            while(product>=k && left<=right){
                product/=nums[left];
                left++;
            }
            count+= right-left+1;
            right++;
        }
        return count;
    }
};