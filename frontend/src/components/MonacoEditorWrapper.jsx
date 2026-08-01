import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';

const templates = {
  python: `def calculate_fibonacci(n):
    # WARNING: Highly unoptimized recursive algorithm (O(2^n))
    # No type hints, poor naming, and lacks error handling
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

# Unused variables and raw input usage
val = input("Enter number: ")
print("Fibonacci result:", calculate_fibonacci(int(val)))
`,

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
}
`,

  cpp: `#include <iostream>
using namespace std;

// Performance and security problems: Memory leaks and buffer risks
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
    
    // proc is never deleted (Memory Leak)
    return 0;
}
`,

  c: `#include <stdio.h>
#include <string.h>

// Dangerous buffer issues and resource management
void copyData(char *source) {
    char dest[8];
    // Security flaw: strcpy doesn't check array bounds
    strcpy(dest, source);
    printf("Copied: %s\\n", dest);
}

int main() {
    FILE *file = fopen("nonexistent.txt", "r");
    // Bug: dereferencing file pointer without verifying if it's NULL
    char buffer[100];
    fgets(buffer, 100, file);
    
    copyData("ExtremelyLongInputString...");
    
    // Resource leak: file is never closed
    return 0;
}
`,

  java: `import java.util.*;

public class InventoryManager {
    // Memory leak potential: keeping references in static lists
    private static List<Object> cache = new ArrayList<>();
    
    public void addItem(String item) {
        cache.add(item); // Items are added but never evicted
    }
    
    // Thread safety issue on shared resources
    public void processInventory(String data) {
        // Bad standard practice: concatenating strings inside loops
        String report = "";
        for (int i = 0; i < 1000; i++) {
            report += data + " Index: " + i + "\\n"; 
        }
        System.out.println(report);
    }
}
`,

  sql: `-- Unoptimized query joining massive tables and vulnerable syntax
SELECT u.id, u.username, o.order_date, o.amount, p.product_name
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
WHERE u.status = 'active'
  AND o.amount > (
      -- Bad Practice: Uncorrelated subquery re-running for each row
      SELECT AVG(amount) FROM orders
  );
`,

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
	// Start 3 workers
	for w := 1; w <= 3; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}

	// Enqueue jobs
	for j := 1; j <= numJobs; j++ {
		jobs <- j
	}
	close(jobs)

	// Wait for workers to finish in a separate routine
	go func() {
		wg.Wait()
		close(results)
	}()

	// Collect results
	for res := range results {
		fmt.Printf("Result: %d\n", res)
	}
}
`,

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

    fn pop(&self) -> Option<T> {
        let mut data = self.data.lock().unwrap();
        data.pop()
    }
}

fn main() {
    let queue = SafeQueue::new();
    let queue_clone = Arc::new(queue);
    
    let mut handles = vec![];
    for i in 0..5 {
        let q = Arc::clone(&queue_clone);
        let handle = thread::spawn(move || {
            q.push(i);
            println!("Thread pushed: {}", i);
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }
}
`
};

const MonacoEditorWrapper = ({ language, code, setCode }) => {
  // Load language template if editor is empty or when language changes and editor contains old template
  useEffect(() => {
    const currentLangs = Object.keys(templates);
    const isTemplateOrEmpty = !code.trim() || currentLangs.some(lang => templates[lang].trim() === code.trim());
    
    if (isTemplateOrEmpty && templates[language]) {
      setCode(templates[language]);
    }
  }, [language, setCode]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const mapLanguage = (lang) => {
    switch (lang.toLowerCase()) {
      case 'cpp': return 'cpp';
      case 'c': return 'c';
      case 'java': return 'java';
      case 'javascript': return 'javascript';
      case 'python': return 'python';
      case 'sql': return 'sql';
      case 'go': return 'go';
      case 'rust': return 'rust';
      default: return 'javascript';
    }
  };

  return (
    <div className="monaco-editor-container h-[550px] shadow-sm rounded-2xl overflow-hidden border border-white/50 bg-white/40">
      <Editor
        height="100%"
        language={mapLanguage(language)}
        value={code}
        onChange={handleEditorChange}
        theme="light"
        options={{
          fontSize: 14,
          fontFamily: 'Fira Code, Source Code Pro, Consolas, Courier New, monospace',
          minimap: { enabled: true },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          padding: { top: 12, bottom: 12 },
          lineNumbers: 'on',
          folding: true,
          wordWrap: 'on',
        }}
      />
    </div>
  );
};

export default MonacoEditorWrapper;
