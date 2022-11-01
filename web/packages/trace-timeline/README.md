# Trace Timeline Components

## TracePage

In Jaeger context, the TracePage represents the top hierarchy, containing all of the elements required to display various representation of the same trace:

<p align="center">
  <img src="./img/TracePage.png" alt="TracePage" width="738">
</p>

### TracePageHeader

<p align="center">
  <img src="./img/TracePageHeader.png" alt="TracePageHeader" width="738">
</p>

### TraceTimelineViewer

<p align="center">
  <img src="./img/TraceTimelineViewer.png" alt="TraceTimelineViewer" width="738">
</p>

#### TimelineHeaderRow

<p align="center">
  <img src="./img/TimelineHeaderRow.png" alt="TimelineHeaderRow" width="738">
</p>

#### VirtualizedTraceView

<p align="center">
  <img src="./img/VirtualizedTraceView.png" alt="VirtualizedTraceView" width="738">
</p>

## Redux and React Versioning + Refactoring

Most of the PR's heavy lifting stems from upgrading react & redux versions. Thus, the current PR currently working with an updated React version (18.x.x) and @reduxjs/toolkit.

## Changes Markup

Changes are marked as:
`// ** CHANGED <description> **`

## Suggestion

- VirtulizedTraceView has yet to be imported - once resolving the redux issues with the TimelineHeaderRow, it should be easier to keep importing parts of the Jaeger project incliding the TracePageHeader and the VirtualizedTraceView. Also, currently there is a compilation error due to SpanTreeOffset which is supposed to be default exported using the connect function from 'react-redux'.

- Using a better approach for the redux parts of the project by compartmentalization the state - for example, TimelineHeaderRow requires actions associated with:

```
setSpanNameColumnWidth, expandAll, expandOne, collapseAll, collapseOne
```

Hence, i declared an action type of HeaderRowActions:

```
export type HeaderRowActions = ReturnType<
typeof setSpanNameColumnWidthAction |
typeof expandAllAction |
typeof expandOneAction |
typeof collapseAllAction |
typeof collapseOneAction>;
```

Same can be made for

```
detailLogItemToggle, detailLogsToggle, detailProcessToggle,detailReferencesToggle,detailWarningsToggle, detailStates, detailTagsToggle,detailToggle,
```
