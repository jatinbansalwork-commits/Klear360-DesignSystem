const getKlear360Coverage = (): {
  klear360Coverage: number;
  totalNodes: number;
  klear360Nodes: number;
} => {
  /**
   * Checks if DOM node is hidden or not
   */
  const isElementHidden = (element: Element): boolean => {
    if (element.parentElement && isElementHidden(element.parentElement)) {
      return true;
    }
    if (!(element instanceof HTMLElement)) {
      return false;
    }
    if (element.hidden) {
      return true;
    }
    const style = getComputedStyle(element);
    return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
  };

  /**
   * Checks if DOM node is a media element or not
   */
  const isMediaElement = (element: Element): boolean => {
    const mediaTags = ['img', 'video', 'audio', 'source', 'picture'];
    return mediaTags.includes(element.tagName.toLowerCase());
  };

  /**
   * Checks if DOM element is empty or not
   */
  const isElementEmpty = (element: Element): boolean => {
    if (!element) return true;
    if (!element.childNodes.length) {
      return true;
    }
    return false;
  };

  const allDomElements = document.querySelectorAll('body *');

  const klear360NodeElements = [];
  const totalNodeElements = [];

  allDomElements.forEach((elm) => {
    if (isElementHidden(elm)) return;
    if (isElementEmpty(elm)) return;
    if (isMediaElement(elm)) return;

    // skip svg nodes but not klear360 icons
    const closestSvgNode = elm.closest('svg');
    // if this is a klear360 icon then add it
    if (elm.tagName.toLocaleLowerCase() === 'svg' && elm.hasAttribute('data-klear360-component')) {
      klear360NodeElements.push(elm);
      totalNodeElements.push(elm);
      return;
    }
    // if it's a svg node inside a klear360 icon then skip it
    if (closestSvgNode?.getAttribute('data-klear360-component') === 'icon') {
      return;
    }
    // if it's a svg node but not a klear360 icon then skip it
    if (closestSvgNode && !elm.hasAttribute('data-klear360-component')) {
      return;
    }

    totalNodeElements.push(elm);

    // If element has data-klear360-component add it
    if (elm.hasAttribute('data-klear360-component')) {
      klear360NodeElements.push(elm);
    }
  });

  const totalNodes = totalNodeElements.length;
  const klear360Nodes = klear360NodeElements.length;
  let klear360Coverage = Number(((klear360Nodes / totalNodes) * 100).toFixed(2));
  // NaN guard
  if (totalNodes === 0) {
    klear360Coverage = 0;
  }

  return {
    klear360Coverage,
    totalNodes,
    klear360Nodes,
  };
};

const assertKlear360Coverage = async ({
  page,
  expect,
  threshold = 70,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect: any;
  threshold: number;
}): Promise<void> => {
  const { klear360Coverage } = await page.evaluate((coverageFnStr: string) => {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    const calculateKlear360Coverage = new Function(`return (${coverageFnStr})()`);
    return calculateKlear360Coverage();
  }, getKlear360Coverage.toString());

  expect(klear360Coverage).toBeGreaterThanOrEqual(threshold);
};

module.exports = { getKlear360Coverage, assertKlear360Coverage };
