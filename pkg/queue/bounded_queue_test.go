package queue

import (
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestBoundedQueue(t *testing.T) {
	queue, _ := NewBoundedQueue(1)
	assert.Equal(t, 0, len(queue.items))

	recorder := newConsumersRecorder(t)
	queue.StartConsumers(func(item interface{}) {
		recorder.record(item.(string))
	}, 1)

	assert.True(t, queue.Enqueue("foo"))
	recorder.assertRecordedValue("foo")

	assert.Equal(t, 0, len(queue.items))
	assert.ElementsMatch(t, []string{"foo"}, recorder.recorded)
}

type consumersRecorder struct {
	t        *testing.T
	mu       sync.Mutex
	recorded []string
}

func newConsumersRecorder(t *testing.T) *consumersRecorder {
	return &consumersRecorder{t: t}
}

func (r *consumersRecorder) record(item string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.recorded = append(r.recorded, item)
}

func (r *consumersRecorder) assertRecordedValue(expectedValue string) {
	assert.Eventually(
		r.t,
		func() bool { return r.isValueRecorded(expectedValue) },
		3*time.Second,
		10*time.Millisecond,
	)
}

func (r *consumersRecorder) isValueRecorded(value string) bool {
	for _, recordedValue := range r.recorded {
		if recordedValue == value {
			return true
		}
	}
	return false
}

func TestInvalidQueueCapacity(t *testing.T) {
	invalidCapacities := []int{0, -1}
	for _, capacity := range invalidCapacities {
		_, err := NewBoundedQueue(capacity)
		assert.ErrorIs(t, err, errInvalidCapacity)
	}

	validCapacity := 1
	_, err := NewBoundedQueue(validCapacity)
	assert.NoError(t, err)
}

func TestFullQueueEnqueue(t *testing.T) {
	queue, _ := NewBoundedQueue(1)

	assert.True(t, queue.Enqueue("foo"))
	assert.False(t, queue.Enqueue("bar"))
	assert.Equal(t, 1, len(queue.items))

	recorder := newConsumersRecorder(t)
	queue.StartConsumers(func(item interface{}) {
		recorder.record(item.(string))
	}, 1)

	recorder.assertRecordedValue("foo")
	assert.Equal(t, 0, len(queue.items))

	assert.True(t, queue.Enqueue("baz"))
	recorder.assertRecordedValue("baz")
	assert.Equal(t, 0, len(queue.items))

	assert.ElementsMatch(t, []string{"foo", "baz"}, recorder.recorded)
}

func TestStoppedQueueEnqueue(t *testing.T) {
	queue, _ := NewBoundedQueue(1)
	assert.True(t, queue.Enqueue("foo"))
	queue.Stop()
	assert.False(t, queue.Enqueue("bar"))
}

func TestGracefulConsumersStop(t *testing.T) {
	queue, _ := NewBoundedQueue(3)

	recorder := newConsumersRecorder(t)
	queue.StartConsumers(func(item interface{}) {
		time.Sleep(1 * time.Second)
		recorder.record(item.(string))
	}, 1)

	queue.Enqueue("foo")
	queue.Enqueue("bar")
	queue.Enqueue("baz")

	queue.Stop()

	assert.ElementsMatch(t, []string{"foo", "bar", "baz"}, recorder.recorded)
	assert.Equal(t, 0, len(queue.items))
}
