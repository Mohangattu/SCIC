import { Assessment, CodingChallenge } from '../types';

export const COMPREHENSIVE_ASSESSMENTS: Assessment[] = [
  {
    id: 'assess-dsa',
    title: 'Data Structures & Algorithms Diagnostic',
    category: 'CS Fundamentals',
    skill: 'Data Structures & Algorithms',
    subject: 'Data Structures & Algorithms',
    description:
      'Standard technical evaluation covering basic array manipulations, linear/non-linear data structures, and advanced dynamic programming with complexity proofs.',
    durationMinutes: 25,
    totalMarks: 50,
    passingMarks: 32,
    questions: [
      {
        id: 'dsa-q1',
        category: 'DSA',
        difficulty: 'Easy',
        subject: 'Complexity Analysis',
        question:
          'What is the worst-case and best-case time complexity of standard Binary Search on a sorted array of size n?',
        options: [
          'Worst: O(n), Best: O(1)',
          'Worst: O(log n), Best: O(1)',
          'Worst: O(n log n), Best: O(log n)',
          'Worst: O(log n), Best: O(log n)',
        ],
        correctIndex: 1,
        explanation:
          'Binary search divides the search interval in half every iteration, resulting in O(log n) worst-case comparisons. The best-case occurs when the target is at the exact middle element on the first check, giving O(1).',
      },
      {
        id: 'dsa-q2',
        category: 'DSA',
        difficulty: 'Easy',
        subject: 'Arrays & Two Pointers',
        question: 'Which of the following operations takes O(1) time in an array?',
        options: [
          'Accessing an element at index i given its base address',
          'Inserting an element at the beginning of an unsorted array of size n',
          'Searching for an arbitrary element in an unsorted array',
          'Deleting an element from the middle of the array while maintaining order',
        ],
        correctIndex: 0,
        explanation:
          'Arrays have contiguous memory allocation; the memory address of index i is calculated directly via Address = Base + (i * element_size) in constant time O(1).',
      },
      {
        id: 'dsa-q3',
        category: 'DSA',
        difficulty: 'Medium',
        subject: 'Trees & Heaps',
        question:
          'Consider a Max-Heap containing n elements. What is the time complexity to insert a new element, and what is the time complexity to build a Max-Heap from an arbitrary array?',
        options: [
          'Insertion: O(1), Build Heap: O(n log n)',
          'Insertion: O(log n), Build Heap: O(n)',
          'Insertion: O(log n), Build Heap: O(n log n)',
          'Insertion: O(n), Build Heap: O(n)',
        ],
        correctIndex: 1,
        explanation:
          'Inserting a new element into a binary heap involves placing it at the bottom and bubbling up (sift-up), which takes O(log n) time. Building a heap from an unordered array using Floyd’s bottom-up heapify algorithm takes linear time O(n) because nodes near the leaves have smaller heights.',
      },
      {
        id: 'dsa-q4',
        category: 'DSA',
        difficulty: 'Medium',
        subject: 'Graphs',
        question:
          'What will be the output behavior when running Dijkstra’s Algorithm on a directed graph that contains negative-weight edges?',
        options: [
          'It always detects the negative edge and throws a runtime exception',
          'It may produce incorrect shortest path distances because it greedily marks vertices as finalized',
          'It correctly computes all shortest paths as long as there is no negative-weight cycle',
          'It runs in exponential O(2^V) time instead of O((V + E) log V)',
        ],
        correctIndex: 1,
        explanation:
          'Dijkstra’s algorithm assumes that adding an edge to a path can never decrease the path length (monotonicity property). Negative edges violate this greedy invariant, requiring the Bellman-Ford algorithm (O(V * E)) instead.',
      },
      {
        id: 'dsa-q5',
        category: 'DSA',
        difficulty: 'Hard',
        subject: 'Dynamic Programming',
        question:
          'In the 0/1 Knapsack Problem with capacity W and N items, what is the exact time and space complexity of the standard bottom-up dynamic programming approach, and how can space be optimized?',
        options: [
          'Time: O(2^N), Space: O(N); cannot be optimized',
          'Time: O(N * W), Space: O(N * W); space can be optimized to O(W) using a 1D array traversed backwards',
          'Time: O(N log W), Space: O(W); space can be reduced to O(1)',
          'Time: O(N * W), Space: O(N + W); space can only be reduced to O(N)',
        ],
        correctIndex: 1,
        explanation:
          'The state dp[i][w] depends only on the previous row dp[i-1]. By iterating capacity w backwards from W down to weight[i], we can update a single 1D array of size W without overwriting values needed for the current iteration.',
      },
      {
        id: 'dsa-q6',
        category: 'DSA',
        difficulty: 'Hard',
        subject: 'String Algorithms & Tries',
        codeSnippet: `// Trie Node Search Function
boolean search(TrieNode root, String word) {
    TrieNode curr = root;
    for (char c : word.toCharArray()) {
        int idx = c - 'a';
        if (curr.children[idx] == null) return false;
        curr = curr.children[idx];
    }
    return curr.isEndOfWord;
}`,
        question:
          'Given the Trie search snippet above, what is the search time complexity for a query string of length m across a dictionary of N words, and what is the trade-off compared to a Hash Table?',
        options: [
          'Time: O(N * m); Tries consume less memory than Hash Tables',
          'Time: O(m); Tries provide guaranteed O(m) lookup with prefix search capability, but suffer higher memory overhead due to empty child pointers',
          'Time: O(log N); Tries cannot handle prefix queries',
          'Time: O(m^2); Hash Tables are always preferred for auto-complete',
        ],
        correctIndex: 1,
        explanation:
          'Trie lookups depend strictly on key length m (O(m)) independent of dictionary size N. Unlike Hash Tables, Tries support prefix matching (auto-complete) and ordered traversals, but node pointer overhead is significant.',
      },
    ],
  },
  {
    id: 'assess-core-cs',
    title: 'Operating Systems & Computer Networks Core',
    category: 'CS Fundamentals',
    skill: 'Operating Systems',
    subject: 'Core Systems (OS & CN)',
    description:
      'Rigorous examination of process synchronization, virtual memory paging, deadlock detection, TCP/IP flow control, and network protocols.',
    durationMinutes: 20,
    totalMarks: 40,
    passingMarks: 26,
    questions: [
      {
        id: 'os-q1',
        category: 'Operating Systems',
        difficulty: 'Easy',
        subject: 'Process Management',
        question: 'What is the primary difference between a Process and a Thread in modern operating systems?',
        options: [
          'Threads have independent virtual memory address spaces, while processes share heap memory',
          'A process is an executing program with its own address space, whereas threads within a process share the same code, data, and heap segments but have distinct registers and stacks',
          'Threads cannot be scheduled concurrently by the kernel',
          'Processes do not require Context Switching overhead',
        ],
        correctIndex: 1,
        explanation:
          'Processes provide isolation with separate memory maps. Threads are lightweight execution units that share the parent process’s memory space and file descriptors, with private program counters and stack frames.',
      },
      {
        id: 'os-q2',
        category: 'Computer Networks',
        difficulty: 'Easy',
        subject: 'Transport Layer',
        question:
          'Why does TCP establish a connection using a 3-way handshake (SYN, SYN-ACK, ACK) instead of a 2-way handshake?',
        options: [
          'To encrypt the payload using symmetric keys',
          'To ensure both client and server mutually synchronize initial sequence numbers (ISNs) and prevent delayed duplicate connection requests from causing false half-open connections',
          'Because routers in intermediate networks reject 2-way handshakes',
          'To negotiate DNS hostnames before sending data',
        ],
        correctIndex: 1,
        explanation:
          'The 3-way handshake guarantees bidirectional agreement on initial sequence numbers (ISNs) and prevents stale, delayed SYN packets from former terminated sessions from creating ghost sessions.',
      },
      {
        id: 'os-q3',
        category: 'Operating Systems',
        difficulty: 'Medium',
        subject: 'Deadlocks',
        question:
          'Which of the following are the four necessary and sufficient conditions for a deadlock (Coffman conditions)?',
        options: [
          'Starvation, Race Condition, Busy Waiting, Spinlocks',
          'Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait',
          'Aging, Paging, Fragmentation, Segmentation',
          'Atomicity, Consistency, Isolation, Durability',
        ],
        correctIndex: 1,
        explanation:
          'Coffman conditions: 1) Mutual Exclusion (resources cannot be shared), 2) Hold & Wait (process holding resource requests more), 3) No Preemption (resources cannot be forcibly taken), 4) Circular Wait (closed loop of waiting).',
      },
      {
        id: 'os-q4',
        category: 'Computer Networks',
        difficulty: 'Medium',
        subject: 'Flow & Congestion Control',
        question:
          'In TCP Congestion Control, what happens when a packet loss is detected via 3 Duplicate ACKs (Fast Retransmit) versus when a Retransmission Timeout (RTO) occurs?',
        options: [
          'Both reset Congestion Window (cwnd) to 1 MSS immediately',
          '3 Duplicate ACKs triggers Fast Recovery (cwnd halved, grows linearly), whereas an RTO timeout resets cwnd to 1 MSS and re-enters Slow Start',
          'RTO doubles the window, whereas 3 Dup ACKs terminates the socket',
          'Neither alters the congestion window',
        ],
        correctIndex: 1,
        explanation:
          '3 Dup ACKs indicates packets are still flowing through the network (duplicate ACKs are arriving), so TCP halves cwnd (Fast Recovery). An RTO timeout signifies total packet stall, so TCP defensively resets cwnd to 1 MSS (Slow Start).',
      },
      {
        id: 'os-q5',
        category: 'Operating Systems',
        difficulty: 'Hard',
        subject: 'Memory Management',
        question:
          'In a 32-bit virtual memory system with 4 KB page size, if a process uses a two-level paging scheme where Page Table entries are 4 bytes each, how is the 32-bit virtual address divided?',
        options: [
          '10 bits Outer Page Table, 10 bits Inner Page Table, 12 bits Page Offset',
          '16 bits Page Directory, 8 bits Page Table, 8 bits Offset',
          '12 bits Outer, 10 bits Inner, 10 bits Offset',
          '8 bits Outer, 12 bits Inner, 12 bits Offset',
        ],
        correctIndex: 0,
        explanation:
          '4 KB page size requires log2(4096) = 12 bits for offset. A page holds 4096 / 4 = 1024 entries = 2^10 entries (10 bits for inner page table). The remaining 32 - 12 - 10 = 10 bits are used for the outer page directory (10-10-12 scheme).',
      },
    ],
  },
  {
    id: 'assess-dbms',
    title: 'Database Systems & SQL Performance Engineering',
    category: 'Databases',
    skill: 'SQL',
    subject: 'DBMS & Query Optimization',
    description:
      'Tests relational normalization (3NF/BCNF), transaction isolation levels (Read Committed vs Serializable), B-Tree vs Hash index planning, and complex SQL joins.',
    durationMinutes: 20,
    totalMarks: 40,
    passingMarks: 26,
    questions: [
      {
        id: 'dbms-q1',
        category: 'Databases',
        difficulty: 'Easy',
        subject: 'Relational Model',
        question:
          'Which relational normalization form specifically guarantees that all non-key attributes are fully functionally dependent on the entire primary key (eliminating partial dependencies)?',
        options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
        correctIndex: 1,
        explanation:
          '2NF requires the relation to be in 1NF and eliminates partial key dependencies (every non-prime attribute must depend on the whole composite candidate key). 3NF eliminates transitive dependencies.',
      },
      {
        id: 'dbms-q2',
        category: 'Databases',
        difficulty: 'Easy',
        subject: 'SQL Aggregations',
        codeSnippet: `SELECT department_id, COUNT(*) AS total_students
FROM students
WHERE cgpa >= 7.5
GROUP BY department_id
HAVING COUNT(*) > 10;`,
        question: 'In the SQL query above, what is the precise order of clause evaluation executed by the RDBMS engine?',
        options: [
          'SELECT -> FROM -> WHERE -> GROUP BY -> HAVING',
          'FROM -> WHERE -> GROUP BY -> HAVING -> SELECT',
          'WHERE -> FROM -> GROUP BY -> SELECT -> HAVING',
          'FROM -> GROUP BY -> WHERE -> HAVING -> SELECT',
        ],
        correctIndex: 1,
        explanation:
          'SQL logical query execution order: 1) FROM (table identification), 2) WHERE (row filtering), 3) GROUP BY (grouping), 4) HAVING (group filtering), 5) SELECT (projection), 6) ORDER BY.',
      },
      {
        id: 'dbms-q3',
        category: 'Databases',
        difficulty: 'Medium',
        subject: 'Transactions & ACID',
        question:
          'Under the "Repeatable Read" transaction isolation level, which concurrency anomaly can still theoretically occur in standard ANSI SQL databases?',
        options: [
          'Dirty Reads (reading uncommitted data)',
          'Non-Repeatable Reads (row modified by another transaction)',
          'Phantom Reads (new rows inserted matching range criteria by concurrent transactions)',
          'Lost Updates',
        ],
        correctIndex: 2,
        explanation:
          'Repeatable Read locks existing rows read by the transaction, preventing dirty and non-repeatable reads. However, without predicate/range locking (Serializable level), concurrent transactions can insert new rows that match the query range (Phantom Reads).',
      },
      {
        id: 'dbms-q4',
        category: 'Databases',
        difficulty: 'Medium',
        subject: 'Indexing & B-Trees',
        question:
          'Why are B+ Trees predominantly preferred over B-Trees and Hash Tables for database indexing in relational database engines like PostgreSQL and MySQL InnoDB?',
        options: [
          'B+ Trees store records in random hash buckets for O(1) lookups',
          'In B+ Trees, non-leaf nodes store only keys (fitting more keys per disk block) and all data records reside in leaf nodes linked sequentially, optimizing range scans',
          'B+ Trees completely eliminate index write overhead',
          'B+ Trees only work in in-memory databases',
        ],
        correctIndex: 1,
        explanation:
          'B+ Trees have higher fan-out (lower tree depth, fewer disk I/O reads) because internal nodes do not store payload records. Furthermore, leaf nodes are linked via a doubly linked list, making ORDER BY and range scans (BETWEEN, >=) extremely fast.',
      },
      {
        id: 'dbms-q5',
        category: 'Databases',
        difficulty: 'Hard',
        subject: 'Query Plan Optimization',
        codeSnippet: `EXPLAIN ANALYZE
SELECT e.name, d.dept_name
FROM employees e
JOIN departments d ON e.dept_id = d.id
WHERE e.salary > 80000;`,
        question:
          'If the execution plan displays "Seq Scan on employees (cost=0.00..1845.20) Filter: (salary > 80000) Rows Removed by Filter: 98000", which action will most effectively eliminate the full table scan?',
        options: [
          'Create a composite index on (dept_id, salary) or a filtered index on (salary) WHERE salary > 80000',
          'Add ORDER BY e.id ASC to the query',
          'Change INNER JOIN to a FULL OUTER JOIN',
          'Disable foreign key constraints on departments',
        ],
        correctIndex: 0,
        explanation:
          'The sequential scan reveals that 98,000 out of 100,000 rows were scanned and discarded. A B-Tree index on salary (or a composite index on dept_id, salary) allows the optimizer to perform an Index Scan or Bitmap Index Scan, reducing disk I/O by orders of magnitude.',
      },
    ],
  },
  {
    id: 'assess-web-fullstack',
    title: 'Modern Full Stack & API Architecture',
    category: 'Web Development',
    skill: 'React',
    subject: 'Web Engineering & REST APIs',
    description:
      'Tests React component reconciliation, JavaScript Event Loop & Microtasks, state management, REST idempotency, and Web Security (JWT, CORS, CSRF).',
    durationMinutes: 20,
    totalMarks: 40,
    passingMarks: 26,
    questions: [
      {
        id: 'web-q1',
        category: 'Web Development',
        difficulty: 'Easy',
        subject: 'JavaScript Asynchronous Mechanics',
        codeSnippet: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
        question: 'What is the exact execution log printed to the console?',
        options: ['1, 2, 3, 4', '1, 4, 3, 2', '1, 4, 2, 3', '1, 3, 4, 2'],
        correctIndex: 1,
        explanation:
          '1 and 4 are logged synchronously. The Promise callback enters the Microtask Queue. setTimeout enters the Macrotask Queue. The Event Loop prioritizes the Microtask Queue before Macrotasks, resulting in: 1, 4, 3, 2.',
      },
      {
        id: 'web-q2',
        category: 'Web Development',
        difficulty: 'Medium',
        subject: 'React Reconciliation & Hooks',
        question: 'What causes the "closure stale state" bug in React hooks, and how is it resolved?',
        options: [
          'Calling useState inside a loop; resolved by using class components',
          'A hook callback captures variables from an earlier render cycle due to JavaScript lexical scoping; resolved by passing dependencies to the dependency array or using functional state updates (setVal(prev => prev + 1))',
          'Server-side rendering mismatch; resolved by disabling strict mode',
          'Exceeding maximum component tree depth',
        ],
        correctIndex: 1,
        explanation:
          'Closures capture state references at the time of creation. If an asynchronous callback (such as setInterval or event listener) references state without proper dependency inclusion or functional state updates, it reads outdated render closure values.',
      },
      {
        id: 'web-q3',
        category: 'Backend Development',
        difficulty: 'Medium',
        subject: 'RESTful API Design',
        question: 'Which of the following HTTP methods is defined as IDEMPOTENT by RFC 7231 standards?',
        options: [
          'POST only',
          'PUT and DELETE (multiple identical requests have the same intended effect on server state as a single request)',
          'POST and PATCH',
          'None; all HTTP methods mutate state differently on each invocation',
        ],
        correctIndex: 1,
        explanation:
          'An idempotent method can be executed multiple times without altering the final server state beyond the initial call. GET, HEAD, PUT, and DELETE are idempotent. POST and PATCH are not inherently idempotent.',
      },
      {
        id: 'web-q4',
        category: 'Web Development',
        difficulty: 'Hard',
        subject: 'Web Security (Tokens & Storage)',
        question:
          'Where is the most secure place to store authentication JWTs in a Single-Page Application (SPA) to prevent Cross-Site Scripting (XSS) token theft?',
        options: [
          'localStorage, because it persists across browser tab closes',
          'sessionStorage, because it expires when the tab is closed',
          'In an HTTP-Only, Secure, SameSite=Strict cookie, because JavaScript running in the browser cannot read HTTP-Only cookies',
          'In the Redux store global window variable',
        ],
        correctIndex: 2,
        explanation:
          'Tokens placed in localStorage or sessionStorage are accessible to any injected JavaScript (XSS vulnerability). Storing the token in an HTTP-Only cookie ensures the browser transmits it automatically with requests while completely denying script read access.',
      },
    ],
  },
  {
    id: 'assess-oop-java',
    title: 'Object-Oriented Programming & Core Java Architecture',
    category: 'Programming',
    skill: 'Java',
    subject: 'Core OOP & Java Design',
    description:
      'Evaluates core OOP principles (Polymorphism, Abstraction, Encapsulation), JVM memory lifecycle (Heap vs Stack, Garbage Collection), and multithreading.',
    durationMinutes: 20,
    totalMarks: 40,
    passingMarks: 26,
    questions: [
      {
        id: 'oop-q1',
        category: 'Programming',
        difficulty: 'Easy',
        subject: 'OOP Principles',
        question:
          'Which core object-oriented principle is demonstrated when multiple methods have the same name but different parameter signatures within the same class?',
        options: [
          'Runtime Polymorphism (Method Overriding)',
          'Compile-Time Polymorphism (Method Overloading)',
          'Multiple Inheritance',
          'Encapsulation via access mutators',
        ],
        correctIndex: 1,
        explanation:
          'Method overloading resolves at compile time based on parameter types and count (static polymorphism). Method overriding happens at runtime via dynamic dispatch (virtual table lookup).',
      },
      {
        id: 'oop-q2',
        category: 'Programming',
        difficulty: 'Easy',
        subject: 'Java Fundamentals',
        codeSnippet: `String s1 = "GMRIT";
String s2 = "GMRIT";
String s3 = new String("GMRIT");
System.out.println((s1 == s2) + " " + (s1 == s3) + " " + s1.equals(s3));`,
        question: 'What is the exact output printed by the Java code snippet above?',
        options: [
          'true true true',
          'true false true',
          'false false true',
          'true false false',
        ],
        correctIndex: 1,
        explanation:
          's1 and s2 both point to the identical literal stored in the String Constant Pool, so s1 == s2 evaluates to true. s3 is explicitly instantiated on the Heap with "new", so reference equality (==) is false, but content equality (.equals) is true.',
      },
      {
        id: 'oop-q3',
        category: 'Programming',
        difficulty: 'Medium',
        subject: 'Memory Management',
        question:
          'In the JVM memory architecture, where are local primitive variables, object references, and the actual instantiated objects stored?',
        options: [
          'All are stored uniformly in the Method Area / Metaspace',
          'Local primitives and references are stored on the Thread Stack frame; actual object instances reside on the Shared Heap',
          'Local variables reside on the Heap; object instances reside on the Stack',
          'Stack stores all data; Heap is only used for class metadata',
        ],
        correctIndex: 1,
        explanation:
          'Each executing thread has its own Stack with stack frames containing local variables and object pointers. All object allocations (via new) are allocated on the shared Garbage Collected Heap.',
      },
      {
        id: 'oop-q4',
        category: 'Programming',
        difficulty: 'Medium',
        subject: 'Interface vs Abstract Class',
        question:
          'How does modern Java (Java 8+) solve the Multiple Inheritance "Diamond Problem" with default methods in interfaces?',
        options: [
          'Interfaces cannot contain any default method implementations',
          'If two interfaces provide default methods with the exact same signature, the implementing class MUST explicitly override the method or call InterfaceName.super.method() to resolve ambiguity',
          'The JVM picks the method from whichever interface was declared first in the implements clause alphabetically',
          'It throws an unchecked ClassCastException at runtime',
        ],
        correctIndex: 1,
        explanation:
          'Java compiler enforces that when a class implements two interfaces with colliding default method signatures, the compiler throws an error unless the implementing class overrides the method and explicitly designates which implementation to use.',
      },
      {
        id: 'oop-q5',
        category: 'Programming',
        difficulty: 'Hard',
        subject: 'Concurrency & Thread Safety',
        codeSnippet: `public class Counter {
    private volatile int count = 0;
    public void increment() {
        count++;
    }
}`,
        question:
          'Is the Counter class above thread-safe for concurrent invocations by multiple threads, and why?',
        options: [
          'Yes, because volatile guarantees both visibility and atomicity across all CPU cores',
          'No, because the count++ operation is a composite read-modify-write operation (3 CPU instructions), and volatile only guarantees visibility, not atomicity; race conditions will occur without synchronized or AtomicInteger',
          'Yes, because Java integers are primitive types and primitives are naturally atomic',
          'No, volatile variables can only be read, never incremented',
        ],
        correctIndex: 1,
        explanation:
          'volatile ensures any write to count is immediately written through to main memory and visible to other threads. However, count++ consists of 1) reading count, 2) incrementing, 3) writing back. Two threads can interleave these 3 instructions, causing lost updates. AtomicInteger.incrementAndGet() or synchronization is required.',
      },
    ],
  },
];

