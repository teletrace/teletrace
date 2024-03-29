/*
Copyright (c) 2017 Uber Technologies, Inc.
Modifications copyright (C) 2022 Cisco Systems, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
export default class TreeNode {
  static iterFunction(fn, depth = 0) {
    return (node) => fn(node.value, node, depth);
  }

  static searchFunction(search) {
    if (typeof search === "function") {
      return search;
    }

    return (value, node) =>
      search instanceof TreeNode ? node === search : value === search;
  }

  constructor(value, children = []) {
    this.value = value;
    this.children = children;
  }

  get depth() {
    return this.children.reduce(
      (depth, child) => Math.max(child.depth + 1, depth),
      1
    );
  }

  get size() {
    let i = 0;
    // eslint-disable-next-line no-plusplus
    this.walk(() => i++);
    return i;
  }

  addChild(child) {
    this.children.push(child instanceof TreeNode ? child : new TreeNode(child));
    return this;
  }

  find(search) {
    const searchFn = TreeNode.iterFunction(TreeNode.searchFunction(search));
    if (searchFn(this)) {
      return this;
    }
    for (let i = 0; i < this.children.length; i += 1) {
      const result = this.children[i].find(search);
      if (result) {
        return result;
      }
    }
    return null;
  }

  getPath(search) {
    const searchFn = TreeNode.iterFunction(TreeNode.searchFunction(search));

    const findPath = (currentNode, currentPath) => {
      // skip if we already found the result
      const attempt = currentPath.concat([currentNode]);
      // base case: return the array when there is a match
      if (searchFn(currentNode)) {
        return attempt;
      }
      for (let i = 0; i < currentNode.children.length; i += 1) {
        const child = currentNode.children[i];
        const match = findPath(child, attempt);
        if (match) {
          return match;
        }
      }
      return null;
    };

    return findPath(this, []);
  }

  walk(fn, depth = 0) {
    const nodeStack = [];
    let actualDepth = depth;
    nodeStack.push({ depth: actualDepth, node: this });
    while (nodeStack.length) {
      const { node, depth: nodeDepth } = nodeStack.pop();
      fn(node.value, node, nodeDepth);
      actualDepth = nodeDepth + 1;
      let i = node.children.length - 1;
      while (i >= 0) {
        nodeStack.push({ depth: actualDepth, node: node.children[i] });
        i -= 1;
      }
    }
  }
}
