# 📝 Online Assessment Collection — Java Mid/Senior Engineer

---

# 🏢 OA #1 — E-Commerce Product Company (Tiki/Shopee-style)
### Time: 90 minutes | 4 Questions

---

### Q1. [Coding] Given a list of orders with timestamps, find the peak hour with the most orders.

```
Input: ["2026-04-19 09:15", "2026-04-19 09:45", "2026-04-19 10:30",
        "2026-04-19 09:20", "2026-04-19 10:55", "2026-04-19 09:05"]
Output: "09:00-10:00" (3 orders)
```

**Answer:**
```java
public static String findPeakHour(List<String> orders) {
    Map<Integer, Integer> hourCount = new HashMap<>();

    for (String order : orders) {
        int hour = Integer.parseInt(order.substring(11, 13));
        hourCount.merge(hour, 1, Integer::sum);
    }

    int peakHour = Collections.max(hourCount.entrySet(),
            Map.Entry.comparingByValue()).getKey();

    return String.format("%02d:00-%02d:00", peakHour, peakHour + 1);
}
// Time: O(n), Space: O(24) = O(1)
```

---

### Q2. [Coding] Implement a simple LRU Cache that supports `get(key)` and `put(key, value)` in O(1).

**Answer:**
```java
class LRUCache {
    private final int capacity;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0), tail = new Node(0, 0);

    static class Node {
        int key, val;
        Node prev, next;
        Node(int k, int v) { key = k; val = v; }
    }

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node node = map.get(key);
        remove(node);
        addFirst(node);
        return node.val;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            remove(map.get(key));
        }
        Node node = new Node(key, value);
        map.put(key, node);
        addFirst(node);
        if (map.size() > capacity) {
            Node lru = tail.prev;
            remove(lru);
            map.remove(lru.key);
        }
    }

    private void remove(Node n) { n.prev.next = n.next; n.next.prev = n.prev; }
    private void addFirst(Node n) {
        n.next = head.next; n.prev = head;
        head.next.prev = n; head.next = n;
    }
}
```

---

### Q3. [SQL] Write a query to find the top 3 products by revenue in the last 30 days, including the number of orders.

**Answer:**
```sql
SELECT
    p.product_name,
    COUNT(o.id) AS total_orders,
    SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
JOIN products p ON oi.product_id = p.id
WHERE o.created_at >= CURRENT_DATE - INTERVAL '30 days'
  AND o.status = 'COMPLETED'
GROUP BY p.id, p.product_name
ORDER BY total_revenue DESC
LIMIT 3;
```

---

### Q4. [Design] Design a simple coupon/voucher system. Describe:
- Database schema
- API to apply coupon at checkout
- How to prevent a coupon from being used more than its limit

**Answer:**

**Schema:**
```sql
CREATE TABLE coupons (
    id UUID PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    discount_type VARCHAR(10),  -- 'PERCENT' or 'FIXED'
    discount_value DECIMAL(10,2),
    max_uses INT,
    current_uses INT DEFAULT 0,
    min_order_amount DECIMAL(12,2),
    valid_from TIMESTAMP,
    valid_to TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE coupon_usages (
    id UUID PRIMARY KEY,
    coupon_id UUID REFERENCES coupons(id),
    user_id BIGINT,
    order_id UUID,
    discount_amount DECIMAL(12,2),
    used_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(coupon_id, user_id)  -- each user uses coupon once
);
```

**API & preventing over-use:**
```java
@Transactional
public BigDecimal applyCoupon(String code, BigDecimal orderTotal, Long userId) {
    // Pessimistic lock to prevent race condition
    Coupon coupon = couponRepo.findByCodeForUpdate(code)
        .orElseThrow(() -> new InvalidCouponException("Invalid code"));

    // Validations
    if (!coupon.isActive()) throw new InvalidCouponException("Expired");
    if (coupon.getCurrentUses() >= coupon.getMaxUses())
        throw new InvalidCouponException("Usage limit reached");
    if (orderTotal.compareTo(coupon.getMinOrderAmount()) < 0)
        throw new InvalidCouponException("Min order not met");
    if (couponUsageRepo.existsByCouponIdAndUserId(coupon.getId(), userId))
        throw new InvalidCouponException("Already used by this user");

    // Apply discount
    BigDecimal discount = coupon.getDiscountType().equals("PERCENT")
        ? orderTotal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100))
        : coupon.getDiscountValue();

    // Atomic increment
    coupon.setCurrentUses(coupon.getCurrentUses() + 1);
    couponRepo.save(coupon);

    return discount;
}
```

