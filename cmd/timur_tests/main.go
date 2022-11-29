package main

import (
	"fmt"
	"oss-tracing/plugin/spanreader/sqlite"
)

func main() {
	sqliteSpanReader, err := sqlite.NewSqliteSpanReader()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(sqliteSpanReader)
}
