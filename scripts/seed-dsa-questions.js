// scripts/seed-dsa-questions.js
// You can run this script manually or use it as a reference for adding questions

const admin = require('firebase-admin');
const serviceAccount = require('../config/mockai-51d75-firebase-adminsdk-fbsvc-27d7e63c96.json'); // Replace with your service account path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const dsaQuestions = [
  {
    title: "Two Sum",
    description: `<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
    <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
    <p>You can return the answer in any order.</p>`,
    difficulty: "easy",
    tags: ["Array", "Hash Table"],
    starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your code here
    
}`,
    testCases: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]"
      }
    ],
    solution: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
    createdAt: new Date().toISOString()
  },
  {
    title: "Valid Parentheses",
    description: `<p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p>
    <p>An input string is valid if:</p>
    <ol>
        <li>Open brackets must be closed by the same type of brackets.</li>
        <li>Open brackets must be closed in the correct order.</li>
        <li>Every close bracket has a corresponding open bracket of the same type.</li>
    </ol>`,
    difficulty: "easy",
    tags: ["Stack", "String"],
    starterCode: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    // Write your code here
    
}`,
    testCases: [
      {
        input: "s = '()'",
        output: "true"
      },
      {
        input: "s = '()[]{}'",
        output: "true"
      },
      {
        input: "s = '(]'",
        output: "false"
      }
    ],
    solution: `function isValid(s) {
    const stack = [];
    const map = {
        '(': ')',
        '[': ']',
        '{': '}'
    };
    
    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        
        if (map[char]) {
            stack.push(map[char]);
        } else {
            if (stack.pop() !== char) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}`,
    createdAt: new Date().toISOString()
  },
  {
    title: "Merge Intervals",
    description: `<p>Given an array of <code>intervals</code> where <code>intervals[i] = [start_i, end_i]</code>, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.</p>`,
    difficulty: "medium",
    tags: ["Array", "Sorting"],
    starterCode: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function merge(intervals) {
    // Write your code here
    
}`,
    testCases: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation: "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    solution: `function merge(intervals) {
    if (intervals.length <= 1) return intervals;
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    const result = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const last = result[result.length - 1];
        
        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        } else {
            result.push(current);
} else {
            result.push(current);
        }
    }
    
    return result;
}`,
    createdAt: new Date().toISOString()
  },
  {
    title: "LRU Cache",
    description: `<p>Design a data structure that follows the constraints of a <a href="https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU">Least Recently Used (LRU) cache</a>.</p>
    <p>Implement the <code>LRUCache</code> class:</p>
    <ul>
        <li><code>LRUCache(int capacity)</code> Initialize the LRU cache with positive size <code>capacity</code>.</li>
        <li><code>int get(int key)</code> Return the value of the <code>key</code> if the key exists, otherwise return <code>-1</code>.</li>
        <li><code>void put(int key, int value)</code> Update the value of the <code>key</code> if the <code>key</code> exists. Otherwise, add the <code>key-value</code> pair to the cache. If the number of keys exceeds the <code>capacity</code> from this operation, evict the least recently used key.</li>
    </ul>
    <p>The functions <code>get</code> and <code>put</code> must each run in <code>O(1)</code> average time complexity.</p>`,
    difficulty: "hard",
    tags: ["Hash Table", "Linked List", "Design"],
    starterCode: `/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
    // Initialize your data structure here
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    // Implement get operation
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    // Implement put operation
};`,
    testCases: [
      {
        input: `["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]`,
        output: `[null, null, null, 1, null, -1, null, -1, 3, 4]`,
        explanation: `LRUCache lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // cache is {1=1}
lRUCache.put(2, 2); // cache is {1=1, 2=2}
lRUCache.get(1);    // return 1
lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}
lRUCache.get(2);    // returns -1 (not found)
lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}
lRUCache.get(1);    // return -1 (not found)
lRUCache.get(3);    // return 3
lRUCache.get(4);    // return 4`
      }
    ],
    solution: `/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    if (!this.cache.has(key)) return -1;
    
    const value = this.cache.get(key);
    // Delete and re-insert to make it recently used
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    // If key exists, delete it (we'll add it fresh)
    if (this.cache.has(key)) {
        this.cache.delete(key);
    }
    // If at capacity, delete least recently used item
    else if (this.cache.size >= this.capacity) {
        // Get first key (least recently used)
        const lruKey = this.cache.keys().next().value;
        this.cache.delete(lruKey);
    }
    
    // Add new key-value pair
    this.cache.set(key, value);
};`,
    createdAt: new Date().toISOString()
  }
];

async function seedDSAQuestions() {
  try {
    for (const question of dsaQuestions) {
      await db.collection('dsaQuestions').add(question);
      console.log(`Added question: ${question.title}`);
    }
    console.log('DSA questions seeded successfully!');
  } catch (error) {
    console.error('Error seeding DSA questions:', error);
  }
}

seedDSAQuestions();