Key: `SELECT ... FOR UPDATE` prevents two users from using the last coupon simultaneously.

---

# 🏗️ OA #2 — Outsourcing Company (FPT/NashTech-style)
### Time: 60 minutes | 5 Questions

---

### Q1. [Java Theory] Explain the difference between `==` and `.equals()`. When would `==` return true for Strings?

**Answer:**
- `==` compares **reference** (memory address) — are they the same object?
- `.equals()` compares **value** (content) — do they have the same characters?

```java
String a = "hello";          // String pool
String b = "hello";          // same pool reference
String c = new String("hello"); // new object on heap

a == b;       // true  — same reference in String pool
a == c;       // false — different objects
a.equals(c);  // true  — same content
```

`==` returns true for Strings when: both reference the **same String pool** object (string literals, or after `.intern()`).

---

### Q2. [Java Theory] What is the difference between `ArrayList` and `LinkedList`? When to use each?

**Answer:**

| | ArrayList | LinkedList |
|---|---|---|
| **Structure** | Dynamic array | Doubly linked list |
| **get(index)** | O(1) — direct index access | O(n) — traverse from head |
| **add(end)** | O(1) amortized | O(1) — append to tail |
| **add(middle)** | O(n) — shift elements | O(1) if you have the node |
| **remove(middle)** | O(n) — shift elements | O(1) if you have the node |
| **Memory** | Compact (contiguous array) | Extra overhead (prev/next pointers) |
| **Cache** | Cache-friendly (contiguous) | Cache-unfriendly (scattered) |

**Use ArrayList** (95% of the time): random access, iteration, most general use.
**Use LinkedList:** only if you frequently add/remove from the beginning, or need a Queue/Deque.

---

### Q3. [Coding] Reverse a string without using built-in reverse methods.

```java
public static String reverse(String s) {
    char[] chars = s.toCharArray();
    int left = 0, right = chars.length - 1;
    while (left < right) {
        char temp = chars[left];
        chars[left] = chars[right];
        chars[right] = temp;
        left++;
        right--;
    }
    return new String(chars);
}
// Time: O(n), Space: O(n) for char array
```

---

### Q4. [Coding] Check if a string has balanced brackets: `(){}[]`

```java
public static boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(') stack.push(')');
        else if (c == '{') stack.push('}');
        else if (c == '[') stack.push(']');
        else if (stack.isEmpty() || stack.pop() != c) return false;
    }
    return stack.isEmpty();
}
```

---

### Q5. [Scenario] A production API is responding slowly (p99 > 5 seconds). Describe your step-by-step investigation process.

**Answer:**

**Step 1 — Check metrics dashboard (Grafana/DataDog)**
- Is it ALL endpoints or specific ones?
- When did it start? Correlate with deployments, traffic spikes, or infrastructure changes.
- CPU/Memory of application servers — are they maxed out?

**Step 2 — Check database**
- Slow query log: any queries > 1s?
- Connection pool: are all connections used? (pool exhaustion)
- Lock waits: are queries blocked by other transactions?

**Step 3 — Check application logs**
- Look for errors, timeout exceptions, retry storms
- Check thread dump (`/actuator/threaddump`): are threads blocked/waiting?
- Check for high GC pauses (GC log)

**Step 4 — Check external dependencies**
- Is a downstream service slow? (circuit breaker dashboard)
- Network latency between services?
- DNS resolution delays?

**Step 5 — Reproduce and fix**
- If DB: add missing index, optimize query, add cache
- If thread pool: increase pool size or find the blocking call
- If external service: add timeout + circuit breaker + fallback
- If GC: tune heap size or switch to ZGC

**Step 6 — Prevent recurrence**
- Add alerting on p99 latency > 2s
- Add slow query alerting
- Add performance test to CI pipeline

---

# 💰 OA #3 — Fintech Company (MoMo/VNPay-style)
### Time: 90 minutes | 4 Questions

---

### Q1. [Coding] Implement an idempotent money transfer function. If the same request is retried, it should NOT transfer twice.

