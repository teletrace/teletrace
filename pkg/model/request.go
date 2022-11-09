package model

type Request interface {
	Validate() error
}
