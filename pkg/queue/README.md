# queue

The `queue` package provides queue related capabilities.

## BoundedQueue

`BoundedQueue` is an in-memory, fixed capacity, FIFO queue.\
It is based on Go buffered channels and allows registering multiple consumers where each runs on a different goroutine.\
The implementation is general and does not assume the type of data, therefore it can be used wherever such queue is needed.

### Usage

```go
// Maximum number of items in the queue
queueCapacity := 100

q, err := queue.NewBoundedQueue(queueCapacity)
if err != nil {
    // Invalid config (e.g. capacity < 1)
}

// Number of concurrent consumers
numConsumers := 5

// Callback to run on each item, and number of callbacks (=consumers) to run concurrently
q.StartConsumers(func(item interface{}) {
    operation(item)
}, numConsumers)

// Enqueue item
ok := q.Enqueue("foo")
if !ok {
    // Failed to add to queue due to full/stopped queue
}

// Blocks until all the consumers are stopped or timeout reached
if err := q.Stop(3 * time.Second); err != nil {
    // Failed to gracefully stop consumers
}
```
