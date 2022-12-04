/**
 * Copyright 2022 Epsagon
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package queue

import (
	"errors"
	"sync"
	"time"

	"go.uber.org/atomic"
)

var (
	errInvalidCapacity     = errors.New("invalid queue capacity, must be greater than zero")
	errGracefulStopTimeout = errors.New("timed out waiting for consumers to gracefully stop")
)

// BoundedQueue is an in-memory, buffered-channel-based FIFO queue
type BoundedQueue struct {
	capacity       int
	items          chan interface{}
	stopped        *atomic.Bool
	consumerStopWG sync.WaitGroup
}

// NewBoundedQueue returns a new BoundedQueue with a given maximum capacity.
// Capacity must be greater than zero, otherwise an error is returned.
func NewBoundedQueue(capacity int) (*BoundedQueue, error) {
	if capacity < 1 {
		return nil, errInvalidCapacity
	}
	return &BoundedQueue{
		capacity: capacity,
		items:    make(chan interface{}, capacity),
		stopped:  atomic.NewBool(false),
	}, nil
}

// StartConsumers passes queued items to a consumer callback that runs on
// a given number of goroutines. Blocks until all consumers are ready.
func (q *BoundedQueue) StartConsumers(callback func(item interface{}), numWorkers int) {
	var consumerStartWG sync.WaitGroup
	for i := 0; i < numWorkers; i++ {
		consumerStartWG.Add(1)
		q.consumerStopWG.Add(1)
		go func() {
			consumerStartWG.Done()
			defer q.consumerStopWG.Done()
			for item := range q.items {
				callback(item)
			}
		}()
	}
	consumerStartWG.Wait()
}

// Enqueue adds a new item to the queue. Returns boolean indicating a success/failure.
// Failure can happen in case the queue is stopped or full (at max capacity).
func (q *BoundedQueue) Enqueue(item interface{}) bool {
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

// Stops stop all the running consumers. Blocks until all consumers have
// stopped or timeout reached. Returns an error in case of a timeout.
func (q *BoundedQueue) Stop(timeout time.Duration) error {
	done := make(chan struct{})
	go func() {
		defer close(done)
		q.stopped.Store(true)
		close(q.items)
		q.consumerStopWG.Wait()
	}()

	select {
	case <-done:
		return nil
	case <-time.After(timeout):
		return errGracefulStopTimeout
	}
}
