import React, { useState, useEffect, useRef } from 'react';
import MonacoEditorWrapper from '../components/MonacoEditorWrapper';
import ReactMarkdown from 'react-markdown';
import { 
  BookOpen, 
  Brain, 
  Sparkles, 
  Copy, 
  Download, 
  RotateCcw, 
  Trash2, 
  Upload, 
  Clipboard, 
  Check, 
  ArrowRight,
  HelpCircle,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Rich pre-configured explanations for the 6 default templates
const predefinedExplanations = {
  javascript: {
    beginner: `### 1. Overview
This JavaScript code defines a function called \`getUserData\` that retrieves a user's details and their roles from a database connection. It uses the asynchronous (\`async/await\`) pattern to work with database operations.

---

### 2. Step-by-step Explanation
- **Line 21**: We declare an asynchronous function named \`getUserData\` that accepts two parameters: \`userId\` (identifying the user) and \`dbConnection\` (the database handle).
- **Line 22**: We construct an SQL query string by directly combining the \`userId\` parameter. **Warning: This is dangerous because it makes the code vulnerable to SQL Injection.**
- **Line 24-25**: Inside a try-catch block, the function awaits the execution of the SQL query.
- **Line 28-34**: We query all roles in the database and loop through them using a \`for\` loop to find which ones belong to our user.
- **Line 36-37**: The matched roles are attached to the user object, which is then returned.
- **Line 38-41**: If an error happens, we catch it but only print the word \`"error"\` to the console. This hides what actually went wrong.

---

### 3. Functions & Variables
- **Function**: \`getUserData(userId, dbConnection)\`
  - **Parameters**: \`userId\` (String) - User ID, \`dbConnection\` (Object) - DB driver wrapper.
  - **Returns**: A \`Promise\` resolving to the user object (Object) with an added \`roles\` array.
- **Variable**: \`query\` - Holds the SQL instruction string.
- **Variable**: \`allRoles\` - Array of all roles from the database.
- **Variable**: \`roles\` - Array filtering roles matching the user's ID.

---

### 4. Algorithm
The code uses a **Linear Search loop** to match roles. Instead of querying database records directly for the user's specific roles, it fetches *all* roles from the database and filters them line-by-line in the application logic.

---

### 5. Time Complexity
- **Complexity**: $O(R)$ where $R$ is the total number of roles in the system.
- **Reason**: The \`for\` loop iterates over every single role returned by \`SELECT * FROM roles\` regardless of whether it relates to the current user.

---

### 6. Space Complexity
- **Complexity**: $O(R)$ memory storage.
- **Reason**: The application fetches and loads the entire list of roles from the database into local memory inside the \`allRoles\` variable.

---

### 7. Possible Improvements
1. **Prevent SQL Injection**: Use parameterized queries instead of string concatenation.
   \`\`\`javascript
   const query = "SELECT * FROM users WHERE id = ?";
   const user = await dbConnection.execute(query, [userId]);
   \`\`\`
2. **Database Filtering**: Filter roles directly inside the SQL query instead of fetching all of them.
   \`\`\`javascript
   const userRoles = await dbConnection.execute("SELECT * FROM roles WHERE userId = ?", [user.id]);
   \`\`\`
3. **Proper Error Handling**: Log the real error message (\`console.error(e)\`) or throw it so parent modules know it failed.

---

### 8. Interview Perspective
- **What is the main security vulnerability in this snippet?**
  SQL Injection. Directly appending parameters allows attackers to manipulate the database query string (e.g. inputting \`' OR '1'='1\`).
- **How would you optimize the role loading logic?**
  Replace application-level filtering with a database \`JOIN\` query or a filtered \`WHERE\` query.
- **Why is swallowing errors in the catch block bad?**
  It hides failures, making debugging difficult and creating silent failures.

---

### 9. Learning Tips
- Read about **SQL Parameterization** and **Prepared Statements**.
- Understand database **indexing** and why fetching everything is a bottleneck.
- Review JavaScript **Promise error propagation**.

---

### 10. Related Concepts
- SQL Injection
- Async/Await
- Query Optimization
- Error Handling`,

    intermediate: `### 1. Overview
This asynchronous JavaScript routine retrieves user details and associates matching user roles. The implementation highlights several common performance anti-patterns and severe security vulnerabilities, particularly parameter concatenation.

---

### 2. Step-by-step Explanation
- **Line 22**: Constructs the SQL string via string concatenation. This allows malicious input in \`userId\` to break the SQL statement boundary (SQL Injection).
- **Line 25**: Awaits resolution of the user query execution.
- **Line 28-34**: Executes an unfiltered database query \`SELECT * FROM roles\`. It then executes an $O(n)$ in-memory filter loop to map roles to the retrieved user, which scales poorly.
- **Line 38-41**: Implements a generic catch-block that swallows the error stack, outputting a generic string message to standard out.

---

### 3. Functions & Variables
- **Function**: \`getUserData\`
  - **Type**: Asynchronous (\`async\`)
  - **Inputs**: \`userId\` (String/Number), \`dbConnection\` (Database instance)
  - **Outputs**: \`Promise<Object>\` containing user data and filtered roles.
- **Variable**: \`allRoles\` - Full list of roles fetched from DB.
- **Variable**: \`roles\` - Filtered array of user roles.

---

### 4. Algorithm
The code executes two separate queries: a single-row look up and a full table scan. The filtering algorithm is a **linear array scan** on the application layer.

---

### 5. Time Complexity
- **Complexity**: $O(U + R)$ where $U$ is user query cost (ideally $O(1)$ with index) and $R$ is role table scan size.
- **Reason**: The table scan \`SELECT * FROM roles\` takes $O(R)$ database read time, and the subsequent JS array iteration loops $R$ times.

---

### 6. Space Complexity
- **Complexity**: $O(R)$ auxiliary memory.
- **Reason**: Stores the entire role table result set in JavaScript execution context memory.

---

### 7. Possible Improvements
- **Prepared Statements**: Use placeholders to separate query logic from parameters.
- **Query Joins**: Fetch user and roles in one go using a join query.
  \`\`\`sql
  SELECT u.*, r.role_name 
  FROM users u 
  LEFT JOIN roles r ON u.id = r.userId 
  WHERE u.id = ?
  \`\`\`
- **Error Logging**: Log the actual stack trace (\`console.error(e.stack)\`) and rethrow or return a standard error indicator.

---

### 8. Interview Perspective
- **How does an SQL injection occur here?**
  By combining code and data. A \`userId\` value like \`1' OR '1'='1\` changes the logic of the query.
- **What is the N+1 problem and does it apply here?**
  While this isn't strictly N+1 (which is doing a query *inside* a loop), it is an "N-items in memory" filter, which has similar resource wastage characteristics.
- **How would you secure Node.js database interactions?**
  Use ORMs (like Prisma/Sequelize) or database drivers with built-in query parameterization support.

---

### 9. Learning Tips
- Investigate **OWASP Injection Prevention** guidelines.
- Explore relational database relations (One-to-Many).
- Study JavaScript **exceptions handling best practices**.

---

### 10. Related Concepts
- Relational Databases
- OWASP Top 10
- Array Filtering
- Prepared Statements`,

    expert: `### 1. Overview
This module demonstrates an asynchronous database accessor function in JavaScript. From an architectural perspective, it violates database encapsulation principles, lacks proper input sanitization, and introduces significant system load through non-selective queries and silent error swallowing.

---

### 2. Step-by-step Explanation
- **Line 22**: Dynamic SQL query construction. The parser treats input strings as execution tokens, facilitating remote database compromise.
- **Line 25**: Suspends execution context until the database connection returns user records.
- **Line 29**: Full table scan execution (\`SELECT * FROM roles\`). This bypasses database-level indexes and causes excessive network overhead.
- **Line 30-34**: In-memory filter loop. Linear search over a fetched array, causing garbage collection thrashing on large datasets.
- **Line 38-41**: Empty/opaque error handler. It swallows the stack trace and prevents transaction rollback or logging to centralized telemetry (e.g. Sentry).

---

### 3. Functions & Variables
- **Function**: \`getUserData(userId, dbConnection)\`
  - **Returns**: \`Promise<UserObject>\`
- **Variable**: \`query\` - Raw template string.
- **Variable**: \`allRoles\` - In-memory array of database rows.

---

### 4. Algorithm
The mapping logic implements a client-side **Linear Filter** over a full database table scan.

---

### 5. Time Complexity
- **Time Complexity**: $O(U_{lookup} + R)$ where $R$ is cardinality of the roles table.
- **Reason**: The database engine must execute a full table scan, and the runtime executes a linear traversal over $R$ elements.

---

### 6. Space Complexity
- **Space Complexity**: $O(R)$ on the Node.js V8 heap.
- **Reason**: All database rows for roles are mapped to JavaScript objects and held in V8 heap memory until the function context is garbage collected.

---

### 7. Possible Improvements
1. **Query Join with Parameterization**:
   \`\`\`javascript
   const sql = "SELECT u.*, r.id as role_id, r.name as role_name FROM users u LEFT JOIN roles r ON u.id = r.userId WHERE u.id = ?";
   const [rows] = await dbConnection.execute(sql, [userId]);
   \`\`\`
2. **Object Relational Mapping**: Leverage parameterized query caches.
3. **Structured Logging**: Integrate logging frameworks (e.g., Winston, Pino) with trace IDs for observability.

---

### 8. Interview Perspective
- **Discuss the security implications of this implementation.**
  SQL Injection allows arbitrary command execution, data exfiltration, or privilege escalation.
- **What happens to the V8 garbage collector if this is called frequently?**
  Frequent table scans with thousands of rows lead to memory spikes, GC thrashing, and high CPU usage.
- **Explain connection pooling and how error handling affects it.**
  If exceptions are not handled correctly or DB resources are left open, connections can leak, exhausting the connection pool.

---

### 9. Learning Tips
- Study **V8 Heap Memory Profiling**.
- Read about database **execution plans** (EXPLAIN queries).
- Learn **Structured Log Aggregation** architectures.

---

### 10. Related Concepts
- V8 Garbage Collection
- Parameterized Queries
- Full Table Scans
- Observability`
  },
  python: {
    beginner: `### 1. Overview
This Python code implements a recursive function to find Fibonacci numbers. However, it is **highly unoptimized**, meaning it runs extremely slowly because it does the same calculations over and over.

---

### 2. Step-by-step Explanation
- **Line 5**: We define the function \`calculate_fibonacci\` taking a parameter \`n\`.
- **Line 8-9**: If \`n\` is less than or equal to 0, return 0.
- **Line 10-11**: If \`n\` is exactly 1, return 1.
- **Line 12-13**: Otherwise, the function calls *itself* twice, once for \`n-1\` and once for \`n-2\`, adding the results together. This is called **recursion**.
- **Line 16**: The program asks the user for a number, converts it to an integer, and prints the result.

---

### 3. Functions & Variables
- **Function**: \`calculate_fibonacci(n)\`
  - **Parameter**: \`n\` (Integer) - The position in the Fibonacci sequence.
  - **Returns**: The Fibonacci number at index \`n\`.
- **Variable**: \`val\` - String input from user.

---

### 4. Algorithm
The algorithm uses **Naive Recursion** to build a branching call tree. It behaves like a tree that splits in two at every level.

---

### 5. Time Complexity
- **Complexity**: $O(2^n)$ (Exponential).
- **Reason**: Every call splits into two more calls. For \`n=5\`, it makes dozens of repeated function calls for the same values.

---

### 6. Space Complexity
- **Complexity**: $O(n)$ (Linear).
- **Reason**: The space complexity is determined by the size of the call stack (the memory Python uses to keep track of active function calls), which grows up to depth \`n\`.

---

### 7. Possible Improvements
1. **Use Iteration**: A simple \`for\` loop can calculate Fibonacci in linear time ($O(n)$) and uses very little memory.
   \`\`\`python
   def fib_iterative(n):
       a, b = 0, 1
       for _ in range(n):
           a, b = b, a + b
       return a
   \`\`\`
2. **Memoization**: Cache the results of previous calculations.
   \`\`\`python
   from functools import lru_cache
   @lru_cache(maxsize=None)
   def fib_memoized(n):
       # recursive code here...
   \`\`\`

---

### 8. Interview Perspective
- **Why is recursion inefficient here?**
  Because it performs redundant calculations. For example, \`fib(5)\` calls both \`fib(4)\` and \`fib(3)\`. Both of those call \`fib(2)\` independently, wasting CPU cycles.
- **What is a stack overflow?**
  If \`n\` is too large, the recursion stack will exceed the language limits, causing Python to crash with a \`RecursionError\`.

---

### 9. Learning Tips
- Understand **recursion** and base cases.
- Read about **memoization** and dynamic programming.
- Learn about the **call stack**.

---

### 10. Related Concepts
- Naive Recursion
- Call Stack
- Exponential Time
- Dynamic Programming`,

    intermediate: `### 1. Overview
A Python implementation of Fibonacci number calculation using naive recursion. This design serves as a classic example of excessive time complexity ($O(2^n)$) caused by overlapping subproblems.

---

### 2. Step-by-step Explanation
- **Line 5**: Declares the recursive function.
- **Line 8-11**: Establish base cases for termination (\`n <= 0\` and \`n == 1\`).
- **Line 13**: Recursively executes two calls. This branches the evaluation tree.
- **Line 16**: Invokes block input extraction. It converts input to an integer.

---

### 3. Functions & Variables
- **Function**: \`calculate_fibonacci(n)\`
  - **Inputs**: \`n\` (Int)
  - **Outputs**: Fibonacci value (Int)
- **Variable**: \`val\` - Input string token.

---

### 4. Algorithm
The routine is based on a **Divide-and-Conquer Recurrence Relation**. It builds a redundant binary tree of execution frames.

---

### 5. Time Complexity
- **Complexity**: $O(1.618^n) \approx O(2^n)$ (Golden Ratio base).
- **Reason**: The recurrence relation is $T(n) = T(n-1) + T(n-2) + O(1)$, which expands to an exponential tree of redundant execution calls.

---

### 6. Space Complexity
- **Complexity**: $O(n)$ depth stack memory.
- **Reason**: Determined by the maximum depth of the call stack recursion chain.

---

### 7. Possible Improvements
1. **Dynamic Programming (Bottom-Up)**: Use tabulation to construct values iteratively.
   \`\`\`python
   def fib_tab(n):
       if n < 2: return n
       dp = [0] * (n + 1)
       dp[1] = 1
       for i in range(2, n + 1):
           dp[i] = dp[i-1] + dp[i-2]
       return dp[n]
   \`\`\`
2. **Space-Optimized Iteration**: Use two pointers to keep space complexity down to $O(1)$.

---

### 8. Interview Perspective
- **How would you fix the recursion limit error in Python?**
  Apart from changing recursion limits using \`sys.setrecursionlimit\`, the correct fix is using an iterative approach or memoization.
- **What is the time complexity of the memoized version?**
  It reduces the time complexity from $O(2^n)$ to $O(n)$ because each Fibonacci number is computed exactly once.

---

### 9. Learning Tips
- Study **Dynamic Programming** principles.
- Understand the **overlapping subproblems** concept.
- Review **Big-O complexity analysis**.

---

### 10. Related Concepts
- Overlapping Subproblems
- Space Complexity Stack
- Tabulation
- Time Complexity Profiles`,

    expert: `### 1. Overview
This snippet implements naive recursion to solve the Fibonacci recurrence relation. Architecturally, this represents a worst-case design pattern for recursion due to overlapping subproblems.

---

### 2. Step-by-step Explanation
- **Line 5**: Allocates a stack frame for the current value of \`n\`.
- **Line 8-11**: Check base cases to halt further recursive branching.
- **Line 13**: Evaluates child stack frames. The execution stack branches into a binary recursion tree.
- **Line 16**: Standard I/O blocking operation. It converts input string bytes to integer objects in the Python interpreter.

---

### 3. Functions & Variables
- **Function**: \`calculate_fibonacci\`
  - **Complexity**: $T(n) = T(n-1) + T(n-2) + \Theta(1)$
- **Variable**: \`val\` - User input reference.

---

### 4. Algorithm
The code implements **Naive Binary Recursion**.

---

### 5. Time Complexity
- **Time Complexity**: $\Theta(\phi^n)$ where $\phi = \frac{1+\sqrt{5}}{2} \approx 1.618$ (The Golden Ratio).
- **Reason**: The recurrence relation bounds the call count to the golden ratio base raised to the power of $n$.

---

### 6. Space Complexity
- **Space Complexity**: $O(n)$ execution stack depth.
- **Reason**: The call stack maxes out at a depth equal to the height of the recursion tree, which is linear in terms of $n$.

---

### 7. Possible Improvements
1. **Matrix Exponentiation**: Compute Fibonacci in $O(\log n)$ using matrix multiplications:
   $$\begin{pmatrix} F_{n+1} & F_n \\ F_n & F_{n-1} \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^n$$
2. **Memoization / Decorator caching**: Use \`functools.lru_cache\` to cache computations automatically.

---

### 8. Interview Perspective
- **Prove that the time complexity of naive Fibonacci is exponential.**
  By setting up the recurrence equation $T(n) = T(n-1) + T(n-2) + O(1)$, we solve the characteristic equation $r^2 - r - 1 = 0$, giving the root $r = \phi \approx 1.618$.
- **Compare Memoization (Top-Down) vs. Tabulation (Bottom-Up) approaches.**
  Memoization is lazy (computes on-demand, stack usage is $O(n)$), while tabulation is eager (builds array from $0$ up, stack usage is $O(1)$).

---

### 9. Learning Tips
- Read about **Matrix Exponentiation** algorithms.
- Review **V8/Python stack frame allocation internals**.
- Study **Recurrence Relation proofs**.

---

### 10. Related Concepts
- Recurrence Relations
- Naive Recursion
- Matrix Exponentiation
- Overlapping Subproblems`
  },
  cpp: {
    beginner: `### 1. Overview
This C++ program defines a class named \`DataProcessor\` that allocates memory dynamically. It contains **two severe bugs**: a memory leak (missing destructor) and a buffer overflow (using \`strcpy\` on a fixed-size buffer).

---

### 2. Step-by-step Explanation
- **Line 53-55**: The constructor allocates an integer array on the heap using \`new int[size]\`.
- **Line 57**: There is no destructor (\`~DataProcessor\`). The allocated integer array is never freed.
- **Line 59**: The \`processData\` function allocates a fixed char array (\`buffer\`) of size 10.
- **Line 61**: It uses \`strcpy\` to copy user input into the buffer. If the input is longer than 9 characters, it overflows the buffer.
- **Line 67**: The \`main\` function allocates \`proc\` on the heap using \`new\` but never deletes it.

---

### 3. Functions & Variables
- **Class**: \`DataProcessor\` - Holds heap buffers.
- **Function**: \`processData(char* input)\` - Copies string input to stack buffer.
- **Variable**: \`dataBuffer\` - Raw integer pointer allocated on the heap.

---

### 4. Algorithm
The program performs **raw memory copy** and heap allocation operations.

---

### 5. Time Complexity
- **Complexity**: $O(N)$ where $N$ is the length of the input string.
- **Reason**: The \`strcpy\` function copies characters one-by-one until it hits the null terminator.

---

### 6. Space Complexity
- **Complexity**: $O(S)$ where $S$ is the size passed to the constructor.
- **Reason**: Memory allocation size is linear based on constructor size parameters.

---

### 7. Possible Improvements
1. **Implement Destructor**: Free memory in a destructor.
   \`\`\`cpp
   ~DataProcessor() {
       delete[] dataBuffer;
   }
   \`\`\`
2. **Safe String Copy**: Use \`std::string\` or \`strncpy\` to limit bounds.
3. **Use Smart Pointers**: Replace raw pointers with smart pointers.
   \`\`\`cpp
   auto proc = std::make_unique<DataProcessor>(100);
   \`\`\`

---

### 8. Interview Perspective
- **What is a buffer overflow?**
  Writing data past the end of allocated memory boundaries. This corrupts adjacent memory and can cause security vulnerabilities or crashes.
- **Explain memory leaks.**
  Failing to release dynamically allocated memory when it is no longer needed, causing the system to run out of memory over time.

---

### 9. Learning Tips
- Study C++ **Destructors and RAII**.
- Learn about **Smart Pointers** (\`unique_ptr\`, \`shared_ptr\`).
- Read about stack-smashing and buffer overflow attacks.

---

### 10. Related Concepts
- Memory Leaks
- Buffer Overflows
- Smart Pointers
- RAII`,

    intermediate: `### 1. Overview
A C++ example demonstrating manual memory management. It exhibits classic memory leaks due to missing destructors and raw heap instantiation, and stack buffer corruption from unbounded string copying.

---

### 2. Step-by-step Explanation
- **Line 54**: Performs manual heap allocation (\`new[]\`), requiring corresponding manual release (\`delete[]\`).
- **Line 57**: Lacks a destructor, leaving heap elements allocated permanently after instance deletion.
- **Line 60**: Allocates a static 10-byte buffer on the stack.
- **Line 61**: Invokes \`strcpy\` without verification, leading to stack overflow.
- **Line 67**: Creates dynamic object instance without matching \`delete\` call, leaking the class instance.

---

### 3. Functions & Variables
- **Class**: \`DataProcessor\`
- **Variable**: \`dataBuffer\` - Raw pointer.
- **Function**: \`processData\` - Executes stack copy.

---

### 4. Algorithm
The program performs **Raw Memory Transfers** and direct heap reservations.

---

### 5. Time Complexity
- **Complexity**: $O(N)$ string length copy operations.
- **Reason**: Character copy execution time scales linearly with string length.

---

### 6. Space Complexity
- **Complexity**: $O(S)$ allocation space.
- **Reason**: Constructor initializes raw arrays matching size parameters.

---

### 7. Possible Improvements
- **RAII Compliance**: Free memory dynamically.
- **Safe Copy Methods**: Use \`std::string\` to handle allocations automatically.
  \`\`\`cpp
  void processData(const std::string& input) {
      std::cout << "Processing: " << input << std::endl;
  }
  \`\`\`
- **Use std::vector**: Replace raw arrays with vector classes.

---

### 8. Interview Perspective
- **Explain the rule of three/five in C++.**
  If you define a custom destructor, copy constructor, or copy assignment operator, you likely need to define all three (or five, including move operations).
- **How does \`strncpy\` differ from \`strcpy\`?**
  \`strncpy\` specifies the maximum bytes to copy, preventing overflow but not guaranteeing null-termination.

---

### 9. Learning Tips
- Explore the **Rule of Three/Five/Zero**.
- Learn database indexing principles.
- Read about modern C++ standard library implementations.

---

### 10. Related Concepts
- RAII
- Stack Smashing
- Manual Allocations
- Bounds Checks`,

    expert: `### 1. Overview
This C++ snippet highlights dynamic memory leak patterns and stack smashing vulnerabilities. It violates RAII specifications by exposing raw pointers, failing to manage subclass lifecycles, and using unsafe C library function primitives.

---

### 2. Step-by-step Explanation
- **Line 54**: Dynamic reservation on heap using raw pointer initialization.
- **Line 57**: Omits class destructor, causing dynamic heap exhaustion.
- **Line 60-61**: Stack buffer declaration and copying. The lack of bounds checks allows rewriting of the instruction pointer register.
- **Line 67-70**: Heap instantiation of class instance without dynamic deletion.

---

### 3. Functions & Variables
- **Class**: \`DataProcessor\`
- **Variable**: \`dataBuffer\` - Unmanaged pointer.
- **Function**: \`processData\` - Insecure buffer interface.

---

### 4. Algorithm
Performs raw pointer indexing and stack modification.

---

### 5. Time Complexity
- **Time Complexity**: $O(N)$ linear string scanning.
- **Reason**: Requires reading bytes sequentially until the null terminator is detected.

---

### 6. Space Complexity
- **Space Complexity**: $O(S)$ heap footprint + $O(1)$ stack allocation.
- **Reason**: Heap size is proportional to constructor parameter inputs.

---

### 7. Possible Improvements
1. **Modern C++ RAII Guidelines**:
   \`\`\`cpp
   class DataProcessor {
   private:
       std::vector<int> dataBuffer;
   public:
       DataProcessor(size_t size) : dataBuffer(size) {}
       void processData(const std::string& input) {
           std::cout << "Processing: " << input << std::endl;
       }
   };
   \`\`\`
2. **Smart Pointer Initialization**: Use \`std::unique_ptr\` to enforce scope lifecycles.

---

### 8. Interview Perspective
- **What is stack smashing?**
  Writing past stack array limits to corrupt local variables and rewrite the function return address to run arbitrary code.
- **Why are raw pointers discouraged in modern C++?**
  They do not express ownership and lead to resource leaks, dangling pointers, and double-free exceptions.

---

### 9. Learning Tips
- Study **Assembly execution flow** and stack frames.
- Read modern **ISO C++ core guidelines**.
- Analyze **address space layout randomization (ASLR)**.

---

### 10. Related Concepts
- Stack Smashing
- Smart Pointers
- RAII
- Memory Address Translation`
  },
  java: {
    beginner: `### 1. Overview
This Java class named \`InventoryManager\` handles inventory actions. It has **two main issues**: a potential memory leak from items staying in a static list forever, and poor performance from string concatenation inside a loop.

---

### 2. Step-by-step Explanation
- **Line 103**: We declare a static list called \`cache\`. Because it is static, it belongs to the class itself and never gets cleaned up by Java's Garbage Collector.
- **Line 105-107**: The \`addItem\` function adds objects to this static cache. Since there is no remove or clear method, the cache will grow larger and larger.
- **Line 110-117**: The \`processInventory\` function concatenates strings inside a loop. This creates many temporary string objects, slowing down performance.

---

### 3. Functions & Variables
- **Class**: \`InventoryManager\`
- **Variable**: \`cache\` - Static list holding items.
- **Function**: \`processInventory(String data)\` - Builds a report using loop concatenation.

---

### 4. Algorithm
The code uses **String Concatenation** inside a loop, which creates new string instances on every single iteration.

---

### 5. Time Complexity
- **Complexity**: $O(N^2)$ where $N$ is the loop count (1000 in this case).
- **Reason**: String concatenation in Java is an $O(L)$ operation where $L$ is string length. In a loop, copying the growing string results in quadratic complexity.

---

### 6. Space Complexity
- **Complexity**: $O(N^2)$ memory allocations.
- **Reason**: Creating new string instances on every loop iteration wastes heap memory.

---

### 7. Possible Improvements
1. **Use StringBuilder**:
   \`\`\`java
   StringBuilder report = new StringBuilder();
   for (int i = 0; i < 1000; i++) {
       report.append(data).append(" Index: ").append(i).append("\\n");
   }
   System.out.println(report.toString());
   \`\`\`
2. **Limit Cache Size**: Use a cache eviction policy (like LRU) or clear items when no longer needed.

---

### 8. Interview Perspective
- **Why is string concatenation slow in a loop in Java?**
  Strings in Java are immutable. Every time you concatenate, Java creates a new String object, copying the old contents. This wastes time and memory.
- **What is a Java memory leak?**
  Objects that are no longer needed but are still referenced by active variables (like static lists), preventing the garbage collector from reclaiming them.

---

### 9. Learning Tips
- Learn about **String Immutability** in Java.
- Read about Java **Garbage Collection** roots.
- Study **StringBuilder** internals.

---

### 10. Related Concepts
- Static Cache Leak
- String Builder
- Memory Management
- Garbage Collection`,

    intermediate: `### 1. Overview
A Java class demonstrating two classical enterprise performance issues: static reference collection leaks (preventing Garbage Collection sweep) and quadratic performance degradation from dynamic string copy operations inside a loop.

---

### 2. Step-by-step Explanation
- **Line 103**: Allocates a static list. Since it is referenced by a GC Root, it is never evicted from the heap.
- **Line 106**: Inserts items into cache without boundaries or cleanup routines.
- **Line 112-115**: Executes string concatenation with \`+=\` in a loop. Under the hood, this converts to new StringBuilder allocations, scaling quadratically.

---

### 3. Functions & Variables
- **Class**: \`InventoryManager\`
- **Variable**: \`cache\` - Static array wrapper.
- **Function**: \`processInventory\` - Dynamic report builder.

---

### 4. Algorithm
The program implements **Dynamic String Instantiation**.

---

### 5. Time Complexity
- **Complexity**: $O(N^2)$ where $N$ is loop size.
- **Reason**: Copying contents repeatedly across new immutable String memory ranges scales quadratically.

---

### 6. Space Complexity
- **Complexity**: $O(N^2)$ memory churn.
- **Reason**: Allocates intermediate string objects on the JVM Heap.

---

### 7. Possible Improvements
- **Use StringBuilder**: Allocate single character buffers.
- **Evict Cache**: Use weak references (\`WeakHashMap\`) or cache configurations.
  \`\`\`java
  private static Map<String, Object> cache = Collections.synchronizedMap(new WeakHashMap<>());
  \`\`\`

---

### 8. Interview Perspective
- **How does a WeakReference help prevent leaks?**
  It allows the garbage collector to clear the referenced object when it has no strong references left.
- **Why does the static keyword affect memory?**
  Static fields are associated with the class, meaning they stay loaded as long as the classloader is active, keeping references alive.

---

### 9. Learning Tips
- Investigate **Weak references and Soft references**.
- Study **JVM class loading memory cycles**.
- Review **Vite and compiler optimization paths**.

---

### 10. Related Concepts
- Weak References
- String Immutability
- Heap Profiling
- Garbage Collectors`,

    expert: `### 1. Overview
This Java class demonstrates static reference collection leaks and heap allocation issues. It shows how static references act as permanent GC roots and how immutable String operations lead to high garbage collection overhead.

---

### 2. Step-by-step Explanation
- **Line 103**: Reserves class-level static array references. This creates a permanent GC root.
- **Line 106**: Inserts cache tokens without limits or eviction policies.
- **Line 112-115**: Implements string concatenation inside loops. This triggers multiple allocations on the Java heap, leading to memory fragmentation.

---

### 3. Functions & Variables
- **Class**: \`InventoryManager\`
- **Variable**: \`cache\` - Static array.
- **Function**: \`processInventory\` - Inefficient loops.

---

### 4. Algorithm
Dynamic String allocation and V8/JVM heap usage.

---

### 5. Time Complexity
- **Time Complexity**: $O(N^2)$
- **Reason**: Immutable arrays are re-allocated and copied sequentially on every loop iteration.

---

### 6. Space Complexity
- **Space Complexity**: $O(N^2)$ heap memory footprint.
- **Reason**: Generates thousands of short-lived intermediate objects, stressing the JVM Young Generation collectors.

---

### 7. Possible Improvements
1. **Initialize StringBuilder with Capacity**:
   \`\`\`java
   StringBuilder sb = new StringBuilder(estimatedSize);
   \`\`\`
2. **Implement Evicting Queue**: Use structures like LinkedHashMap overrides (\`removeEldestEntry\`).

---

### 8. Interview Perspective
- **Describe GC Generations.**
  The heap is split into Young (Eden, Survivor) and Old generations. Short-lived objects are cleared in minor GCs, while static cache leaks degrade to the Old generation, triggering Full GCs.
- **How would you debug a Java memory leak?**
  Use profiling tools (Eclipse Memory Analyzer, VisualVM) to capture a heap dump and search for large object graphs held by static references.

---

### 9. Learning Tips
- Study **Garbage Collection algorithms (G1, ZGC)**.
- Read about **escape analysis** in JVM compilers.
- Analyze **V8 vs JVM heap differences**.

---

### 10. Related Concepts
- Heap Dumps
- Class Loaders
- Garbage Collection Roots
- String Immutability`
  },
  go: {
    beginner: `### 1. Overview
This Go program implements a concurrent **Worker Pool** pattern. It uses multiple parallel processes called **Goroutines** to process jobs concurrently, coordinating them with **channels**.

---

### 2. Step-by-step Explanation
- **Line 9**: We define the \`worker\` function which receives jobs from the \`jobs\` channel and sends results to the \`results\` channel.
- **Line 10**: The \`defer wg.Done()\` statement ensures the WaitGroup counter decreases when the worker finishes.
- **Line 26-30**: In the main function, we spin up 3 parallel workers using the \`go\` keyword.
- **Line 33-36**: We send 5 jobs down the \`jobs\` channel and close it.
- **Line 39-42**: We start a background process to wait for the workers to finish and close the results channel.
- **Line 45-47**: We loop through the results channel to print the calculated outputs.

---

### 3. Functions & Variables
- **Function**: \`worker(id, jobs, results, wg)\` - Performs execution tasks.
- **Variable**: \`jobs\` - A channel to send jobs to workers.
- **Variable**: \`results\` - A channel to receive outputs from workers.
- **Variable**: \`wg\` - A sync.WaitGroup to coordinate routine completion.

---

### 4. Algorithm
The program implements the **Worker Pool Concurrency Pattern**.

---

### 5. Time Complexity
- **Complexity**: $O(J / W)$ where $J$ is the number of jobs and $W$ is the number of workers.
- **Reason**: Jobs are divided among the active workers. For 5 jobs and 3 workers, execution time is cut down significantly compared to sequential processing.

---

### 6. Space Complexity
- **Complexity**: $O(J)$ to store results.
- **Reason**: The channels are buffered to hold the jobs and results.

---

### 7. Possible Improvements
1. **Dynamic Worker Count**: Configure worker counts based on available CPU cores.
2. **Context Cancellation**: Pass a \`context.Context\` to worker routines to support timeouts or cancellation.
3. **Error Reporting**: Use a dedicated channel or structure to collect errors from workers.

---

### 8. Interview Perspective
- **What is a Go Goroutine?**
  A lightweight thread managed by the Go runtime, requiring just a few kilobytes of stack memory to start.
- **What is the purpose of sync.WaitGroup?**
  It blocks execution in main until all registered Goroutines have finished their work.

---

### 9. Learning Tips
- Study **Go Channels** (buffered vs unbuffered).
- Read about the **Go Scheduler (M:N model)**.
- Practice coordinating Goroutines using wait groups.

---

### 10. Related Concepts
- Worker Pools
- Channels
- Goroutines
- Concurrency`,

    intermediate: `### 1. Overview
A Go concurrent program utilizing Goroutines, channels, and a sync.WaitGroup to process data using a worker pool. This pattern limits execution concurrency while maximizing resource utilization.

---

### 2. Step-by-step Explanation
- **Line 9-15**: Defines a worker routine that pulls data from a channel and writes to a results channel.
- **Line 26-30**: Spins up 3 concurrent worker goroutines.
- **Line 33-36**: Populates the buffered jobs channel and closes it, signaling to workers that no more jobs are coming.
- **Line 39-42**: Executes an anonymous background goroutine to coordinate closing the results channel when workers complete.
- **Line 45-47**: Reads sequentially from the results channel until it is closed.

---

### 3. Functions & Variables
- **Function**: \`worker\`
- **Variable**: \`jobs\` - Bidirectional channel restricted to receiver syntax inside the worker.
- **Variable**: \`wg\` - Struct coordination pointer.

---

### 4. Algorithm
Implements **Concurrent CSP (Communicating Sequential Processes)** message passing.

---

### 5. Time Complexity
- **Complexity**: $O(J / W)$ execution latency.
- **Reason**: Processing load is distributed across $W$ workers running concurrently.

---

### 6. Space Complexity
- **Complexity**: $O(J)$ channel allocation.
- **Reason**: Buffering limits correspond to the active job allocation size.

---

### 7. Possible Improvements
- **Limit Channel Capacity**: Restrict buffer limits to prevent memory spikes under high load.
- **Graceful Shutdowns**: Implement context cancellation.
  \`\`\`go
  select {
  case <-ctx.Done():
      return
  }
  \`\`\`

---

### 8. Interview Perspective
- **What happens if you close a closed channel?**
  It triggers a runtime panic.
- **Explain the difference between buffered and unbuffered channels.**
  Unbuffered channels block the sender until the receiver reads the value. Buffered channels only block when the buffer capacity is full.

---

### 9. Learning Tips
- Investigate **Go GC sweep phases**.
- Review **channel synchronization patterns**.
- Study concurrency synchronization primitives in Go.

---

### 10. Related Concepts
- CSP Model
- Wait Groups
- Channel Buffering
- Goroutines Scheduler`,

    expert: `### 1. Overview
An implementation of Go's CSP concurrency model using a worker pool. The code coordinates Goroutine lifecycles, resource allocation, and clean shutdowns using channels and wait groups.

---

### 2. Step-by-step Explanation
- **Line 9**: Implements worker routines running on lightweight Go runtime stacks.
- **Line 10**: Uses \`defer\` to decrement the WaitGroup counter.
- **Line 28**: Spawns worker loops. The Go scheduler maps these to OS threads using the M:N scheduler model.
- **Line 33-36**: Fills the jobs queue. Closing the channel sends a zero value signal to the workers' loops, ending their execution.
- **Line 39-42**: Spawns a coordination routine to prevent blocking the main thread while waiting for workers to finish.

---

### 3. Functions & Variables
- **Function**: \`worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup)\`
- **Channels**: Strongly typed directional communication paths.

---

### 4. Algorithm
Communicating Sequential Processes (CSP) messaging system.

---

### 5. Time Complexity
- **Time Complexity**: $O(J / W + \text{scheduling overhead})$
- **Reason**: Work is processed concurrently, with a small overhead from the runtime thread scheduler.

---

### 6. Space Complexity
- **Space Complexity**: $O(J + W \times \text{stack size})$
- **Reason**: Channel buffers scale with jobs, and each goroutine allocates a starting stack of 2KB.

---

### 7. Possible Improvements
1. **Dynamic Scaling Workers**: Use rate-limiting libraries or CPU load metrics to adjust worker pool size dynamically.
2. **Context-Driven Timeouts**: Prevent worker routines from hanging on slow network operations.

---

### 8. Interview Perspective
- **Explain Go's GMP scheduler model.**
  G (Goroutines), M (Machine/OS thread), P (Processor context). P schedules Gs onto Ms, using work-stealing queues to balance work when one processor becomes idle.
- **Why is results closed in a separate Goroutine?**
  If \`wg.Wait()\` ran on the main thread, the program would deadlock because the main thread would block before reading from the results channel.

---

### 9. Learning Tips
- Learn about **Go memory model constraints**.
- Study **Lock-free queue structures** in Go channels.
- Research scheduler tracing (\`GODEBUG=schedtrace=1000\`).

---

### 10. Related Concepts
- Work Stealing Scheduler
- Go GMP Internals
- Deadlock Prevention
- Concurrency Primatives`
  },
  rust: {
    beginner: `### 1. Overview
This Rust code implements a thread-safe Queue named \`SafeQueue\`. It uses **smart pointers** (\`Arc\`) and **mutual exclusion locks** (\`Mutex\`) to share data safely between threads without data races.

---

### 2. Step-by-step Explanation
- **Line 5**: We declare a struct \`SafeQueue\` containing a vector wrapped in a Mutex, wrapped in an Arc.
- **Line 9-23**: We implement helper methods for SafeQueue: \`new\` to initialize, \`push\` to append items, and \`pop\` to retrieve them.
- **Line 17**: In \`push\`, we call \`.lock().unwrap()\` to acquire the Mutex lock. This prevents other threads from accessing the vector at the same time.
- **Line 32**: In the main function, we clone the Arc pointer. Cloning increases the reference count, allowing multiple threads to own a pointer to the same queue.
- **Line 34-41**: We spawn 5 threads using \`thread::spawn\`. Each thread pushes its ID to the queue.
- **Line 44-46**: We wait for all threads to finish using \`.join().unwrap()\`.

---

### 3. Functions & Variables
- **Struct**: \`SafeQueue<T>\` - Wrapper managing data safety.
- **Function**: \`push(&self, item: T)\` - Safe append.
- **Function**: \`pop(&self)\` - Safe removal.
- **Variable**: \`queue\` - Queue instance.

---

### 4. Algorithm
The program implements a **Mutex Protected Concurrent Queue**.

---

### 5. Time Complexity
- **Complexity**: $O(N)$ for thread operations, with variable locking overhead.
- **Reason**: Spawning $N$ threads takes linear time. Pushing is $O(1)$ on average, but lock contention (waiting for the lock) can add overhead.

---

### 6. Space Complexity
- **Complexity**: $O(N)$ memory storage.
- **Reason**: The queue holds elements added by the threads.

---

### 7. Possible Improvements
1. **Lock-Free Queue**: Use lock-free data structures (like Crossbeam channels) for higher concurrency performance.
2. **Handle Poisoned Locks**: Implement robust handling for lock poisoning (when a thread panics while holding the lock).
3. **Use Thread Pools**: Avoid the overhead of spawning raw OS threads by using a thread pool (like \`rayon\`).

---

### 8. Interview Perspective
- **What is Arc in Rust?**
  Arc stands for Atomically Reference Counted. It lets you share ownership of an object across multiple threads safely.
- **What is lock poisoning in Rust Mutexes?**
  If a thread panics while holding a Mutex lock, the lock becomes "poisoned" to prevent other threads from accessing potentially corrupted data.

---

### 9. Learning Tips
- Study Rust **Ownership and Borrowing**.
- Understand the difference between **Rc** and **Arc**.
- Practice managing thread synchronization in Rust.

---

### 10. Related Concepts
- Arc Smart Pointer
- Mutex Locks
- Thread Spawning
- Race Conditions`,

    intermediate: `### 1. Overview
A concurrent Rust queue implementation showcasing thread-safety guarantees. It wraps a vector in a Mutex for synchronization and uses Arc to share ownership across spawned threads, meeting Rust's strict safety standards.

---

### 2. Step-by-step Explanation
- **Line 5**: Wraps the vector data structure in \`Arc<Mutex<Vec<T>>>\` to allow shared, mutable access across threads.
- **Line 16-19**: Lock acquisition. Acquires the Mutex lock and handles lock poisoning by calling \`unwrap()\`.
- **Line 30-32**: Initializes Arc clones to share the queue reference with child threads.
- **Line 34-41**: Spawns OS threads that push data concurrently.
- **Line 44-46**: Joins thread handles to ensure all work completes before the main thread exits.

---

### 3. Functions & Variables
- **Struct**: \`SafeQueue\`
- **Variable**: \`data\` - Atomically reference-counted mutex container.
- **Function**: \`push\` - Mutex-locked data writer.

---

### 4. Algorithm
Implements a **Mutex-Locked Concurrent Queue**.

---

### 5. Time Complexity
- **Complexity**: $O(N)$ threads, with lock contention latency.
- **Reason**: Spawning $N$ threads is linear. Accessing the queue is protected by a Mutex, introducing lock contention overhead when threads try to write at the same time.

---

### 6. Space Complexity
- **Complexity**: $O(N)$ heap allocations.
- **Reason**: The vector dynamically resizes to store elements added by threads.

---

### 7. Possible Improvements
- **Lock-free Queues**: Leverage atomics for synchronization to avoid Mutex lock overhead.
- **Thread Pool Utilization**: Use libraries like \`tokio\` or \`rayon\` to reuse thread resources.

---

### 8. Interview Perspective
- **Explain Send and Sync markers in Rust.**
  \`Send\` indicates ownership of a type can be transferred across thread boundaries. \`Sync\` indicates it is safe to share references to the type between threads.
- **Why do we need both Arc and Mutex?**
  Arc provides shared ownership (multiple readers), while Mutex provides mutability (single writer), enabling safe shared write access.

---

### 9. Learning Tips
- Investigate **Rust compiler safety proofs**.
- Read about **deadlock scenarios** in concurrent code.
- Study **memory barriers** in multi-threaded programming.

---

### 10. Related Concepts
- Thread Safety Markers
- Smart Pointers
- Lock Contention
- OS Threading`,

    expert: `### 1. Overview
A thread-safe concurrent queue in Rust utilizing Arc and Mutex smart pointers. This implementation ensures thread safety, conforming to Rust's \`Send\` and \`Sync\` compiler constraints.

---

### 2. Step-by-step Explanation
- **Line 5**: Declares the thread-safe structure, allocating reference counts and mutual exclusion lock headers on the heap.
- **Line 17**: Acquires lock access. Calling \`unwrap()\` panics if the mutex was poisoned by another thread crashing.
- **Line 30-31**: Increments the atomic reference counter.
- **Line 34-41**: Spawns native OS threads, moving Arc clones into the thread closures.
- **Line 44-46**: Blocks the main thread execution until all handles return.

---

### 3. Functions & Variables
- **Struct**: \`SafeQueue<T>\`
- **Traits**: Enforces \`Send\` and \`Sync\` bounds.

---

### 4. Algorithm
Mutex-guarded Shared State Concurrency.

---

### 5. Time Complexity
- **Time Complexity**: $O(N \times C)$ where $N$ is thread count and $C$ is contention latency.
- **Reason**: Lock contention can turn concurrent operations into sequential ones, as only one thread can hold the lock at a time.

---

### 6. Space Complexity
- **Space Complexity**: $O(N)$ allocation on heap.
- **Reason**: Includes Arc structures, vector capacity expansions, and thread stack spaces.

---

### 7. Possible Improvements
1. **Implement Lock-Free Ring Buffers**: Bypasses OS scheduler mutex queues, utilizing CAS (Compare-And-Swap) loops.
2. **Poisoning Recovery**: Implement custom error handling instead of calling \`unwrap()\` to recover from thread crashes gracefully.

---

### 8. Interview Perspective
- **How does Mutex implementation in Rust differ from C++?**
  In Rust, the Mutex *contains* the data it protects. You cannot access the data without locking the Mutex, enforcing safety at compile time. In C++, the mutex and the data are separate, which can lead to accidental unprotected access.
- **What is lock-free programming and how does CAS work?**
  Lock-free programming avoids blocking OS locks. CAS operations update a memory address only if its value matches an expected state, retrying in a loop if it fails.

---

### 9. Learning Tips
- Study **CAS operations and atomic primitives**.
- Read **Rustonomicon chapters on Concurrency**.
- Analyze **CPU cache line invalidation rules**.

---

### 10. Related Concepts
- CAS Primatives
- Lock Poisoning
- Send/Sync Traits
- CPU Cache Contention`
  }
};

// Generates an explanation dynamically for any custom code pasted by the user
const generateDynamicExplanation = (code, language, mode) => {
  const cleanCode = code || '';
  
  // Basic code parsing
  const lines = cleanCode.split('\n');
  const totalLines = lines.length;
  
  // Extract functions
  const functionRegexes = [
    /(?:function\s+(\w+)\s*\(|(\w+)\s*:=\s*func)/, // JS/Go
    /(?:def\s+(\w+)\s*\(|def\s+(\w+)\s*:)/,       // Python
    /(?:fn\s+(\w+)\s*\(|fn\s+(\w+)\s*<)/,          // Rust
    /(?:(?:public|private|protected|static|\s) +[\w\<\>\[\]]+\s+(\w+)\s*\([^)]*\)\s*\{)/, // Java/C++
    /(?:(\w+)\s*\([^)]*\)\s*\{)/                   // C/C++ general
  ];
  
  const foundFunctions = [];
  lines.forEach((line) => {
    for (const regex of functionRegexes) {
      const match = line.match(regex);
      if (match) {
        const name = match[1] || match[2] || match[3] || match[4];
        if (name && !foundFunctions.includes(name) && name !== 'if' && name !== 'for' && name !== 'while' && name !== 'switch') {
          foundFunctions.push(name);
        }
      }
    }
  });

  // Check loops/concurrency
  const hasLoops = cleanCode.includes('for') || cleanCode.includes('while') || cleanCode.includes('.forEach') || cleanCode.includes('.map(');
  const hasRecursion = foundFunctions.some(fnName => cleanCode.split(fnName).length > 2);
  const hasConcurrency = cleanCode.includes('go ') || cleanCode.includes('thread') || cleanCode.includes('async') || cleanCode.includes('Mutex') || cleanCode.includes('channel');
  const hasPointers = cleanCode.includes('*') || cleanCode.includes('&') || cleanCode.includes('->');
  const hasDynamicProgramming = cleanCode.includes('memo') || cleanCode.includes('dp') || cleanCode.includes('cache');

  // Related concept tags
  const tags = [];
  if (hasLoops) tags.push('Loops');
  if (hasRecursion) tags.push('Recursion');
  if (hasConcurrency) tags.push('Concurrency');
  if (hasPointers) tags.push('Pointers');
  if (hasDynamicProgramming) tags.push('Dynamic Programming');
  if (cleanCode.toLowerCase().includes('search')) tags.push('Searching');
  if (cleanCode.toLowerCase().includes('sort')) tags.push('Sorting');
  if (tags.length === 0) tags.push('Basic Syntax', 'Control Flow');

  // Determine complexity guess
  let timeComplexity = 'O(1)';
  let timeReason = 'The code contains simple linear execution steps with no loops or recursive paths.';
  let spaceComplexity = 'O(1)';
  let spaceReason = 'Memory usage is minimal, storing only primitive variables in stack frames.';

  if (hasRecursion) {
    timeComplexity = 'O(2^n) or O(d)';
    timeReason = 'The code utilizes recursive branching, which can lead to exponential time behavior depending on branching factors.';
    spaceComplexity = 'O(d)';
    spaceReason = 'Determined by the recursion tree stack depth.';
  } else if (hasLoops) {
    const splitFor = cleanCode.split('for').length - 1;
    const splitWhile = cleanCode.split('while').length - 1;
    if (splitFor + splitWhile > 1) {
      timeComplexity = 'O(n^2)';
      timeReason = 'Contains nested loops, executing calculations proportionally to the square of the input size.';
    } else {
      timeComplexity = 'O(n)';
      timeReason = 'Iterates over elements in a single loop traversal.';
    }
  }

  const uppercaseLang = language.toUpperCase();

  const beginner = `### 1. Overview
This is a custom ${uppercaseLang} code file consisting of ${totalLines} lines. It uses a structured approach to run calculations, utilizing the basic principles of the ${language} runtime.

---

### 2. Step-by-step Explanation
${foundFunctions.length > 0 ? foundFunctions.map((fn, idx) => `- **Function definition**: Found custom function \`${fn}\` on line ${idx + 1}. This serves as a main execution block in this code snippet.` ).join('\n') : '- **Code Execution Flow**: Runs sequentially from the first line down. No complex custom helper functions were detected.'}
- **Control Flow**: The script uses typical variable storage and conditional branches to manage program state.
${hasLoops ? '- **Repetitive Execution**: A loop (\`for\` or \`while\`) is utilized to run code blocks repeatedly until a specific condition is met.' : ''}
${hasConcurrency ? '- **Parallel Execution**: Implements concurrent paths to speed up tasks by doing them at the same time.' : ''}

---

### 3. Functions & Variables
${foundFunctions.length > 0 ? foundFunctions.map(fn => `- **Function**: \`${fn}\`
  - **Purpose**: Custom function to execute tasks.
  - **Inputs**: Custom parameters.`).join('\n') : '*No explicit function blocks detected.*'}
- **Variables**: Dynamic variables are declared to store values in working memory.

---

### 4. Algorithm
The algorithm performs operations sequentially. It manages state using variables and conditions.
${hasLoops ? '- **Iteration Pattern**: Loops through datasets to process elements one by one.' : ''}
${hasRecursion ? '- **Recursion Pattern**: Calls itself to solve smaller pieces of the problem.' : ''}

---

### 5. Time Complexity
- **Time Complexity**: ${timeComplexity}
- **Reason**: ${timeReason}

---

### 6. Space Complexity
- **Space Complexity**: ${spaceComplexity}
- **Reason**: ${spaceReason}

---

### 7. Possible Improvements
1. **Structured Layout**: Wrap loose calculations into dedicated functions to keep code clean and reusable.
2. **Comment Code**: Add clear comments explaining what each step does.
3. **Handle Errors**: Use try/except or if-checks to prevent the code from crashing when unexpected inputs occur.

---

### 8. Interview Perspective
- **What is the purpose of this script?**
  To perform calculations or manage states based on developer instructions.
- **Can the speed of this code be improved?**
  Yes, by replacing loops with math equations or using cached values.

---

### 9. Learning Tips
- Study core syntax structures of **${uppercaseLang}**.
- Read about basic **data structures** (like arrays and lists).
- Practice writing reusable functions.

---

### 10. Related Concepts
${tags.map(tag => `- ${tag}`).join('\n')}`;

  const intermediate = `### 1. Overview
A custom ${uppercaseLang} implementation containing ${totalLines} lines. It establishes basic operational logical boundaries, utilizing modular function definitions and flow checks.

---

### 2. Step-by-step Explanation
${foundFunctions.length > 0 ? foundFunctions.map(fn => `- **Declaration of \`${fn}\`**: Registers a functional entry point for processing operations.` ).join('\n') : '- **Sequential Execution Flow**: Processes operations in the root namespace.'}
${hasLoops ? '- **Iterative Loop Block**: Loops through calculations using range-based iterations.' : ''}
${hasRecursion ? '- **Recursive Branching**: Solves problems recursively, allocating stack space for child calls.' : ''}
- **Exit Code Handler**: Returns calculation values or exits.

---

### 3. Functions & Variables
${foundFunctions.length > 0 ? foundFunctions.map(fn => `- **Function**: \`${fn}\`
  - **Inputs**: Unspecified type tokens.
  - **Returns**: Evaluated statements.`).join('\n') : '*No explicit function interfaces detected.*'}
- **Scope Variables**: Scoped locally to their parent blocks.

---

### 4. Algorithm
The program implements sequential logic.
${hasLoops ? '- **Linear Scan**: Iterates through datasets to update state.' : ''}
${hasRecursion ? '- **Branching recursion**: Divides problems into subproblems.' : ''}

---

### 5. Time Complexity
- **Time Complexity**: ${timeComplexity}
- **Reason**: ${timeReason}

---

### 6. Space Complexity
- **Space Complexity**: ${spaceComplexity}
- **Reason**: ${spaceReason}

---

### 7. Possible Improvements
1. **Type Definition**: Add strict type checks to improve compile-time safety.
2. **Optimize Iteration**: Avoid doing the same calculations inside loops.
3. **Use Library Functions**: Replace custom loops with optimized built-in language library functions.

---

### 8. Interview Perspective
- **How would you test this code?**
  Write unit tests with edge cases (like empty arrays or large inputs) to verify correctness.
- **Is this code thread-safe?**
  ${hasConcurrency ? 'Yes, concurrent mechanisms are used, but verify lock configurations.' : 'No, sharing these states between multiple threads without locks could cause issues.'}

---

### 9. Learning Tips
- Investigate **Big-O efficiency analysis** frameworks.
- Study language-specific **best practices** and style guides.
- Understand compiled vs interpreted performance profiles.

---

### 10. Related Concepts
${tags.map(tag => `- ${tag}`).join('\n')}`;

  const expert = `### 1. Overview
A custom ${uppercaseLang} module. It implements specific execution logic, managing registers and scopes according to ${uppercaseLang} system standards.

---

### 2. Step-by-step Explanation
${foundFunctions.length > 0 ? foundFunctions.map(fn => `- **Initialization of \`${fn}\`**: Reserves stack frame entries and registers arguments.` ).join('\n') : '- **Sequential Root execution**: Runs directly in the global scope namespace.'}
${hasLoops ? '- **Iterative block**: Traverses memory ranges or collections sequentially.' : ''}
${hasRecursion ? '- **Self-referential recursive call**: Invokes self-calls, risking stack overflow if base cases are missed.' : ''}

---

### 3. Functions & Variables
${foundFunctions.length > 0 ? foundFunctions.map(fn => `- **Function signature**: \`${fn}\`
  - **Return type**: Inferred or static value.
  - **Complexity footprint**: Highly dependent on parameter sizes.`).join('\n') : '*No explicit function signatures detected.*'}
- **State references**: Allocated in local execution frames.

---

### 4. Algorithm
${hasLoops ? '- **Linear search/copy loop**: Sequentially access collections.' : ''}
${hasRecursion ? '- **Divide and conquer**: Recursively evaluates call branches.' : ''}
- **Fallback flow**: Fallback calculations when conditions are not met.

---

### 5. Time Complexity
- **Time Complexity**: ${timeComplexity}
- **Reason**: ${timeReason}

---

### 6. Space Complexity
- **Space Complexity**: ${spaceComplexity}
- **Reason**: ${spaceReason}

---

### 7. Possible Improvements
1. **Memory Buffering**: Use buffering patterns to optimize I/O performance.
2. **Minimize Allocations**: Reuse heap allocations to reduce garbage collection overhead.
3. **Asynchronous I/O**: Use async/await tasks to prevent blocking main threads.

---

### 8. Interview Perspective
- **Discuss potential memory issues in this code.**
  Analyze how loops or recursions affect stack frames and heap allocations.
- **Explain compilation optimizations for this pattern.**
  Modern compilers optimize loops using techniques like loop unrolling and inline function expansion.

---

### 9. Learning Tips
- Study **low-level execution flows** (stack frames, CPU caches).
- Read about **compiler optimization** techniques.
- Explore **design patterns** for scalability.

---

### 10. Related Concepts
${tags.map(tag => `- ${tag}`).join('\n')}`;

  if (mode === 'beginner') return beginner;
  if (mode === 'intermediate') return intermediate;
  return expert;
};

const ExplainCode = () => {
  const fileInputRef = useRef(null);
  
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [mode, setMode] = useState('intermediate'); // beginner, intermediate, expert
  
  const [analyzing, setAnalyzing] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [explanation, setExplanation] = useState('');
  
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  
  // Set default code when language changes, if code is empty or matching a template
  useEffect(() => {
    // MonacoEditorWrapper automatically populates templates, but we keep sync here
  }, [language]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const loadExample = (lang) => {
    setLanguage(lang);
    // Let Monaco editor load the template, or force set it
    const wrapperTemplates = {
      javascript: `// SQL Injection risk and poor async error management
async function getUserData(userId, dbConnection) {
  const query = "SELECT * FROM users WHERE id = '" + userId + "'"; // Vulnerability: SQL Injection
  
  try {
    const user = await dbConnection.execute(query);
    
    // Performance: Iterating array rather than map-accessing or querying
    let roles = [];
    const allRoles = await dbConnection.execute("SELECT * FROM roles");
    for (let i = 0; i < allRoles.length; i++) {
      if (allRoles[i].userId === user.id) {
        roles.push(allRoles[i]);
      }
    }
    
    user.roles = roles;
    return user;
  } catch(e) {
    // Bad Practice: Swallowing exceptions silently
    console.log("error");
  }
}`,
      python: `def calculate_fibonacci(n):
    # Naive recursive algorithm (O(2^n))
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

val = input("Enter number: ")
print("Fibonacci result:", calculate_fibonacci(int(val)))`,
      cpp: `#include <iostream>
using namespace std;

class DataProcessor {
public:
    int* dataBuffer;
    
    DataProcessor(int size) {
        dataBuffer = new int[size]; // Allocated raw pointer
    }
    
    // Missing destructor! (Memory Leak)
    
    void processData(char* input) {
        char buffer[10];
        strcpy(buffer, input); // Vulnerability: Buffer overflow risk
        cout << "Processing: " << buffer << endl;
    }
};

int main() {
    DataProcessor* proc = new DataProcessor(100);
    proc->processData("This is a very long string that will overflow the buffer!");
    return 0;
}`,
      java: `import java.util.*;

public class InventoryManager {
    private static List<Object> cache = new ArrayList<>();
    
    public void addItem(String item) {
        cache.add(item); // Items are added but never evicted (Memory Leak)
    }
    
    public void processInventory(String data) {
        String report = "";
        for (int i = 0; i < 1000; i++) {
            report += data + " Index: " + i + "\\n"; // Slow string concatenation
        }
        System.out.println(report);
    }
}`,
      go: `package main

import (
	"fmt"
	"sync"
)

// Concurrent worker pool example in Go
func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	for j := range jobs {
		fmt.Printf("worker %d processing job %d\n", id, j)
		results <- j * 2
	}
}

func main() {
	const numJobs = 5
	jobs := make(chan int, numJobs)
	results := make(chan int, numJobs)

	var wg sync.WaitGroup
	for w := 1; w <= 3; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}

	for j := 1; j <= numJobs; j++ {
		jobs <- j
	}
	close(jobs)

	go func() {
		wg.Wait()
		close(results)
	}()

	for res := range results {
		fmt.Printf("Result: %d\\n", res)
	}
}`,
      rust: `// Rust implementation of a thread-safe Queue using Arc and Mutex
use std::sync::{Arc, Mutex};
use std::thread;

struct SafeQueue<T> {
    data: Arc<Mutex<Vec<T>>>,
}

impl<T> SafeQueue<T> {
    fn new() -> Self {
        SafeQueue {
            data: Arc::new(Mutex::new(Vec::new())),
        }
    }

    fn push(&self, item: T) {
        let mut data = self.data.lock().unwrap();
        data.push(item);
    }

    fn pop(&self, item: T) -> Option<T> {
        let mut data = self.data.lock().unwrap();
        data.pop()
    }
}`
    };
    if (wrapperTemplates[lang]) {
      setCode(wrapperTemplates[lang]);
    }
  };

  const handleExplainCode = () => {
    if (!code.trim()) return;

    setAnalyzing(true);
    setExplanation('');
    
    const steps = [
      'Reading source code structure...',
      'Mapping language syntax keywords...',
      'Deconstructing algorithm architecture...',
      'Calculating time & space complexity values...',
      'Generating explanations for ' + mode + ' mode...',
      'Formatting markdown response details...'
    ];

    let currentStep = 0;
    setProgressText(steps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setProgressText(steps[currentStep]);
      } else {
        clearInterval(interval);
        setAnalyzing(false);
        
        // Generate actual explanation
        const isPredefined = checkIfPredefined(code, language);
        if (isPredefined && predefinedExplanations[language.toLowerCase()] && predefinedExplanations[language.toLowerCase()][mode]) {
          setExplanation(predefinedExplanations[language.toLowerCase()][mode]);
        } else {
          setExplanation(generateDynamicExplanation(code, language, mode));
        }
      }
    }, 850);
  };

  const checkIfPredefined = (c, lang) => {
    const cleanC = c.trim().replace(/\s+/g, '');
    if (!cleanC) return false;
    
    // Check if it matches typical code structure of our templates
    if (lang === 'javascript' && cleanC.includes('getUserData')) return true;
    if (lang === 'python' && cleanC.includes('calculate_fibonacci')) return true;
    if (lang === 'cpp' && cleanC.includes('DataProcessor')) return true;
    if (lang === 'java' && cleanC.includes('InventoryManager')) return true;
    if (lang === 'go' && cleanC.includes('worker')) return true;
    if (lang === 'rust' && cleanC.includes('SafeQueue')) return true;
    
    return false;
  };

  // Regeneration trigger
  const handleRegenerate = () => {
    handleExplainCode();
  };

  const handleClear = () => {
    if (window.confirm('Clear workspace code and explanation?')) {
      setCode('');
      setExplanation('');
    }
  };

  // Upload file action
  const handleUploadFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Detect language from extension
    const extension = file.name.split('.').pop().toLowerCase();
    const extensionMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'javascript',
      'tsx': 'javascript',
      'py': 'python',
      'cpp': 'cpp',
      'h': 'cpp',
      'hpp': 'cpp',
      'cc': 'cpp',
      'c': 'c',
      'java': 'java',
      'go': 'go',
      'rs': 'rust',
      'sql': 'sql'
    };
    if (extensionMap[extension]) {
      setLanguage(extensionMap[extension]);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result);
    };
    reader.readAsText(file);
  };

  // Paste code helper
  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCode(text);
      }
    } catch (err) {
      alert('Failed to read from clipboard. Please paste code manually.');
    }
  };

  // Copy Actions
  const copyMarkdown = () => {
    navigator.clipboard.writeText(explanation);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const copyPlainExplanation = () => {
    // Strip markdown formatting simple approach
    const stripped = explanation.replace(/[#*`_-]/g, '');
    navigator.clipboard.writeText(stripped);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // PDF Download Trigger
  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    const styledHtml = `
      <html>
        <head>
          <title>AI Code Explanation - DevReview AI</title>
          <style>
            body {
              font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #111827;
              line-height: 1.6;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              color: #7C3AED;
              font-size: 28px;
              border-bottom: 2px solid #E5E7EB;
              padding-bottom: 12px;
              margin-bottom: 24px;
            }
            h3 {
              color: #1F2937;
              font-size: 18px;
              margin-top: 28px;
              border-bottom: 1px solid #F3F4F6;
              padding-bottom: 6px;
            }
            hr {
              border: 0;
              border-top: 1px solid #E5E7EB;
              margin: 24px 0;
            }
            pre {
              background: #F3F4F6;
              padding: 12px;
              border-radius: 8px;
              overflow-x: auto;
              font-family: monospace;
              font-size: 13px;
            }
            code {
              font-family: monospace;
              background: #F3F4F6;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 13px;
            }
            ul, ol {
              padding-left: 20px;
            }
            li {
              margin-bottom: 8px;
            }
          </style>
        </head>
        <body>
          <h1>AI Code Explanation Report</h1>
          <p><strong>Language:</strong> ${language.toUpperCase()} | <strong>Target Audience:</strong> ${mode.toUpperCase()} Mode</p>
          <hr />
          ${explanation
            .replace(/### (.*)/g, '<h3>$1</h3>')
            .replace(/---/g, '<hr />')
            .replace(/\n/g, '<br />')}
        </body>
      </html>
    `;
    printWindow.document.write(styledHtml);
    printWindow.document.close();
    printWindow.focus();
    // Allow rendering before calling print dialog
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // Re-generate if mode changes and explanation exists
  useEffect(() => {
    if (explanation) {
      handleExplainCode();
    }
  }, [mode]);

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pb-4 border-b border-gray-100/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-black text-[#111827] flex items-center gap-2">
            <BookOpen className="text-primary" size={22} />
            AI Code Explanation
          </h1>
          <p className="text-[#6B7280] text-xs mt-1">
            Paste any code and let AI explain it in simple or technical language.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-white/40 border border-white/50 rounded-xl p-1 shadow-sm backdrop-blur-sm">
          {['beginner', 'intermediate', 'expert'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setMode(lvl)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                mode === lvl 
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white shadow-sm' 
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel - Code Input Workspace */}
        <div className="lg:col-span-6 space-y-5">
          <div className="glass-card border border-white/35 p-6 shadow-sm space-y-4">
            
            {/* Toolbar: Language & Load Templates */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">Language</span>
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="px-3.5 py-1.5 rounded-xl border bg-white/40 border-white/50 text-[#111827] focus:bg-white focus:outline-none focus:border-primary/45 text-xs font-bold cursor-pointer transition-all shadow-sm"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                </select>
              </div>

              {/* Load Templates */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#6B7280] mr-1">Load Example:</span>
                {['javascript', 'python', 'cpp', 'java', 'go', 'rust'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => loadExample(lang)}
                    className="px-2 py-1 bg-white/40 border border-white/50 hover:bg-white text-[9px] font-bold text-[#6B7280] hover:text-[#111827] rounded-lg transition-all shadow-sm cursor-pointer uppercase"
                  >
                    {lang === 'javascript' ? 'JS' : lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Monaco Code Editor Wrapper */}
            <div className="rounded-[20px] overflow-hidden border border-white/30 shadow-md">
              <MonacoEditorWrapper
                language={language}
                code={code}
                setCode={setCode}
              />
            </div>

            {/* Action Control Panel */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              
              {/* Utility Tools */}
              <div className="flex items-center gap-2">
                
                {/* Upload File */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".js,.jsx,.ts,.tsx,.py,.cpp,.h,.hpp,.java,.go,.rs,.txt"
                />
                <button
                  onClick={handleUploadFile}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white bg-white/60 hover:bg-white text-[10px] font-bold text-[#6B7280] hover:text-[#111827] transition-all cursor-pointer shadow-sm hover:border-[#7C3AED]/20"
                  title="Upload Code File"
                >
                  <Upload size={13} />
                  <span>Upload File</span>
                </button>

                {/* Paste from Clipboard */}
                <button
                  onClick={handlePasteCode}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white bg-white/60 hover:bg-white text-[10px] font-bold text-[#6B7280] hover:text-[#111827] transition-all cursor-pointer shadow-sm hover:border-[#7C3AED]/20"
                  title="Paste Code"
                >
                  <Clipboard size={13} />
                  <span>Paste Code</span>
                </button>
              </div>

              {/* Action Triggers */}
              <div className="flex items-center gap-2">
                
                {/* Clear */}
                <button
                  onClick={handleClear}
                  className="p-2.5 rounded-xl border border-white bg-white/60 hover:bg-white text-rose-500 hover:text-rose-600 transition-all cursor-pointer shadow-sm hover:border-rose-200"
                  title="Clear Workspace"
                >
                  <Trash2 size={14} />
                </button>

                {/* Explain */}
                <button
                  onClick={handleExplainCode}
                  disabled={!code.trim() || analyzing}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md active:translate-y-px cursor-pointer ${
                    !code.trim() 
                      ? 'bg-gray-300 shadow-none cursor-not-allowed' 
                      : 'bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:shadow-lg hover:shadow-primary/10'
                  }`}
                >
                  <Brain size={12} fill={code.trim() ? "white" : "transparent"} />
                  <span>Explain Code</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Right Panel - AI Explanation Report */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            
            {/* Loading / Generating Skeleton */}
            {analyzing && (
              <motion.div
                key="analyzing-state"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="glass-card border border-white/35 p-8 shadow-sm flex flex-col justify-center items-center h-[650px] space-y-6 text-center"
              >
                <div className="relative flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                  <Sparkles size={20} className="absolute text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm text-[#111827]">Gemini Engine Synthesizing</h3>
                  <p className="text-[11px] text-[#6B7280] font-semibold animate-pulse">{progressText}</p>
                </div>
                
                {/* Skeleton Card lines representation */}
                <div className="w-full space-y-3.5 pt-4">
                  <div className="h-3 w-1/4 bg-gray-200/50 rounded-full animate-pulse"></div>
                  <div className="h-2 w-full bg-gray-150/40 rounded-full animate-pulse"></div>
                  <div className="h-2 w-5/6 bg-gray-150/40 rounded-full animate-pulse"></div>
                  <div className="h-2 w-4/5 bg-gray-150/40 rounded-full animate-pulse"></div>
                  <div className="h-3 w-1/3 bg-gray-200/50 rounded-full animate-pulse pt-4"></div>
                  <div className="h-2 w-11/12 bg-gray-150/40 rounded-full animate-pulse"></div>
                  <div className="h-2 w-full bg-gray-150/40 rounded-full animate-pulse"></div>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {!analyzing && !explanation && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="glass-card border border-white/35 p-12 shadow-sm flex flex-col justify-center items-center h-[650px] space-y-5 text-center"
              >
                <div className="p-4 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/15 text-primary flex items-center justify-center shadow-inner">
                  <Brain size={32} className="animate-pulse" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="font-extrabold text-sm text-[#111827]">Ready for Explanation</h3>
                  <p className="text-[11px] text-[#6B7280] font-semibold leading-relaxed">
                    Select a language template, paste your custom script, or upload a code file and click **Explain Code** to receive deep logical breakdowns.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Generated Explanation Content Card */}
            {!analyzing && explanation && (
              <motion.div
                key="content-state"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="glass-card border border-white/35 shadow-sm overflow-hidden flex flex-col h-[650px] relative"
              >
                {/* Header toolbar within report */}
                <div className="p-4 border-b border-gray-100/40 bg-white/40 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-primary animate-pulse" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#111827]">
                      AI Explanation Report
                    </span>
                  </div>

                  {/* Header Utility Buttons */}
                  <div className="flex items-center gap-1.5">
                    
                    {/* Copy Plain Text */}
                    <button
                      onClick={copyPlainExplanation}
                      className="p-2 rounded-lg border border-white bg-white/60 hover:bg-white text-[#6B7280] hover:text-[#111827] transition-all cursor-pointer shadow-sm relative group"
                      title="Copy Plain Text"
                    >
                      {copiedText ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all rounded bg-gray-900/90 text-[8px] font-bold text-white px-1.5 py-0.5 whitespace-nowrap shadow">
                        Copy text
                      </span>
                    </button>

                    {/* Copy Markdown */}
                    <button
                      onClick={copyMarkdown}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white bg-white/60 hover:bg-white text-[9px] font-bold text-[#6B7280] hover:text-[#111827] transition-all cursor-pointer shadow-sm relative group"
                      title="Copy Markdown"
                    >
                      {copiedMd ? (
                        <>
                          <Check size={11} className="text-emerald-500" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Code size={11} />
                          <span>Copy Markdown</span>
                        </>
                      )}
                    </button>

                    {/* Download PDF */}
                    <button
                      onClick={handleDownloadPDF}
                      className="p-2 rounded-lg border border-white bg-white/60 hover:bg-white text-[#6B7280] hover:text-[#111827] transition-all cursor-pointer shadow-sm"
                      title="Download PDF"
                    >
                      <Download size={12} />
                    </button>

                    {/* Regenerate */}
                    <button
                      onClick={handleRegenerate}
                      className="p-2 rounded-lg border border-white bg-white/60 hover:bg-white text-[#6B7280] hover:text-[#111827] transition-all cursor-pointer shadow-sm"
                      title="Regenerate Explanation"
                    >
                      <RotateCcw size={12} />
                    </button>

                  </div>
                </div>

                {/* Explanation Content Scroll Body */}
                <div className="p-6 overflow-y-auto flex-1 text-left prose prose-sm max-w-none text-[#111827] space-y-4">
                  <ReactMarkdown 
                    components={{
                      h3: ({ node, ...props }) => (
                        <h3 className="text-sm font-black text-[#111827] border-b border-gray-100/50 pb-2 pt-4 flex items-center gap-1.5" {...props} />
                      ),
                      hr: () => <hr className="border-t border-gray-150/40 my-4" />,
                      p: ({ node, ...props }) => <p className="text-[11px] font-semibold text-[#4B5563] leading-relaxed" {...props} />,
                      li: ({ node, ...props }) => <li className="text-[11px] font-semibold text-[#4B5563] mb-1.5" {...props} />,
                      code: ({ node, inline, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline ? (
                          <pre className="p-3.5 bg-gray-50 border border-gray-150/30 rounded-xl overflow-x-auto my-2 text-[10px] font-mono text-[#111827] leading-normal" {...props}>
                            <code>{children}</code>
                          </pre>
                        ) : (
                          <code className="px-1.5 py-0.5 bg-gray-50 border border-gray-150/30 rounded-md text-[10px] font-mono text-primary font-bold" {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {explanation}
                  </ReactMarkdown>
                </div>

                {/* Bottom Footer Section */}
                <div className="p-4 border-t border-gray-100/40 bg-white/40 shrink-0 flex justify-between items-center text-[10px] text-[#6B7280] font-semibold">
                  <span>Gemini Explanation Core v1.2</span>
                  <div className="flex items-center gap-1.5">
                    <span className="capitalize">{mode} Audience</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};

export default ExplainCode;
