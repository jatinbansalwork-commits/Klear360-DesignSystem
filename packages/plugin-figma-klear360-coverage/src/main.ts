// List for Coverage Plugin:
// [x] Add Card check for border radius
// [x] Add tokens to coverage % - done
// [x] Add card check for frames for custom components - done
// [x] Add check for override of tokens - done
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  getParentNode,
  traverseNode,
  getSelectedNodesOrAllNodes,
} from '@create-figma-plugin/utilities';

import {
  KLEAR360_BOX_BACKGROUND_COLOR_VARIABLE_IDS,
  KLEAR360_BOX_BORDER_COLOR_VARIABLE_IDS,
  KLEAR360_COMPONENT_IDS,
  KLEAR360_COMPONENT_IDS_HAVING_SLOT,
  KLEAR360_TEXT_COLOR_STYLE_IDS,
  KLEAR360_TEXT_TYPEFACE_STYLE_IDS,
  KLEAR360_EFFECT_STYLE_IDS,
  klear360ThemeData,
} from './klear360LibraryConstants';
type CoverageMetrics = {
  klear360Components: number;
  klear360TextStyles: number;
  klear360ColorStyles: number;
  // klear360EffectStyles: number;
  patternsUsed: number;
  nonKlear360Components: number;
  nonKlear360TextStyles: number;
  nonKlear360ColorStyles: number;
  // nonKlear360EffectStyles: number;
  totalLayers: number;
  klear360Coverage: number;
};

const MAIN_FRAME_NODES = ['FRAME', 'SECTION'];
// `@figma/plugin-typings` has no SlotNode yet, so slots can only be recognised by their runtime
// type string. Keep it here so every comparison stays in sync.
const SLOT_NODE_TYPE = 'SLOT';
const NODES_SKIP_FROM_COVERAGE = [
  'GROUP',
  'SECTION',
  // a SLOT is a placeholder that belongs to the component's own definition, not to the designer.
  // whatever gets dropped into it is still traversed and measured, so counting or flagging the
  // slot itself would both mark Klear360 internals as non-Klear360 and inflate the layer count
  SLOT_NODE_TYPE,
  'VECTOR',
  'ELLIPSE',
  'INSTANCE',
  'COMPONENT',
  'COMPONENT_SET',
];
const nonKlear360HighlighterNodes: BaseNode[] = [];
const klear360CoverageCards: BaseNode[] = [];
const PATTERN_SHARED_DATA_NAMESPACE = 'klear360.pattern';
const PATTERN_SHARED_DATA_KEY = 'isPattern';
const TRUTHY_SHARED_DATA_VALUES = ['true', '1', 'yes'];
const PATTERN_LAYER_NAME_TAGS = ['@klear360-pattern-node'];

const isPatternFrameExemptNode = (node: SceneNode): boolean => {
  const normalizedNodeName = node.name.toLowerCase();
  const hasPatternTagInName = PATTERN_LAYER_NAME_TAGS.some((tag) =>
    normalizedNodeName.includes(tag),
  );
  if (hasPatternTagInName) {
    return true;
  }

  const sharedPluginDataValue = node
    .getSharedPluginData(PATTERN_SHARED_DATA_NAMESPACE, PATTERN_SHARED_DATA_KEY)
    .trim()
    .toLowerCase();

  return TRUTHY_SHARED_DATA_VALUES.includes(sharedPluginDataValue);
};

const isKlear360Instance = (node: BaseNode): node is InstanceNode =>
  node.type === 'INSTANCE' &&
  (KLEAR360_COMPONENT_IDS.includes((node.mainComponent?.parent as ComponentSetNode)?.key ?? '') ||
    KLEAR360_COMPONENT_IDS.includes(node.mainComponent?.key ?? ''));

/**
 * Outside of slots, Figma does not allow adding or removing children of an instance, so any plain
 * FRAME found inside one belongs to that component's own definition rather than to the designer.
 * When the owning component is Klear360's, that frame is internal chrome we should ignore entirely.
 *
 * Slots are the exception: they are the one place where a descendant of an instance is authored by
 * the designer, so anything below a SLOT stays in the coverage no matter which component owns it.
 *
 * Past that, only the nearest instance decides. A custom component dropped into a Klear360 slot still
 * owns its frames, so those must keep showing up in the coverage.
 */