```java
@Service
public class TransferService {
    @Autowired private AccountRepository accountRepo;
    @Autowired private TransferLogRepository logRepo;

    @Transactional
    public TransferResult transfer(String idempotencyKey,
            String fromId, String toId, BigDecimal amount) {

        // 1. Check idempotency — was this request already processed?
        Optional<TransferLog> existing = logRepo.findByIdempotencyKey(idempotencyKey);
        if (existing.isPresent()) {
            return TransferResult.alreadyProcessed(existing.get());
        }

        // 2. Lock accounts in consistent order (prevent deadlock)
        String first = fromId.compareTo(toId) < 0 ? fromId : toId;
        String second = fromId.compareTo(toId) < 0 ? toId : fromId;
        Account acc1 = accountRepo.findByIdForUpdate(first);
        Account acc2 = accountRepo.findByIdForUpdate(second);

        Account from = acc1.getId().equals(fromId) ? acc1 : acc2;
        Account to = acc1.getId().equals(toId) ? acc1 : acc2;

        // 3. Validate
        if (from.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException();
        }

        // 4. Transfer
        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(amount));

        // 5. Log with idempotency key
        TransferLog log = new TransferLog(idempotencyKey, fromId, toId,
            amount, "SUCCESS", LocalDateTime.now());
        logRepo.save(log);

        return TransferResult.success(log);
    }
}
```

**Key points:**
- Idempotency key (UUID from client) prevents duplicate transfers
- Lock ordering by ID prevents deadlocks
- `@Transactional` ensures atomicity

---

### Q2. [Coding] Given a list of transactions, find pairs of potentially fraudulent transactions: same card, different cities, within 30 minutes.

```java
public static List<int[]> findSuspicious(List<Transaction> txns) {
    // Sort by card, then by time
    txns.sort((a, b) -> !a.card.equals(b.card)
        ? a.card.compareTo(b.card)
        : a.time.compareTo(b.time));

    List<int[]> suspicious = new ArrayList<>();

    for (int i = 0; i < txns.size() - 1; i++) {
        for (int j = i + 1; j < txns.size(); j++) {
            Transaction a = txns.get(i), b = txns.get(j);
            if (!a.card.equals(b.card)) break; // different card, move on

            long minutesDiff = ChronoUnit.MINUTES.between(a.time, b.time);
            if (minutesDiff > 30) break; // too far apart, move on

            if (!a.city.equals(b.city)) {
                suspicious.add(new int[]{i, j}); // same card, diff city, <30 min!
            }
        }
    }
    return suspicious;
}
```

---

### Q3. [Design] How would you ensure exactly-once processing in a payment system using Kafka?

**Answer:**

**Problem:** Kafka guarantees at-least-once delivery. A consumer crash after processing but before committing offset → message re-delivered → payment processed twice.

**Solution: Transactional outbox + idempotency**

```
1. IDEMPOTENCY KEY
   Every payment request has a unique idempotencyKey (UUID).
   Before processing, check: has this key been processed before?

   Table: processed_events
     idempotency_key VARCHAR PRIMARY KEY
     processed_at TIMESTAMP

2. TRANSACTIONAL OUTBOX PATTERN
   In a SINGLE database transaction:
     a. Check idempotency → if exists, skip
     b. Process payment (debit/credit accounts)
     c. INSERT idempotency key into processed_events
     d. COMMIT

   If consumer crashes after step (d) → Kafka re-delivers →
   step (a) detects duplicate → skip. No double payment!

3. KAFKA CONSUMER CONFIG
   enable.auto.commit = false
   Manually commit offset AFTER successful DB transaction.
```

---

### Q4. [SQL] Write a query to detect accounts with more than 5 transactions exceeding 50M VND in a single day (potential money laundering).

```sql
SELECT
    a.account_number,
    a.owner_name,
    DATE(t.created_at) AS txn_date,
    COUNT(*) AS large_txn_count,
    SUM(t.amount) AS total_amount
FROM transactions t
JOIN accounts a ON t.account_id = a.id
WHERE t.amount > 50000000  -- > 50M VND
  AND t.created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY a.account_number, a.owner_name, DATE(t.created_at)
HAVING COUNT(*) > 5
ORDER BY total_amount DESC;
```

---

# 🏥 OA #4 — HealthTech Startup
### Time: 75 minutes | 4 Questions

