package modeltranslator

import (
    internalspanv1 "github.com/epsagon/lupa/model/internalspan/v1"
    "sort"
    "strings"
)

func dedupSortedAttributes(attrs internalspanv1.Attributes) internalspanv1.Attributes {
    dedupedAttrs := internalspanv1.Attributes{}

    if len(attrs) == 0 {
        return attrs
    }

    prev := ""
    var attr string
    for attr = range attrs {
        if prev != "" {
            if len(prev) < len(attr) && strings.HasPrefix(attr, prev) && attr[len(prev)] == '.' {
                dedupedAttrs[prev+".value"] = attrs[attr]
            } else {
                dedupedAttrs[prev] = attrs[attr]
            }
        }
        prev = attr
    }

    dedupedAttrs[attr] = attrs[attr]

    return dedupedAttrs
}

func sortAttributes(attrs internalspanv1.Attributes) internalspanv1.Attributes {
    if len(attrs) == 0 {
        return attrs
    }

    keys := make([]string, 0, len(attrs))

    for k := range attrs {
        keys = append(keys, k)
    }
    sort.Strings(keys)

    sortedAttrs := internalspanv1.Attributes{}

    for _, k := range keys {
        sortedAttrs[k] = attrs[k]
    }
    return sortedAttrs
}