const isInsideKlear360Component = (node: BaseNode): boolean => {
  let currentNode = node.parent;
  while (currentNode && currentNode.type !== 'PAGE' && currentNode.type !== 'DOCUMENT') {
    // the plugin typings have no SlotNode yet, so the runtime type has to be compared as a string
    if ((currentNode.type as string) === SLOT_NODE_TYPE) {
      return false;
    }
    if (currentNode.type === 'INSTANCE') {
      return isKlear360Instance(currentNode);
    }
    currentNode = currentNode.parent;
  }
  return false;
};

const highlightNonKlear360Node = (node: SceneNode, desc?: string): void => {
  const highlighterBox = figma.createRectangle();
  const nodeType = `${node.type
    .toUpperCase()
    .charAt(0)
    .toUpperCase()}${node.type.toLowerCase().slice(1)}`;
  highlighterBox.name = `${desc}, Type: ${nodeType}, Name: ${node.name}`;
  // selection node just gives the x and y relative to the frame we need WRT canvas hence, we need to use absoluteTransform prop
  highlighterBox.x = node.absoluteTransform[0][2] - 1;
  highlighterBox.y = node.absoluteTransform[1][2] - 1;
  highlighterBox.resize(node.width + 2, node.height + 2);
  highlighterBox.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
  highlighterBox.strokes = [{ type: 'SOLID', color: { r: 0.7, g: 0, b: 0 } }];
  nonKlear360HighlighterNodes.push(highlighterBox);
};

const traverseUpTillMainFrame = (node: BaseNode): BaseNode => {
  try {
    if (node !== null) {
      if (getParentNode(node)?.type === 'PAGE') {
        return node;
      } else if (node.parent) {
        return traverseUpTillMainFrame(node.parent);
      }
    }
  } catch (error: unknown) {
    console.error(error);
    figma.notify('⚠️ Error in traversing main frame node. Please try again');
    figma.closePlugin();
  }

  return node;
};