export const COMPREHENSIVE_CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: 'code-palindrome',
    title: 'Valid Palindrome with Alphanumeric Normalization',
    subject: 'Core CS',
    difficulty: 'Easy',
    category: 'Programming',
    timeLimitMinutes: 15,
    description:
      'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.',
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters',
      'Target time complexity: O(n), Space complexity: O(1)',
    ],
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 's = "race a car"',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.',
      },
      {
        input: 's = " "',
        output: 'true',
        explanation: 's is an empty string "" after removing non-alphanumerics, which reads the same backward and forward.',
      },
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0, right = cleaned.length - 1;
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) return false;
        left++;
        right--;
    }
    return true;
}`,
      python: `def is_palindrome(s: str) -> bool:
    cleaned = ''.join(ch.lower() for ch in s if ch.isalnum())
    return cleaned == cleaned[::-1]`,
    },
    solutionTemplate: `function solve(input) {
    const { s } = input;
    const cleaned = String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0, right = cleaned.length - 1;
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) return false;
        left++;
        right--;
    }
    return true;
}`,
    testCases: [
      { id: 'tc1', input: JSON.stringify({ s: 'A man, a plan, a canal: Panama' }), expectedOutput: 'true', description: 'Classic sentence with punctuation' },
      { id: 'tc2', input: JSON.stringify({ s: 'race a car' }), expectedOutput: 'false', description: 'Non-palindrome phrase' },
      { id: 'tc3', input: JSON.stringify({ s: ' ' }), expectedOutput: 'true', description: 'Empty or whitespace string' },
      { id: 'tc4', input: JSON.stringify({ s: '0P' }), expectedOutput: 'false', isHidden: true, description: 'Alpha vs Numeric mismatch' },
    ],
    hints: [
      'Two pointers moving from left and right inward make this an optimal O(n) check.',
      'Remember to normalize characters to lowercase and ignore spaces/symbols.',
    ],
  },
  {
    id: 'code-missing-number',
    title: 'Find Missing Number in Contiguous Sequence [0..n]',
    subject: 'Data Structures',
    difficulty: 'Easy',
    category: 'Programming',
    timeLimitMinutes: 15,
    description:
      'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.\n\nCan you implement a solution using O(1) extra space complexity and O(n) runtime complexity?',
    constraints: [
      'n == nums.length',
      '1 <= n <= 10^4',
      '0 <= nums[i] <= n',
      'All the numbers of nums are unique',
    ],
    examples: [
      {
        input: 'nums = [3, 0, 1]',
        output: '2',
        explanation: 'n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number in the range since it does not appear in nums.',
      },
      {
        input: 'nums = [0, 1]',
        output: '2',
        explanation: 'n = 2 since there are 2 numbers, so all numbers are in the range [0,2]. 2 is the missing number in the range.',
      },
      {
        input: 'nums = [9,6,4,2,3,5,7,0,1]',
        output: '8',
        explanation: 'n = 9, 8 is the missing number in the range [0,9].',
      },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function missingNumber(nums) {
    const n = nums.length;
    const expectedSum = (n * (n + 1)) / 2;
    const actualSum = nums.reduce((acc, curr) => acc + curr, 0);
    return expectedSum - actualSum;
}`,
      python: `def missing_number(nums: list[int]) -> int:
    n = len(nums)
    expected_sum = (n * (n + 1)) // 2
    return expected_sum - sum(nums)`,
    },
    solutionTemplate: `function solve(input) {
    const { nums } = input;
    const n = nums.length;
    const expectedSum = (n * (n + 1)) / 2;
    const actualSum = nums.reduce((acc, curr) => acc + curr, 0);
    return expectedSum - actualSum;
}`,
    testCases: [
      { id: 'tc1', input: JSON.stringify({ nums: [3, 0, 1] }), expectedOutput: '2', description: 'Unsorted 3 elements' },
      { id: 'tc2', input: JSON.stringify({ nums: [0, 1] }), expectedOutput: '2', description: 'Missing highest element n' },
      { id: 'tc3', input: JSON.stringify({ nums: [9,6,4,2,3,5,7,0,1] }), expectedOutput: '8', description: 'Sequence up to 9' },
      { id: 'tc4', input: JSON.stringify({ nums: [1] }), expectedOutput: '0', isHidden: true, description: 'Missing 0 edge case' },
    ],
    hints: [
      'The sum of first n natural numbers is Gauss formula n * (n + 1) / 2.',
      'Alternatively, XORing all numbers from 0 to n with array elements cancels duplicates in O(1) space.',
    ],
  },
  {
    id: 'code-two-sum',
    title: 'Two Sum Target Pair Finder',
    subject: 'Data Structures',
    difficulty: 'Easy',
    category: 'Programming',
    timeLimitMinutes: 15,
    description:
      'Given an array of integers `nums` and an integer `target`, write an efficient function to return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input will have exactly one solution, and you may not use the same element twice. You must return an array of two indices [i, j].',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists',
      'Target time complexity: O(n), Space complexity: O(n)',
    ],
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2].',
      },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your solution here
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
      python: `def two_sum(nums, target):
    # Write your solution here
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    },
    solutionTemplate: `function solve(input) {
    const { nums, target } = input;
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) return [map.get(diff), i];
        map.set(nums[i], i);
    }
    return [];
}`,
    testCases: [
      { id: 'tc1', input: JSON.stringify({ nums: [2, 7, 11, 15], target: 9 }), expectedOutput: '[0,1]', description: 'Basic positive numbers' },
      { id: 'tc2', input: JSON.stringify({ nums: [3, 2, 4], target: 6 }), expectedOutput: '[1,2]', description: 'Non-adjacent elements' },
      { id: 'tc3', input: JSON.stringify({ nums: [3, 3], target: 6 }), expectedOutput: '[0,1]', description: 'Duplicate elements' },
      { id: 'tc4', input: JSON.stringify({ nums: [-1, -2, -3, -4, -5], target: -8 }), expectedOutput: '[2,4]', isHidden: true, description: 'Negative values' },
    ],
    hints: [
      'Can you solve this in a single pass instead of brute force O(n^2)?',
      'Use a Hash Map to record the complement (target - current) as you iterate.',
    ],
  },
  {
    id: 'code-valid-parentheses',
    title: 'Valid Parentheses & Syntax Balance',
    subject: 'Core CS',
    difficulty: 'Easy',
    category: 'CS Fundamentals',
    timeLimitMinutes: 15,
    description:
      'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only: ()[]{}',
      'Target time complexity: O(n), Space complexity: O(n)',
    ],
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false', explanation: 'Round open bracket is closed by a square bracket.' },
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (const char of s) {
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else if (map[char]) {
            if (stack.pop() !== map[char]) return false;
        }
    }
    return stack.length === 0;
}`,
      python: `def is_valid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping.values():
            stack.append(char)
        elif char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
    return len(stack) == 0`,
    },
    solutionTemplate: `function solve(input) {
    const { s } = input;
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (const ch of s) {
        if (ch === '(' || ch === '{' || ch === '[') stack.push(ch);
        else if (stack.pop() !== map[ch]) return false;
    }
    return stack.length === 0;
}`,
    testCases: [
      { id: 'tc1', input: JSON.stringify({ s: '()' }), expectedOutput: 'true', description: 'Simple single pair' },
      { id: 'tc2', input: JSON.stringify({ s: '()[]{}' }), expectedOutput: 'true', description: 'Multiple adjacent types' },
      { id: 'tc3', input: JSON.stringify({ s: '(]' }), expectedOutput: 'false', description: 'Mismatched brackets' },
      { id: 'tc4', input: JSON.stringify({ s: '([{}])' }), expectedOutput: 'true', isHidden: true, description: 'Nested pairs' },
      { id: 'tc5', input: JSON.stringify({ s: '(((' }), expectedOutput: 'false', isHidden: true, description: 'Unclosed open brackets' },
    ],
    hints: [
      'A Stack is the classic data structure for matching opening and closing pairs in Last-In First-Out (LIFO) order.',
    ],
  },
  {
    id: 'code-merge-intervals',
    title: 'Merge Overlapping Meeting Intervals',
    subject: 'Algorithms',
    difficulty: 'Medium',
    category: 'Programming',
    timeLimitMinutes: 20,
    description:
      'Given an array of meeting/drive `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= start_i <= end_i <= 10^4',
      'Target time complexity: O(n log n)',
    ],
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
      },
      {
        input: 'intervals = [[1,4],[4,5]]',
        output: '[[1,5]]',
        explanation: 'Intervals [1,4] and [4,5] are considered overlapping.',
      },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function merge(intervals) {
    if (!intervals.length) return [];
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const last = merged[merged.length - 1];
        
        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        } else {
            merged.push(current);
        }
    }
    return merged;
}`,
      python: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
    return merged`,
    },
    solutionTemplate: `function solve(input) {
    const { intervals } = input;
    if (!intervals || !intervals.length) return [];
    intervals.sort((a, b) => a[0] - b[0]);
    const res = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        const curr = intervals[i];
        const prev = res[res.length - 1];
        if (curr[0] <= prev[1]) prev[1] = Math.max(prev[1], curr[1]);
        else res.push(curr);
    }
    return res;
}`,
    testCases: [
      { id: 'tc1', input: JSON.stringify({ intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }), expectedOutput: '[[1,6],[8,10],[15,18]]', description: 'Standard overlapping intervals' },
      { id: 'tc2', input: JSON.stringify({ intervals: [[1, 4], [4, 5]] }), expectedOutput: '[[1,5]]', description: 'Boundary touch intervals' },
      { id: 'tc3', input: JSON.stringify({ intervals: [[1, 10], [2, 3], [4, 5], [6, 7]] }), expectedOutput: '[[1,10]]', isHidden: true, description: 'Complete absorption interval' },
    ],
    hints: [
      'Sorting intervals by their start time makes the problem simple to evaluate in one scan.',
    ],
  },
  {
    id: 'code-second-highest-salary',
    title: 'SQL / Array: Find Nth Distinct Maximum Record',
    subject: 'DBMS & SQL',
    difficulty: 'Medium',
    category: 'Databases',
    timeLimitMinutes: 15,
    description:
      'In technical coding rounds, recruiters frequently ask you to simulate SQL queries like `SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1` in code.\n\nWrite a function that accepts an array of employee salary numbers and returns the second distinct highest salary. If no second distinct highest salary exists, return `null`.',
    constraints: [
      '0 <= salaries.length <= 10^5',
      '0 <= salary <= 10^9',
      'Target time complexity: O(n), Space: O(1)',
    ],
    examples: [
      { input: 'salaries = [100, 200, 300]', output: '200' },
      { input: 'salaries = [100, 100]', output: 'null', explanation: 'There is only one distinct salary, so return null.' },
      { input: 'salaries = [500, 100, 500, 300]', output: '300' },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} salaries
 * @return {number|null}
 */
function findSecondHighest(salaries) {
    let first = -Infinity;
    let second = -Infinity;
    for (const s of salaries) {
        if (s > first) {
            second = first;
            first = s;
        } else if (s < first && s > second) {
            second = s;
        }
    }
    return second === -Infinity ? null : second;
}`,
      python: `def find_second_highest(salaries):
    first, second = float('-inf'), float('-inf')
    for s in salaries:
        if s > first:
            second = first
            first = s
        elif first > s > second:
            second = s
    return None if second == float('-inf') else second`,
    },
    solutionTemplate: `function solve(input) {
    const { salaries } = input;
    let first = -Infinity, second = -Infinity;
    for (const s of salaries) {
        if (s > first) { second = first; first = s; }
        else if (s < first && s > second) { second = s; }
    }
    return second === -Infinity ? null : second;
}`,
    testCases: [
      { id: 'tc1', input: JSON.stringify({ salaries: [100, 200, 300] }), expectedOutput: '200', description: 'Distinct sorted ascending' },
      { id: 'tc2', input: JSON.stringify({ salaries: [100, 100] }), expectedOutput: 'null', description: 'All identical values' },
      { id: 'tc3', input: JSON.stringify({ salaries: [500, 100, 500, 300] }), expectedOutput: '300', description: 'Duplicates with lower distinct second' },
      { id: 'tc4', input: JSON.stringify({ salaries: [] }), expectedOutput: 'null', isHidden: true, description: 'Empty array edge case' },
    ],
    hints: [
      'Maintain two variables (firstMax and secondMax) in a single loop.',
    ],
  },
];