---

### Q1. [Coding] Merge overlapping appointment time slots.

```
Input:  [[9,10], [9,11], [14,15], [14,16], [16,17]]
Output: [[9,11], [14,17]]
```

```java
public static int[][] mergeSlots(int[][] slots) {
    Arrays.sort(slots, (a, b) -> a[0] - b[0]);
    List<int[]> merged = new ArrayList<>();
    merged.add(slots[0]);

    for (int i = 1; i < slots.length; i++) {
        int[] last = merged.get(merged.size() - 1);
        if (slots[i][0] <= last[1]) {
            last[1] = Math.max(last[1], slots[i][1]); // extend
        } else {
            merged.add(slots[i]);
        }
    }
    return merged.toArray(new int[0][]);
}
```

---

### Q2. [Coding] Implement a rate limiter: max N requests per user per minute.

```java
class RateLimiter {
    private final int maxRequests;
    private final Map<String, Queue<Long>> userRequests = new ConcurrentHashMap<>();

    RateLimiter(int maxRequests) { this.maxRequests = maxRequests; }

    public synchronized boolean allowRequest(String userId) {
        long now = System.currentTimeMillis();
        long windowStart = now - 60_000; // 1 minute ago

        Queue<Long> requests = userRequests.computeIfAbsent(userId,
            k -> new LinkedList<>());

        // Remove old requests outside window
        while (!requests.isEmpty() && requests.peek() < windowStart) {
            requests.poll();
        }

        if (requests.size() < maxRequests) {
            requests.offer(now);
            return true;  // allowed
        }
        return false; // rate limited
    }
}
```

---

### Q3. [Design] Design the database for a patient appointment booking system. Include: patients, doctors, departments, appointments, prescriptions.

```sql
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),        -- "Cardiology", "Pediatrics"
    floor INT
);

CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255),
    department_id INT REFERENCES departments(id),
    specialization VARCHAR(100),
    license_number VARCHAR(50) UNIQUE
);

CREATE TABLE doctor_schedules (
    id SERIAL PRIMARY KEY,
    doctor_id INT REFERENCES doctors(id),
    day_of_week INT,           -- 1=Mon, 7=Sun
    start_time TIME,
    end_time TIME,
    slot_duration_min INT DEFAULT 30
);

CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255),
    date_of_birth DATE,
    phone VARCHAR(20),
    email VARCHAR(255),
    id_number VARCHAR(20) UNIQUE  -- CCCD
);

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id INT REFERENCES patients(id),
    doctor_id INT REFERENCES doctors(id),
    appointment_date DATE,
    start_time TIME,
    end_time TIME,
    status VARCHAR(20) DEFAULT 'SCHEDULED',
        -- SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(doctor_id, appointment_date, start_time)  -- prevent double-booking
);

CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id),
    doctor_id INT REFERENCES doctors(id),
    patient_id INT REFERENCES patients(id),
    diagnosis TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE prescription_items (
    id SERIAL PRIMARY KEY,
    prescription_id UUID REFERENCES prescriptions(id),
    medicine_name VARCHAR(255),
    dosage VARCHAR(100),       -- "500mg"
    frequency VARCHAR(100),    -- "3 times/day"
    duration VARCHAR(50),      -- "7 days"
    quantity INT
);
```

---

### Q4. [Theory] Explain REST API best practices. Give examples of good vs bad API design.

**Answer:**

| Practice | ❌ Bad | ✅ Good |
|---|---|---|
| Use nouns, not verbs | `GET /getPatients` | `GET /patients` |
| Use HTTP methods | `POST /deletePatient/123` | `DELETE /patients/123` |
| Plural resources | `GET /patient/123` | `GET /patients/123` |
| Nested resources | `GET /getDoctorAppointments?docId=5` | `GET /doctors/5/appointments` |
| Status codes | Return 200 for everything | 201 Created, 404 Not Found, 422 Validation |
| Pagination | Return all 10K records | `GET /patients?page=0&size=20` |
| Versioning | Change API without notice | `GET /api/v1/patients` |
| Error format | `{"error": "bad"}` | `{"code": "PATIENT_NOT_FOUND", "message": "...", "timestamp": "..."}` |
| Filtering | `POST /searchPatients` | `GET /patients?status=active&department=cardiology` |

---

