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

const ellipsisOverflow = {
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const styles = {
  container: {
    display: "flex",
    padding: "11px 36px 11px 87px",
    "&:hover": {
      backgroundColor: "#2B2D32",
    },
  },
  key: {
    flex: "0 0 45%",
    fontWeight: "400",
    marginRight: "10px",
    ...ellipsisOverflow,
  },
  value: {
    fontWeight: "700",
    ...ellipsisOverflow,
  },
  copy: {
    cursor: "pointer",
    marginLeft: "auto",
    fontSize: 15,
    alignSelf: "center",
  },
};
