package es


// SpanWriter is a wrapper around elastic.Client
type SpanWriter struct {
	client           es.Client
	logger           *zap.Logger
	writerMetrics    spanWriterMetrics // TODO: build functions to wrap around each Do fn
	indexCache       cache.Cache
	serviceWriter    serviceWriter
	spanConverter    dbmodel.FromDomain
	spanServiceIndex spanAndServiceIndexFn
}

// SpanWriterParams holds constructor parameters for NewSpanWriter
type SpanWriterParams struct {
	Client                 es.Client
	Logger                 *zap.Logger
	MetricsFactory         metrics.Factory
	IndexPrefix            string
	SpanIndexDateLayout    string
	ServiceIndexDateLayout string
	AllTagsAsFields        bool
	TagKeysAsFields        []string
	TagDotReplacement      string
	Archive                bool
	UseReadWriteAliases    bool
	ServiceCacheTTL        time.Duration
	IndexCacheTTL          time.Duration
}

// NewSpanWriter creates a new SpanWriter for use
func NewSpanWriter(p SpanWriterParams) *SpanWriter {
	serviceCacheTTL := p.ServiceCacheTTL
	if p.ServiceCacheTTL == 0 {
		serviceCacheTTL = serviceCacheTTLDefault
	}

	indexCacheTTL := p.IndexCacheTTL
	if p.ServiceCacheTTL == 0 {
		indexCacheTTL = indexCacheTTLDefault
	}

	serviceOperationStorage := NewServiceOperationStorage(p.Client, p.Logger, serviceCacheTTL)
	return &SpanWriter{
		client: p.Client,
		logger: p.Logger,
		writerMetrics: spanWriterMetrics{
			indexCreate: storageMetrics.NewWriteMetrics(p.MetricsFactory, "index_create"),
		},
		serviceWriter: serviceOperationStorage.Write,
		indexCache: cache.NewLRUWithOptions(
			5,
			&cache.Options{
				TTL: indexCacheTTL,
			},
		),
		spanConverter:    dbmodel.NewFromDomain(p.AllTagsAsFields, p.TagKeysAsFields, p.TagDotReplacement),
		spanServiceIndex: getSpanAndServiceIndexFn(p.Archive, p.UseReadWriteAliases, p.IndexPrefix, p.SpanIndexDateLayout, p.ServiceIndexDateLayout),
	}
}

// CreateTemplates creates index templates.
func (s *SpanWriter) CreateTemplates(spanTemplate, serviceTemplate, indexPrefix string) error {
	if indexPrefix != "" && !strings.HasSuffix(indexPrefix, "-") {
		indexPrefix += "-"
	}
	_, err := s.client.CreateTemplate(indexPrefix + "jaeger-span").Body(spanTemplate).Do(context.Background())
	if err != nil {
		return err
	}
	_, err = s.client.CreateTemplate(indexPrefix + "jaeger-service").Body(serviceTemplate).Do(context.Background())
	if err != nil {
		return err
	}
	return nil
}

// spanAndServiceIndexFn returns names of span and service indices
type spanAndServiceIndexFn func(spanTime time.Time) (string, string)

func getSpanAndServiceIndexFn(archive, useReadWriteAliases bool, prefix, spanDateLayout string, serviceDateLayout string) spanAndServiceIndexFn {
	if prefix != "" {
		prefix += indexPrefixSeparator
	}
	spanIndexPrefix := prefix + spanIndex
	serviceIndexPrefix := prefix + serviceIndex
	if archive {
		return func(date time.Time) (string, string) {
			if useReadWriteAliases {
				return archiveIndex(spanIndexPrefix, archiveWriteIndexSuffix), ""
			}
			return archiveIndex(spanIndexPrefix, archiveIndexSuffix), ""
		}
	}

	if useReadWriteAliases {
		return func(spanTime time.Time) (string, string) {
			return spanIndexPrefix + "write", serviceIndexPrefix + "write"
		}
	}
	return func(date time.Time) (string, string) {
		return indexWithDate(spanIndexPrefix, spanDateLayout, date), indexWithDate(serviceIndexPrefix, serviceDateLayout, date)
	}
}

// WriteSpan writes a span and its corresponding service:operation in ElasticSearch
func (s *SpanWriter) WriteSpan(_ context.Context, span *model.Span) error {
	spanIndexName, serviceIndexName := s.spanServiceIndex(span.StartTime)
	jsonSpan := s.spanConverter.FromDomainEmbedProcess(span)
	if serviceIndexName != "" {
		s.writeService(serviceIndexName, jsonSpan)
	}
	s.writeSpan(spanIndexName, jsonSpan)
	return nil
}

// Close closes SpanWriter
func (s *SpanWriter) Close() error {
	return s.client.Close()
}

func keyInCache(key string, c cache.Cache) bool {
	return c.Get(key) != nil
}

func writeCache(key string, c cache.Cache) {
	c.Put(key, key)
}

func (s *SpanWriter) writeService(indexName string, jsonSpan *dbmodel.Span) {
	s.serviceWriter(indexName, jsonSpan)
}

func (s *SpanWriter) writeSpan(indexName string, jsonSpan *dbmodel.Span) {
	s.client.Index().Index(indexName).Type(spanType).BodyJson(&jsonSpan).Add()
}