# 🌐 OA #5 — Big Tech / International Company
### Time: 120 minutes | 3 Questions (harder)

---

### Q1. [Coding] Implement a function that finds the shortest path in a weighted graph (Dijkstra's algorithm).

```java
public static int[] dijkstra(int[][] graph, int src) {
    int n = graph.length;
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;

    // Min-heap: [distance, node]
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, src});
    boolean[] visited = new boolean[n];

    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int u = curr[1];

        if (visited[u]) continue;
        visited[u] = true;

        for (int v = 0; v < n; v++) {
            if (graph[u][v] > 0 && !visited[v]) { // edge exists
                int newDist = dist[u] + graph[u][v];
                if (newDist < dist[v]) {
                    dist[v] = newDist;
                    pq.offer(new int[]{newDist, v});
                }
            }
        }
    }
    return dist; // dist[i] = shortest distance from src to i
}
// Time: O((V+E) log V), Space: O(V)
```

---

### Q2. [Coding] Design and implement a thread-safe bounded blocking queue.

```java
class BoundedBlockingQueue<T> {
    private final Queue<T> queue = new LinkedList<>();
    private final int capacity;
    private final Object lock = new Object();

    BoundedBlockingQueue(int capacity) {
        this.capacity = capacity;
    }

    public void put(T item) throws InterruptedException {
        synchronized (lock) {
            while (queue.size() == capacity) {
                lock.wait(); // wait until space available
            }
            queue.offer(item);
            lock.notifyAll(); // wake up consumers
        }
    }

    public T take() throws InterruptedException {
        synchronized (lock) {
            while (queue.isEmpty()) {
                lock.wait(); // wait until item available
            }
            T item = queue.poll();
            lock.notifyAll(); // wake up producers
            return item;
        }
    }

    public int size() {
        synchronized (lock) { return queue.size(); }
    }
}
```

**Key points:**
- `while` (not `if`) for condition check → handles spurious wakeups
- `notifyAll` (not `notify`) → prevents missed signals
- Could also use `ReentrantLock` + `Condition` for finer control

---

### Q3. [System Design] Design a distributed task scheduler (like cron jobs) that:
- Supports scheduling recurring tasks (every 5 min, daily at 2 AM)
- Guarantees exactly-once execution
- Scales horizontally
- Handles node failures

**Answer:**

```
┌──────────────┐     ┌──────────────┐
│  Admin API   │     │  Dashboard   │
│ (create/edit │     │ (monitor     │
│  schedules)  │     │  executions) │
└──────┬───────┘     └──────┬───────┘
       │                    │
       ▼                    ▼
┌─────────────────────────────────────┐
│           Scheduler Service          │
│  ┌─────────────┐ ┌────────────────┐ │
│  │ Schedule    │ │ Leader Election│ │
│  │ Evaluator   │ │ (ZooKeeper)   │ │
│  └──────┬──────┘ └────────────────┘ │
│         │ (only leader evaluates)    │
└─────────┼────────────────────────────┘
          │ dispatch task
          ▼
┌──────────────────┐
│      Kafka        │  task queue
│  (task dispatch)  │
└────────┬─────────┘
         │
    ┌────┼────┐
    ▼    ▼    ▼
┌──────┐┌──────┐┌──────┐
│Worker││Worker││Worker│  (horizontal scaling)
│  #1  ││  #2  ││  #3  │
└──┬───┘└──┬───┘└──┬───┘
   │       │       │
   ▼       ▼       ▼
┌──────────────────────┐
│     PostgreSQL        │
│ (task_executions log) │
│ + idempotency check   │
└───────────────────────┘
```

**Exactly-once:**
- Each scheduled execution gets a unique `execution_id = {taskId}_{scheduledTime}`
- Worker checks DB before executing: `INSERT INTO task_executions (execution_id) ON CONFLICT DO NOTHING`
- If insert succeeds → execute. If conflict → skip (already done).

**Leader election:**
- Only one Scheduler node evaluates schedules (prevents duplicate dispatching)
- ZooKeeper or Redis SETNX for leader election
- If leader dies → another node becomes leader within seconds

**Failure handling:**
- Worker crashes mid-task → Kafka re-delivers → idempotency prevents double execution
- Worker marks task as `IN_PROGRESS` with timeout. If not `COMPLETED` within timeout → re-dispatch
