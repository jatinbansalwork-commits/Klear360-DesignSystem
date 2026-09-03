/* eslint-disable no-undef */
const calculateKlear360Coverage = (shouldHighlightNodes, includeNavbars = true) => {
  const klear360ElementExceptions = [
    // table library adds a div internally which we want to skip
    '[data-klear360-component="table-cell"] > div',
    '[data-klear360-component="table-header-cell"] > div',
    '[data-klear360-component="table-footer-cell"] > div',
  ];

  /**
   * Checks if DOM node is hidden or not
   */
  const isElementHidden = (element) => {
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
   * Checks if DOM element is empty or not
   */
  const isElementEmpty = (element) => {
    if (!element) return true;
    if (!element.childNodes.length) {
      return true;
    }
    return false;
  };

  /**
   * Checks if DOM node is a media element or not
   */
  const isMediaElement = (element) => {
    const mediaTags = ['img', 'video', 'audio', 'source', 'picture'];
    return mediaTags.includes(element.tagName.toLowerCase());
  };

  /**
   * Checks if element is inside sidenav or topnav
   */
  const isInsideNavElement = (element) => {
    const SIDENAV_NAME = 'sidenav';
    const TOPNAV_NAME = 'top-nav';
    const currentKlear360Component = element.getAttribute('data-klear360-component');
    if (currentKlear360Component === SIDENAV_NAME || currentKlear360Component === TOPNAV_NAME) {
      return true;
    }

    if (
      element.closest(`[data-klear360-component=${SIDENAV_NAME}]`) ||
      element.closest(`[data-klear360-component=${TOPNAV_NAME}]`)
    ) {
      return true;
    }

    return false;
  };

  /**
   * Checks if element should be ignored for design consistency calculations
   */
  const shouldIgnoreElement = (element) => {
    // Ignore everything that is inside nav
    if (isInsideNavElement(element)) {
      return true;
    }

    // Ignore Box component
    const componentsToIgnore = ['box'];
    const currentKlear360Component = element.getAttribute('data-klear360-component');
    if (currentKlear360Component && componentsToIgnore.includes(currentKlear360Component)) {
      return true;
    }

    return false;
  };

  const allDomElements = document.querySelectorAll('body *');

  const klear360NodeElements = [];
  const totalNodeElements = [];
  const nonKlear360NodeElements = [];

  allDomElements.forEach((elm) => {
    if (isElementHidden(elm)) return;
    if (isElementEmpty(elm)) return;
    if (isMediaElement(elm)) return;

    // skip svg nodes but not klear360 icons
    const closestSvgNode = elm.closest('svg');
    // if this is a klear360 icon then add it
    if (elm.tagName.toLocaleLowerCase() === 'svg' && elm.hasAttribute('data-klear360-component')) {
      // Skip if includeNavbars is false and element should be ignored
      if (!includeNavbars && shouldIgnoreElement(elm)) {
        return;
      }
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

    if (klear360ElementExceptions.some((exception) => elm.matches(exception))) {
      return;
    }

    // Skip if includeNavbars is false and element should be ignored
    if (!includeNavbars && shouldIgnoreElement(elm)) {
      return;
    }

    totalNodeElements.push(elm);

    // If element has data-klear360-component add it
    if (elm.hasAttribute('data-klear360-component')) {
      klear360NodeElements.push(elm);
    } else {
      nonKlear360NodeElements.push(elm);
    }
  });

  const totalNodes = totalNodeElements.length;
  const klear360Nodes = klear360NodeElements.length;

  let klear360Coverage = Number(((klear360Nodes / totalNodes) * 100).toFixed(2));

  // NaN guard
  if (totalNodes === 0) {
    klear360Coverage = 0;
  }

  if (shouldHighlightNodes) {
    nonKlear360NodeElements.forEach((node) => {
      node.style.outline = '1px solid rgba(255, 0, 0, 0.5)';
    });
  } else {
    nonKlear360NodeElements.forEach((node) => {
      node.style.outline = 'initial';
    });
  }

  return {
    klear360Coverage,
    totalNodes,
    klear360Nodes,
  };
};

export { calculateKlear360Coverage };