const renderCoverageCard = async ({
  mainFrameNode,
  klear360Components,
  patternsUsed,
  nonKlear360Components,
  nonKlear360ColorStyles,
  nonKlear360TextStyles,
  totalLayers,
  klear360Coverage,
}: {
  mainFrameNode: SceneNode;
} & CoverageMetrics): Promise<void> => {
  // these are from payment light theme but it should work as far as the plugin is being run from Klear org
  const COVERAGE_CARD_COMPONENT_KEY = 'c5744871a8db11b02c65b4843d68779f2ff99ed3';
  const KLEAR360_INTENT_COLOR_KEYS = {
    positive: {
      id: '',
      keyVariable: '6489b823f0ea6a46820027c92b5650d0d7950350',
    },
    negative: {
      id: '',
      keyVariable: '11c2fb911f47d4f8dc6ff648c2e9c6ee2ee3f2b9',
    },
    notice: {
      id: '',
      keyVariable: '6fe5b15560ece4139ebacb2ae64f93892761d858',
    },
  };

  try {
    const coverageCardComponent = await figma.importComponentByKeyAsync(
      COVERAGE_CARD_COMPONENT_KEY,
    );
    const coverageCardInstance = coverageCardComponent.createInstance();
    coverageCardInstance.visible = false;
    if (mainFrameNode.width < 500) {
      coverageCardInstance.x = mainFrameNode.x + 20; // for mobile screens the card shouldn't offset a lot
    } else {
      coverageCardInstance.x = mainFrameNode.x + 150; // 150 because we want to prevent conflict with the frame name
    }
    coverageCardInstance.y = mainFrameNode.y - coverageCardComponent.height;

    // import styles for positive, negative and notice colors and set their id in KLEAR360_INTENT_COLOR_KEYS
    for await (const [intent, intentObject] of Object.entries(KLEAR360_INTENT_COLOR_KEYS)) {
      // const colorStyle = await figma.importStyleByKeyAsync(intentObject.keyStyle);
      const colorVariable = await figma.variables.importVariableByKeyAsync(
        intentObject.keyVariable,
      );
      // KLEAR360_INTENT_COLOR_KEYS[intent as 'positive' | 'negative' | 'notice'].id = colorStyle.id;
      KLEAR360_INTENT_COLOR_KEYS[intent as 'positive' | 'negative' | 'notice'].id =
        colorVariable.id;
    }

    let coverageColorIntent = KLEAR360_INTENT_COLOR_KEYS.negative.id;
    let klear360CoverageType = 'Below 95% 😪';
    // only used if the Progress node's track parent can't be measured
    const PROGRESS_BAR_FALLBACK_WIDTH = 298;

    // calculate coverage type and intent colors for coverage
    if (klear360Coverage > 95) {
      klear360CoverageType = `Good 🎉`;
      coverageColorIntent = KLEAR360_INTENT_COLOR_KEYS.positive.id;
    }

    coverageCardInstance.setProperties({
      'klear360CoverageType#45789:0': klear360CoverageType,
      'klear360Coverage#45789:1': `${klear360Coverage.toFixed(2)}%`,
      'totalLayers#45789:2': totalLayers.toString().padStart(2, '0'),
      'klear360Components#45789:3': klear360Components.toString().padStart(2, '0'),
      'nonKlear360Components#45789:4': nonKlear360Components.toString().padStart(2, '0'),
      'nonKlear360TextStyles#45789:5': nonKlear360TextStyles.toString().padStart(2, '0'),
      'nonKlear360ColorStyles#45789:6': nonKlear360ColorStyles.toString().padStart(2, '0'),
      'patternUsage#123665:0': patternsUsed.toString().padStart(2, '0'),
    });

    const detachedCoverageCard = coverageCardInstance.detachInstance();

    // Function to create a paint object bound to a variable
    const createVariableBoundPaint = (variableId: string): SolidPaint => ({
      type: 'SOLID',
      // Optional: provide a fallback color if the variable isn't resolvable,
      // though Figma typically handles this.
      color: { r: 0, g: 0, b: 0 }, // Example fallback
      boundVariables: {
        color: {
          type: 'VARIABLE_ALIAS',
          id: variableId,
        },
      },
    });

    traverseNode(detachedCoverageCard, (traversedNode) => {
      if (traversedNode.type === 'TEXT') {
        if (['klear360CoverageType', 'klear360Coverage'].includes(traversedNode.name)) {
          const newFill = createVariableBoundPaint(coverageColorIntent);
          traversedNode.fills = [newFill];
        }
      } else if (traversedNode.type === 'RECTANGLE' && traversedNode.name === 'Progress') {
        // measure the track (the parent ProgressBar frame) instead of hardcoding a width,
        // so the fill stays accurate if the coverage card gets resized in Figma
        const track = traversedNode.parent;
        const trackWidth = track && 'width' in track ? track.width : PROGRESS_BAR_FALLBACK_WIDTH;
        const trackHeight = track && 'height' in track ? track.height : traversedNode.height;
        traversedNode.resizeWithoutConstraints(
          (klear360Coverage / 100) * trackWidth || 0.1,
          trackHeight,
        );
        const newFill = createVariableBoundPaint(coverageColorIntent);
        traversedNode.fills = [newFill];
      }
    });
    detachedCoverageCard.visible = true;
    klear360CoverageCards.push(detachedCoverageCard);
  } catch (error: unknown) {
    figma.notify('⚠️ Error in rendering coverage card. Please try again');
    console.error(error);
    figma.closePlugin();
  }
};

