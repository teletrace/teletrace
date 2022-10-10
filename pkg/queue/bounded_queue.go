package queue

import (
	"sync"

	"go.uber.org/atomic"
)

type queueItem interface{}

// BoundedQueue is an in-memory, buffered channel-based FIFO queue
type BoundedQueue struct {
	capacity int
	items    chan queueItem
	stopped  *atomic.Bool
	stopWG   sync.WaitGroup
}

// NewBoundedQueue returns a new BoundedQueue with a given maximum capacity
func NewBoundedQueue(capacity int) *BoundedQueue {
	return &BoundedQueue{
		capacity: capacity,
		items:    make(chan queueItem, capacity),
		stopped:  atomic.NewBool(false),
	}
}

// StartConsumers passes queued items to a consumer callback that runs on
// a given number of goroutines. Blocks until all consumers are ready.
func (q *BoundedQueue) StartConsumers(callback func(item queueItem), numWorkers int) {
	var startWG sync.WaitGroup
	for i := 0; i < numWorkers; i++ {
		startWG.Add(1)
		q.stopWG.Add(1)
		go func() {
			startWG.Done()
			defer q.stopWG.Done()
			for item := range q.items {
				callback(item)
			}
		}()
	}
	startWG.Wait()
}

// Produce adds new item to the queue. Returns boolean indicating a success/failure.
// Failure can happen in case the queue is stopped or full (at max capacity).
func (q *BoundedQueue) Produce(item queueItem) bool {
	if q.stopped.Load() {
		return false
	}
	select {
	case q.items <- item:
		return true
	default:
		// channel is full
		return false
	}
}

// Stops stop all the running consumers. Blocks until all consumers have stopped.
func (q *BoundedQueue) Stop() {
	q.stopped.Store(true)
	close(q.items)
	q.stopWG.Wait()
}
