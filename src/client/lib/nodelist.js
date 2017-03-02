export function checkNodeList(list) {
  if (!list.length) {
    return -1;
  }
  return list;
}

export function getNodeLists(names = []) {
  return new Promise((resolve) => {
    if (!Array.isArray(names) || (Array.isArray(names) && !names.length)) {
      throw new TypeError('Argument must be an array of strings.', 'nodelist.js', 11);
    }
    const nodeLists = {};
    names.forEach((name) => {
      const nodeList = document.querySelectorAll(name);
      if (nodeList.length) {
        nodeLists.name = nodeList;
      }
    });
    resolve(nodeLists);
  });
}

export function removeNodesByAttr(list, attr, val) {
  return Array.from(list).filter(e => e.getAttribute(attr) !== val);
}