const calculateCoverage = (node: SceneNode): CoverageMetrics | null => {
  let klear360Components = 0;
  let klear360TextStyles = 0;
  let klear360ColorStyles = 0;
  // let klear360EffectStyles = 0;
  let patternsUsed = 0;
  let nonKlear360Components = 0;
  let nonKlear360TextStyles = 0;
  let nonKlear360ColorStyles = 0;
  // let nonKlear360EffectStyles = 0;
  let totalLayers = 0;
  let klear360Coverage = 0;
  const exemptedNodeIds = new Set<string>();

  try {
    // if there are non-frame nodes as direct children of a page, ignore them
    if (getParentNode(node)?.type === 'PAGE' && !MAIN_FRAME_NODES.includes(node.type)) {
      return null;
    }

    traverseNode(
      node,
      (traversedNode) => {
        if (!traversedNode.visible) {
          return;
        }
        const isPatternExemptFrameNode = isPatternFrameExemptNode(traversedNode);
        if (isPatternExemptFrameNode && !exemptedNodeIds.has(traversedNode.id)) {
          patternsUsed++;
          exemptedNodeIds.add(traversedNode.id);
        }
        // this condition is required to run coverage on component sets which are components built locally using Klear360 components
        const isLocalComponent =
          traversedNode.type === 'COMPONENT' || traversedNode.type === 'COMPONENT_SET';

        if (isKlear360Instance(traversedNode) || isLocalComponent) {
          // few components that have slots we need to check if the children are valid Klear360 instances
          if (
            !isLocalComponent &&
            // slot holders can be variants (matched via the parent set) or standalone
            // components like _Modal Header (matched via their own key)
            (KLEAR360_COMPONENT_IDS_HAVING_SLOT.includes(
              (traversedNode.mainComponent?.parent as ComponentSetNode)?.key ?? '',
            ) ||
              KLEAR360_COMPONENT_IDS_HAVING_SLOT.includes(traversedNode.mainComponent?.key ?? ''))
          ) {
            // this will recursively follow the same process we follow.
            // check for Klear360's instance and if there are certain components that has slot inside it then we recursively check inside them for klear360 components
            traversedNode.children.forEach((childNode) => {
              const slotComponentsCoverage = calculateCoverage(childNode);
              if (slotComponentsCoverage) {
                klear360Components += slotComponentsCoverage?.klear360Components;
                klear360TextStyles += slotComponentsCoverage?.klear360TextStyles;
                klear360ColorStyles += slotComponentsCoverage?.klear360ColorStyles;
                // patterns can be dropped into a slot too, so they have to roll up like the rest
                patternsUsed += slotComponentsCoverage?.patternsUsed;
                nonKlear360Components += slotComponentsCoverage?.nonKlear360Components;
                nonKlear360TextStyles += slotComponentsCoverage?.nonKlear360TextStyles;
                nonKlear360ColorStyles += slotComponentsCoverage?.nonKlear360ColorStyles;
                totalLayers += slotComponentsCoverage?.totalLayers;
              }
            });
          }
          if (!isLocalComponent && traversedNode.overrides.length) {
            // flag the instance if its overridden
            let isOverridden = false;
            traversedNode.overrides.forEach((node) => {
              if (
                // these are properties which tells us if the components' text has been overridden. Fill this with more cases going forward as there are more possible values
                // https://www.figma.com/plugin-docs/api/NodeChangeProperty/
                node.overriddenFields.includes('letterSpacing') ||
                node.overriddenFields.includes('textStyleId') ||
                node.overriddenFields.includes('fontName') ||
                node.overriddenFields.includes('fontSize') ||
                node.overriddenFields.includes('lineHeight') ||
                node.overriddenFields.includes('textCase')
              ) {
                isOverridden = true;
              }
              if (node.overriddenFields.includes('cornerRadius')) {
                isOverridden = true;
                const isCardBorderRadiusValid = [
                  traversedNode.boundVariables?.topLeftRadius?.id,
                  traversedNode.boundVariables?.topRightRadius?.id,
                  traversedNode.boundVariables?.bottomLeftRadius?.id,
                  traversedNode.boundVariables?.bottomRightRadius?.id,
                ].every((variableId) =>
                  Object.values(klear360ThemeData.variables.CardBorderRadius).includes(
                    variableId ?? '',
                  ),
                );
                if (
                  // (traversedNode.mainComponent?.parent as ComponentSetNode)?.key
                  (traversedNode.mainComponent?.parent as ComponentSetNode)?.key?.includes(
                    klear360ThemeData.components.Card.key,
                  ) &&
                  isCardBorderRadiusValid
                ) {
                  isOverridden = false;
                }
              }
            });
            if (isOverridden) {
              nonKlear360Components++;
              highlightNonKlear360Node(
                traversedNode,
                'Overridden Klear360 Instance. Please reset changes',
              );
            } else {
              klear360Components++;
            }
          } else if (!isLocalComponent) {
            klear360Components++;
          }

          // we want to ignore the count of all the COMPONENT and COMPONENT_SET node types from the total layer count
          if (!isLocalComponent) {
            totalLayers++;
          }
        }
        // else if (traversedNode.type === 'INSTANCE') {
        //   nonKlear360Components++;
        //   highlightNonKlear360Node(traversedNode, 'Instance is not a Klear360 Instance');
        // }
        else if (traversedNode.type === 'TEXT') {
          // check if the text is using Klear360's text styles
          let isMixedTextStyleOfKlear360 = false;
          let traversedNodeTextStyleId = '';
          let isTextRangeFillsOfKlear360 = false;
          let traversedNodeColorVariableId = '';

          /**
           * The textSyleId can have figma.mixed. so in that case we need to go character by character
           * and do getRangeTextStyleId(charIndex,charIndex+1) instead of textStyleId
           */
          if (traversedNode?.textStyleId === figma.mixed) {
            isMixedTextStyleOfKlear360 = traversedNode.characters
              .split('')
              .every((character, index) => {
                if (/\s/.test(character)) {
                  return true;
                }
                return KLEAR360_TEXT_TYPEFACE_STYLE_IDS.includes(
                  (traversedNode.getRangeTextStyleId(index, index + 1) as string).split(',')[0],
                );
              });

            if (isMixedTextStyleOfKlear360) {
              klear360TextStyles++;
            } else {
              nonKlear360TextStyles++;
              highlightNonKlear360Node(traversedNode, 'Text is not using Klear360');
            }
          } else {
            traversedNodeTextStyleId = traversedNode?.textStyleId?.split(',')[0];
            if (KLEAR360_TEXT_TYPEFACE_STYLE_IDS.includes(traversedNodeTextStyleId ?? '')) {
              klear360TextStyles++;
            } else {
              nonKlear360TextStyles++;
              highlightNonKlear360Node(traversedNode, 'Text Style is not from Klear360');
            }
          }

          // check if text is using klear360 color styles
          if (traversedNode.boundVariables?.fills?.length) {
            traversedNodeColorVariableId = traversedNode.boundVariables.fills[0].id.split('/')[0];
            if (KLEAR360_TEXT_COLOR_STYLE_IDS.includes(traversedNodeColorVariableId ?? '')) {
              klear360ColorStyles++;
            } else {
              nonKlear360ColorStyles++;
              highlightNonKlear360Node(
                traversedNode,
                'Text Color Style should only use surface/text or feedback/text tokens',
              );
            }
          } else {
            nonKlear360ColorStyles++;
            highlightNonKlear360Node(
              traversedNode,
              'Text Color Style is not using Klear360 Tokens',
            );
          }

          // check if text is using klear360 text styles
          // textRangeFills is used when the text has different colors for different characters
          if (traversedNode.boundVariables?.textRangeFills?.length) {
            isTextRangeFillsOfKlear360 = traversedNode.boundVariables.textRangeFills.every(
              (fill) => {
                if (KLEAR360_TEXT_COLOR_STYLE_IDS.includes(fill.id.split('/')[0])) {
                  return true;
                }
                return false;
              },
            );
            if (isTextRangeFillsOfKlear360) {
              klear360TextStyles++;
            } else {
              nonKlear360TextStyles++;
              highlightNonKlear360Node(
                traversedNode,
                'Text Color Style should only use surface/text or feedback/text tokens',
              );
            }
          }

          if (
            traversedNode.boundVariables &&
            Object.keys(traversedNode.boundVariables).length === 0
          ) {
            nonKlear360TextStyles++;
            highlightNonKlear360Node(
              traversedNode,
              'Text Color Style should only use surface/text or feedback/text tokens',
            );
          }

          // this check is for typography components, if the typography uses color and text both from klear360 styles then they are typography klear360 components
          if (
            (isMixedTextStyleOfKlear360 ||
              KLEAR360_TEXT_TYPEFACE_STYLE_IDS.includes(traversedNodeTextStyleId)) &&
            (isTextRangeFillsOfKlear360 ||
              KLEAR360_TEXT_COLOR_STYLE_IDS.includes(traversedNodeColorVariableId))
          ) {
            klear360Components++;
          }
        } else if (traversedNode.type === 'LINE') {
          nonKlear360Components++;
          highlightNonKlear360Node(traversedNode, 'Use a Divider Component Instead');
        } else if (traversedNode.type === 'RECTANGLE') {
          let isImage = false;

          if (traversedNode.fills !== figma.mixed) {
            // figma considers images as rectangles with fill type as IMAGE
            isImage = Boolean(traversedNode.fills.find((fill) => fill.type === 'IMAGE'));
          }

          if (isImage) {
            NODES_SKIP_FROM_COVERAGE.push('RECTANGLE');
          }

          const hasEffects = traversedNode.effects?.length;
          const hasKlear360EffectStyles = KLEAR360_EFFECT_STYLE_IDS.includes(
            traversedNode.effectStyleId,
          );

          if (hasEffects && hasKlear360EffectStyles) {
            // klear360EffectStyles++;
          } else if (hasEffects && !hasKlear360EffectStyles) {
            // nonKlear360EffectStyles++;
            highlightNonKlear360Node(traversedNode, `Effects not from Klear360's elevation styles`);
          }

          // replace with variables
          const hasFillsVariable = traversedNode.boundVariables?.fills?.length;
          const hasStrokesVariable = traversedNode.boundVariables?.strokes?.length;
          if (!isImage && (hasFillsVariable || hasStrokesVariable)) {
            // check if rectangle uses klear360 surface.border.* colors for border
            if (hasStrokesVariable) {
              const traversedNodeColorVariableId = traversedNode.boundVariables.strokes[0].id.split(
                '/',
              )[0];
              if (
                KLEAR360_BOX_BORDER_COLOR_VARIABLE_IDS.includes(traversedNodeColorVariableId ?? '')
              ) {
                klear360ColorStyles++;
              } else {
                nonKlear360ColorStyles++;
                highlightNonKlear360Node(
                  traversedNode,
                  'Box Border color should only use surface/border/* tokens',
                );
              }
            }
            // check if rectangle is using klear360 surface.background.* tokens for background
            if (hasFillsVariable) {
              const traversedNodeFillStyleId = traversedNode.boundVariables.fills[0].id.split(
                '/',
              )[0];
              if (
                KLEAR360_BOX_BACKGROUND_COLOR_VARIABLE_IDS.includes(traversedNodeFillStyleId ?? '')
              ) {
                klear360ColorStyles++;
              } else {
                nonKlear360ColorStyles++;
                highlightNonKlear360Node(
                  traversedNode,
                  'Box Background color should only use surface/background/* tokens',
                );
              }
            }
          } else if (!isImage) {
            highlightNonKlear360Node(traversedNode, 'Box not adhering to Klear360 guidelines');
          }
        }

        const ignoreInstanceFrameNodeNames = [
          'root',
          'wrapper',
          'bottom-sheet-container',
          'accordion-header container',
          'overlay', // Drawer Overlay
          'Marker', // Step Marker
          'Summary Row',
          'card-body',
          'card-content-holder',
        ];

        // a Klear360 component's own internal frames are not the designer's responsibility, so they
        // are neither flagged nor counted as layers
        const isKlear360InternalFrame =
          traversedNode.type === 'FRAME' && isInsideKlear360Component(traversedNode);

        /** check if a frame/custom instance created using frame is being used as a custom component
         * has fills?
         * has strokes?
         * has effects?
         * if any of the above is true then it's a custom component
         * */
        if (
          (traversedNode.type === 'FRAME' ||
            (traversedNode.type === 'INSTANCE' && !isKlear360Instance(traversedNode))) &&
          !isKlear360InternalFrame &&
          !isPatternExemptFrameNode &&
          !ignoreInstanceFrameNodeNames.includes(traversedNode.name) &&
          getParentNode(traversedNode)?.type !== 'PAGE' &&
          getParentNode(traversedNode)?.type !== 'SECTION'
        ) {
          const hasStrokes =
            traversedNode?.boundVariables?.strokes?.length ??
            traversedNode.strokes.filter((stroke) => stroke.visible !== false).length; // remove the hidden strokes from traversing
          const hasEffects = traversedNode.effects?.length || traversedNode.effectStyleId;
          const hasNonMixedFills =
            traversedNode.fills !== figma.mixed &&
            traversedNode.fills.filter((fill) => fill.visible !== false).length; // remove the hidden fills from traversing
          const hasFills =
            traversedNode?.boundVariables?.fills?.length ??
            hasNonMixedFills ??
            traversedNode.fillStyleId;
          if (
            Boolean(hasStrokes || hasEffects || hasFills) &&
            !Boolean(traversedNode.fills === figma.mixed)
          ) {
            // this is non-klear360 component error
            // push the frame layer to be included in component count
            nonKlear360Components++;
            highlightNonKlear360Node(
              traversedNode,
              `You might want to use Card with Slot. You're using a Frame with fill/strokes/effects.`,
            );
          } else {
            NODES_SKIP_FROM_COVERAGE.push('FRAME');
          }
        }

        if (
          ![...NODES_SKIP_FROM_COVERAGE, 'TEXT', 'LINE', 'RECTANGLE', 'FRAME'].includes(
            traversedNode.type,
          ) &&
          getParentNode(traversedNode)?.type !== 'PAGE'
        ) {
          highlightNonKlear360Node(traversedNode, 'Not created using Klear360 Components/Tokens');
        }

        if (
          getParentNode(traversedNode)?.type !== 'PAGE' &&
          getParentNode(traversedNode)?.type !== 'SECTION' &&
          !NODES_SKIP_FROM_COVERAGE.includes(traversedNode.type) &&
          !isKlear360InternalFrame &&
          !isPatternExemptFrameNode &&
          // if the frame instances are from Klear360's components then we don't want to include them in the count because these are components with slots
          !ignoreInstanceFrameNodeNames.includes(traversedNode.name)
        ) {
          // exclude the main frame itself from the count to remove false negatives
          totalLayers++;
        }

        // remove rectangle node index for next iteration because we don't want to remove all the rectangle nodes, only the image ones
        // remove frame node index for next iteration because we don't want to remove layout frame nodes, only the one that has being used as card
        const nodesToBeRemoved = ['RECTANGLE', 'FRAME'];
        // const nodesToBeRemoved = ['RECTANGLE'];
        nodesToBeRemoved.forEach((nodeName) => {
          const nodeIndex = NODES_SKIP_FROM_COVERAGE.findIndex((node) => node === nodeName);
          if (nodeIndex !== -1) {
            NODES_SKIP_FROM_COVERAGE.splice(nodeIndex, 1);
          }
        });
      },
      (traversedNode) => {
        // callback to stopTraversal for children of a node
        // true: we shall stop
        // false: we shall keep traversing children
        if (!traversedNode.visible) {
          return true;
        }

        if (isKlear360Instance(traversedNode)) {
          // we shall stop traversal further if we have found that an instance is Klear360 instance
          // if we keep traversing then chances are the metrics will be skewed because Klear360 components are composed of non-klear360 themselves
          // in code analytics we can add "data-*" to all the children till leaf nodes but over here we can't hence we stop
          return true;
        }
        return false;
      },
    );
  } catch (error: unknown) {
    console.error(error);
    figma.notify('⚠️ Error in rendering coverage card. Please try again');
    figma.closePlugin();
  }

  if (klear360Components === 0 && totalLayers === 0) {
    klear360Coverage = 0;
  } else if (klear360Components <= 0) {
    klear360Coverage = 0;
  } else if (
    nonKlear360Components === 0 &&
    nonKlear360TextStyles === 0 &&
    nonKlear360ColorStyles === 0
  ) {
    // we need to do this because when everything is from klear360 there could still be outer frames and things like that are non-klear360 and not flagged as well
    klear360Coverage = 100;
  } else {
    klear360Coverage = Number(
      (klear360Components / (totalLayers + nonKlear360TextStyles + nonKlear360ColorStyles)) * 100,
    );
  }

  return {
    klear360Components,
    klear360TextStyles,
    klear360ColorStyles,
    patternsUsed,
    nonKlear360Components,
    nonKlear360TextStyles,
    nonKlear360ColorStyles,
    totalLayers,
    klear360Coverage,
  };
};

