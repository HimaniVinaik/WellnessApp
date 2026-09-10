// A curated bank of classic algorithm practice problems, in the spirit of
// what you'd find on any coding-interview practice site. There's no public
// API for pulling live problems from LeetCode (it requires auth for most
// content and blocks scraping), so this is an original, self-contained set
// that runs entirely client-side — every test case below has been verified
// against a reference solution.

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface TestCase {
  args: unknown[]
  expected: unknown
}

export interface CodingProblem {
  id: string
  title: string
  difficulty: Difficulty
  description: string
  functionName: string
  starterCode: string
  examples: { input: string; output: string }[]
  tests: TestCase[]
  points: number
}

const POINTS: Record<Difficulty, number> = { easy: 10, medium: 25, hard: 50 }

export const CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    description: 'Given an array of numbers and a target, return the indices of the two numbers that add up to the target.',
    functionName: 'twoSum',
    starterCode: 'function twoSum(nums, target) {\n  \n}',
    examples: [{ input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]' }],
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
      { args: [[1, 5, 3, 7], 10], expected: [2, 3] },
    ],
    points: POINTS.easy,
  },
  {
    id: 'reverse-string',
    title: 'Reverse a String',
    difficulty: 'easy',
    description: 'Return the input string reversed.',
    functionName: 'reverseString',
    starterCode: 'function reverseString(s) {\n  \n}',
    examples: [{ input: '"hello"', output: '"olleh"' }],
    tests: [
      { args: ['hello'], expected: 'olleh' },
      { args: [''], expected: '' },
      { args: ['a'], expected: 'a' },
      { args: ['Racecar'], expected: 'racecaR' },
    ],
    points: POINTS.easy,
  },
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz',
    difficulty: 'easy',
    description:
      'Return an array of strings for the numbers 1 to n. For multiples of 3 use "Fizz", multiples of 5 use "Buzz", multiples of both use "FizzBuzz", otherwise use the number itself as a string.',
    functionName: 'fizzBuzz',
    starterCode: 'function fizzBuzz(n) {\n  \n}',
    examples: [{ input: 'n = 5', output: '["1", "2", "Fizz", "4", "Buzz"]' }],
    tests: [
      { args: [5], expected: ['1', '2', 'Fizz', '4', 'Buzz'] },
      { args: [15], expected: ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz'] },
      { args: [1], expected: ['1'] },
      { args: [3], expected: ['1', '2', 'Fizz'] },
    ],
    points: POINTS.easy,
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    description: 'Given a string of brackets ()[]{}, return true if every bracket is properly opened and closed in the right order.',
    functionName: 'isValidParentheses',
    starterCode: 'function isValidParentheses(s) {\n  \n}',
    examples: [{ input: '"()[]{}"', output: 'true' }],
    tests: [
      { args: ['()'], expected: true },
      { args: ['()[]{}'], expected: true },
      { args: ['(]'], expected: false },
      { args: ['([)]'], expected: false },
      { args: ['{[]}'], expected: true },
      { args: [''], expected: true },
    ],
    points: POINTS.easy,
  },
  {
    id: 'is-palindrome',
    title: 'Palindrome Check',
    difficulty: 'easy',
    description: 'Return true if the string reads the same forwards and backwards, ignoring letter case.',
    functionName: 'isPalindrome',
    starterCode: 'function isPalindrome(s) {\n  \n}',
    examples: [{ input: '"racecar"', output: 'true' }],
    tests: [
      { args: ['racecar'], expected: true },
      { args: ['hello'], expected: false },
      { args: ['Level'], expected: true },
      { args: ['A'], expected: true },
      { args: [''], expected: true },
    ],
    points: POINTS.easy,
  },
  {
    id: 'is-anagram',
    title: 'Anagram Check',
    difficulty: 'easy',
    description: 'Return true if two strings are anagrams of each other (same letters, same counts), ignoring case.',
    functionName: 'isAnagram',
    starterCode: 'function isAnagram(a, b) {\n  \n}',
    examples: [{ input: '"listen", "silent"', output: 'true' }],
    tests: [
      { args: ['listen', 'silent'], expected: true },
      { args: ['hello', 'world'], expected: false },
      { args: ['aacc', 'ccac'], expected: false },
      { args: ['', ''], expected: true },
    ],
    points: POINTS.easy,
  },
  {
    id: 'count-vowels',
    title: 'Count Vowels',
    difficulty: 'easy',
    description: 'Count the number of vowels (a, e, i, o, u) in a string, case-insensitive.',
    functionName: 'countVowels',
    starterCode: 'function countVowels(s) {\n  \n}',
    examples: [{ input: '"Hello World"', output: '3' }],
    tests: [
      { args: ['Hello World'], expected: 3 },
      { args: ['xyz'], expected: 0 },
      { args: ['AEIOU'], expected: 5 },
      { args: [''], expected: 0 },
    ],
    points: POINTS.easy,
  },
  {
    id: 'sum-digits',
    title: 'Sum of Digits',
    difficulty: 'easy',
    description: 'Return the sum of the digits of a non-negative integer.',
    functionName: 'sumDigits',
    starterCode: 'function sumDigits(n) {\n  \n}',
    examples: [{ input: '1234', output: '10' }],
    tests: [
      { args: [1234], expected: 10 },
      { args: [0], expected: 0 },
      { args: [9], expected: 9 },
      { args: [100], expected: 1 },
    ],
    points: POINTS.easy,
  },
  {
    id: 'longest-word',
    title: 'Longest Word',
    difficulty: 'easy',
    description: 'Return the longest word in a sentence. If there is a tie, return the first one.',
    functionName: 'longestWord',
    starterCode: 'function longestWord(sentence) {\n  \n}',
    examples: [{ input: '"The quick brown fox"', output: '"quick"' }],
    tests: [
      { args: ['The quick brown fox'], expected: 'quick' },
      { args: ['I love programming'], expected: 'programming' },
      { args: ['a bb ccc'], expected: 'ccc' },
      { args: [''], expected: '' },
    ],
    points: POINTS.easy,
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Number',
    difficulty: 'easy',
    description: 'Return the nth Fibonacci number (0-indexed: fib(0) = 0, fib(1) = 1).',
    functionName: 'fibonacci',
    starterCode: 'function fibonacci(n) {\n  \n}',
    examples: [{ input: 'n = 10', output: '55' }],
    tests: [
      { args: [0], expected: 0 },
      { args: [1], expected: 1 },
      { args: [5], expected: 5 },
      { args: [10], expected: 55 },
    ],
    points: POINTS.easy,
  },
  {
    id: 'max-subarray',
    title: 'Maximum Subarray Sum',
    difficulty: 'medium',
    description: 'Given an array of numbers, return the largest possible sum of a contiguous subarray.',
    functionName: 'maxSubArray',
    starterCode: 'function maxSubArray(nums) {\n  \n}',
    examples: [{ input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6' }],
    tests: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 },
      { args: [[-1, -2, -3]], expected: -1 },
    ],
    points: POINTS.medium,
  },
  {
    id: 'first-duplicate',
    title: 'First Duplicate',
    difficulty: 'medium',
    description: 'Return the first value in the array whose second occurrence appears earliest when scanning left to right. Return -1 if there are no duplicates.',
    functionName: 'firstDuplicate',
    starterCode: 'function firstDuplicate(nums) {\n  \n}',
    examples: [{ input: '[2, 1, 3, 5, 3, 2]', output: '3' }],
    tests: [
      { args: [[2, 1, 3, 5, 3, 2]], expected: 3 },
      { args: [[1, 2, 3, 4]], expected: -1 },
      { args: [[1, 1]], expected: 1 },
      { args: [[1, 2, 3, 2, 1]], expected: 2 },
    ],
    points: POINTS.medium,
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'medium',
    description: 'Given a sorted array and a target, return the index of the target, or -1 if it is not present.',
    functionName: 'binarySearch',
    starterCode: 'function binarySearch(arr, target) {\n  \n}',
    examples: [{ input: '[1, 3, 5, 7, 9], target = 5', output: '2' }],
    tests: [
      { args: [[1, 3, 5, 7, 9], 5], expected: 2 },
      { args: [[1, 3, 5, 7, 9], 2], expected: -1 },
      { args: [[1], 1], expected: 0 },
      { args: [[], 5], expected: -1 },
      { args: [[2, 4, 6, 8, 10, 12], 12], expected: 5 },
    ],
    points: POINTS.medium,
  },
  {
    id: 'merge-sorted',
    title: 'Merge Two Sorted Arrays',
    difficulty: 'medium',
    description: 'Given two arrays already sorted ascending, merge them into a single sorted array.',
    functionName: 'mergeSorted',
    starterCode: 'function mergeSorted(a, b) {\n  \n}',
    examples: [{ input: '[1, 3, 5], [2, 4, 6]', output: '[1, 2, 3, 4, 5, 6]' }],
    tests: [
      { args: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6] },
      { args: [[], [1, 2]], expected: [1, 2] },
      { args: [[1, 2], []], expected: [1, 2] },
      { args: [[1, 1, 1], [1, 1]], expected: [1, 1, 1, 1, 1] },
    ],
    points: POINTS.medium,
  },
  {
    id: 'longest-unique-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'hard',
    description: 'Return the length of the longest substring that has no repeated characters.',
    functionName: 'longestUniqueSubstring',
    starterCode: 'function longestUniqueSubstring(s) {\n  \n}',
    examples: [{ input: '"abcabcbb"', output: '3' }],
    tests: [
      { args: ['abcabcbb'], expected: 3 },
      { args: ['bbbbb'], expected: 1 },
      { args: ['pwwkew'], expected: 3 },
      { args: [''], expected: 0 },
      { args: ['abcdef'], expected: 6 },
    ],
    points: POINTS.hard,
  },
]
