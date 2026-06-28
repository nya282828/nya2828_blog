export default function rehypeRailWrapper() {
  return (tree) => {
    const newChildren = [];
    let group = [];

    const flushGroup = () => {
      const meaningful = group.filter(
        (n) => !(n.type === 'text' && n.value.trim() === '')
      );
      if (meaningful.length > 0) {
        newChildren.push({
          type: 'element',
          tagName: 'div',
          properties: { className: ['l-rail'] },
          children: group,
        });
      }
      group = [];
    };

    for (const node of tree.children) {
      if (node.type === 'mdxjsEsm') {
        flushGroup();
        newChildren.push(node);
        continue;
      }
      if (node.type === 'mdxJsxFlowElement' && node.name === 'Rail') {
        flushGroup();
        newChildren.push(node);
        continue;
      }
      if (node.type === 'element' && node.tagName === 'pre') {
        flushGroup();
        newChildren.push(node);
        continue;
      }
      if (node.type === 'element' && node.tagName === 'hr') {
        flushGroup();
        newChildren.push(node);
        continue;
      }
      group.push(node);
    }
    flushGroup();

    tree.children = newChildren;
  };
}