const getPageMainFrameNodes = (nodes: readonly SceneNode[]): SceneNode[] => {
  const mainFrameNodes: SceneNode[] = [];
  try {
    for (const node of nodes) {
      if (getParentNode(node)?.type === 'PAGE') {
        // if selection is top level frame then start the coverage count
        // await calculateCoverage(node);
        mainFrameNodes.push(node);
      } else {
        // if the selection is not the top level frame then traverse up till we find the frame and then start the coverage count
        // await calculateCoverage(mainFrameNode);
        mainFrameNodes.push(traverseUpTillMainFrame(node) as SceneNode);
      }
    }
  } catch (error: unknown) {
    console.error(error);
    figma.notify('⚠️ Error in identifying main frame node. Please try again');
    figma.closePlugin();
  }

  return mainFrameNodes;
};

const removeOldGroupNodes = (): void => {
  // remove all teh old group nodes
  const klear360CoverageCardsGroup = figma.currentPage.findOne(
    (node) => node.name === 'Klear360 Coverage Cards',
  );
  const nonKlear360ItemsGroup = figma.currentPage.findOne(
    (node) => node.name === 'Non Klear360 Items',
  );

  if (klear360CoverageCardsGroup) {
    klear360CoverageCardsGroup.remove();
  }
  if (nonKlear360ItemsGroup) {
    nonKlear360ItemsGroup.remove();
  }
};

