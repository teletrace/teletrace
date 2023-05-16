/**
 * Copyright 2022 Cisco Systems, Inc.
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

package aggscontroller

import (
	"bytes"
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/teletrace/teletrace/pkg/model"
	"github.com/teletrace/teletrace/pkg/model/aggsquery/v1"
)

func Test_ParseHistogramsResponse_ValidResponse(t *testing.T) {
	responseContent := `
	{
	  "took": 1435,
	  "timed_out": false,
	  "_shards": {
		"total": 87,
		"successful": 87,
		"skipped": 0,
		"failed": 0
	  },
	  "hits": {
		"total": {
		  "value": 10000,
		  "relation": "gte"
		},
		"max_score": null,
		"hits": []
	  },
	  "aggregations": {
		"latency_percentiles": {
		  "buckets": [
			{
			  "key": 1684231800000,
			  "doc_count": 9778,
			  "latency_percentiles": {
				"values": {
				  "50.0": 6,
				  "75.0": 13.782178217821782,
				  "90.0": 26,
				  "95.0": 67.26484848484854,
				  "99.0": 43482.37333333334
				}
			  }
			},
			{
			  "key": 1684232400000,
			  "doc_count": 9921,
			  "latency_percentiles": {
				"values": {
				  "50.0": 5.410714285714286,
				  "75.0": 13,
				  "90.0": 24,
				  "95.0": 65.13311688311666,
				  "99.0": 35579.48933333333
				}
			  }
			},
			{
			  "key": 1684233000000,
			  "doc_count": 260,
			  "latency_percentiles": {
				"values": {
				  "50.0": 5,
				  "75.0": 12.5,
				  "90.0": 21,
				  "95.0": 30.5,
				  "99.0": 48.89999999999998
				}
			  }
			}
	   	  ]
	   }
     }
	}`

	req := aggsquery.HistogramsRequest{
		Timeframe: &model.Timeframe{
			StartTime: 0,
			EndTime:   0,
		},
		Interval:    600000,
		IntervalKey: "span.startTimeUnixNano",
		Aggregations: map[string]aggsquery.Aggregation{
			"latency_percentiles": {
				Func: aggsquery.PERCENTILES,
				Key:  "externalFields.durationNano",
				AggregationParameters: map[aggsquery.AggregationParameter]any{
					"percentiles": []any{50, 75, 90, 95, 99},
				},
			},
		},
	}

	buffer := bytes.NewBufferString(responseContent)
	body := make(map[string]any)
	_ = json.NewDecoder(buffer).Decode(&body)

	ac := aggsController{}
	result, err := ac.parseHistogramsResponse(body, req, nil)
	if err != nil {
		t.Fatal(err)
	}
	var expectedFirstBucket50thPercentileValue float64 = 6

	// Assert
	assert.NotNil(t, result)
	assert.Len(t, result.Histograms, 1)
	assert.Equal(t, "latency_percentiles", result.Histograms[0].HistogramLabel)
	assert.Len(t, result.Histograms[0].Buckets, 3)
	assert.Len(t, result.Histograms[0].Buckets[0].Data, 5)
	assert.Equal(t, result.Histograms[0].Buckets[0].Data.(map[string]any)["50.0"], expectedFirstBucket50thPercentileValue)
}
