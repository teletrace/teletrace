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

export const styles = {
  accordion: {
    width: "100%",
    borderRadius: "8px",
  },
  accordionSummary: {
    flexDirection: "row-reverse",
    height: "60px",
    padding: "8px 8px 8px 25px",
    borderRadius: "8px",
    backgroundColor: "#1B1C21",
    "& .MuiAccordionSummary-content": {
      margin: 0,
      alignItems: "center",
    },
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
  },
  expandedAccordion: {
    backgroundColor: "#2B2D32",
    borderRadius: "8px 8px 0 0",
  },
  expandArrowIcon: {
    color: "#FFFFFF",
    fontSize: "15px",
  },
  errorIcon: {
    width: "20px",
    height: "20px",
    color: "#EF5854",
  },
  spanMainContainer: {
    display: "flex",
    marginLeft: "36px",
    marginBottom: "8px",
  },
  spanErrorMainContainer: {
    marginLeft: "0px",
  },
  spanErrorIconContainer: {
    marginRight: "16px",
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  expandedSpanErrorContainer: {
    backgroundColor: "#3B3C42",
    flex: "1",
    width: "1px",
  },
  spanIcon: {
    width: "22px",
    height: "22px",
    margin: "0 17px 0 23px",
  },
  spanName: {
    fontWeight: "700",
    fontSize: "14px",
    lineHeight: "20px",
    letterSpacing: "0.15px",
    marginBottom: "8px",
  },
  spanTimes: {
    fontSize: "12px",
    fontWeight: "500",
    letterSpacing: "0.4px",
    color: "#B6B7BE",
  },
  spanTimesDivider: {
    margin: "0 4px",
  },
  accordionDetails: {
    padding: "0",
  },
  spanURLCopyIcon: {
    position: "absolute",
    right: "16px",
  },
};