const main = async (): Promise<void> => {
  try {
    figma.skipInvisibleInstanceChildren = true;
    figma.notify('Calculating Coverage', { timeout: Infinity });

    removeOldGroupNodes();

    let nodes: readonly SceneNode[] = [];
    if (figma.currentPage.selection.length > 0) {
      // you already have the selection, run the plugin
      nodes = figma.currentPage.selection;
    } else if (figma.currentPage.type === 'PAGE') {
      // plugin is run from page scope but has no selection, so traverse all the nodes and then measure coverage
      nodes = getSelectedNodesOrAllNodes();
    } else {
      // the plugin is not run from a page scope, throw error
      figma.notify(
        '⚠️ Please run the plugin by opening a Page or selecting a layer inside a Page',
        {
          error: true,
        },
      );
      figma.closePlugin();
    }

    if (nodes.length) {
      // 1. get the main frame nodes of the current page(ignoring non-frame nodes)
      const mainFrameNodes = getPageMainFrameNodes(nodes);
      for await (const mainFrameNode of mainFrameNodes) {
        // 2. calculate the coverage
        const coverageMetrics = calculateCoverage(mainFrameNode);
        if (coverageMetrics) {
          // 3. render the coverage card. fin.
          await renderCoverageCard({ mainFrameNode, ...coverageMetrics });
        }
      }

      if (nonKlear360HighlighterNodes.length) {
        const nonKlear360HighterNodesGroup = figma.group(
          nonKlear360HighlighterNodes,
          figma.currentPage,
        );
        nonKlear360HighterNodesGroup.name = 'Non Klear360 Items';
        nonKlear360HighterNodesGroup.expanded = false;
      }

      if (klear360CoverageCards.length) {
        const klear360CoverageCardsGroup = figma.group(klear360CoverageCards, figma.currentPage);
        klear360CoverageCardsGroup.name = 'Klear360 Coverage Cards';
        klear360CoverageCardsGroup.expanded = false;
      }
    }
  } catch (error: unknown) {
    console.error(error);
    figma.notify('⚠️ Something went wrong. Please try re-running the plugin');
  } finally {
    figma.closePlugin();
  }
};

export default main;
