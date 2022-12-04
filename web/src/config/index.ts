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

// this file contains configuration for the application such as API_URL, etc.
const LOCAL_API_URL = "http://localhost:8080";
export const API_URL = process.env.REACT_APP_API_URL ?? LOCAL_API_URL;

export const LUPA_DOCS_URL = "https://solid-dollop-44b513ff.pages.github.io/";
export const LUPA_REPOSITORY_URL = "https://github.com/epsagon/lupa";
export const LUPA_SLACK_INVITE_LINK =
  "https://join.slack.com/t/lupa-space/shared_invite/zt-1kyuehmaq-Dbut6qMpKak~SHx1DmZTEQ";

export const LUPA_BUILD_INFO =
  process.env.REACT_APP_BUILD_INFO ?? "v0.0.0-devel";
