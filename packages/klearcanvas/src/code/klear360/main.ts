import type {
  Klear360Node,
  Klear360ComponentInstanceNode,
  Klear360FrameNode,
  Klear360TextNode,
  Klear360GroupNode,
} from '../types/Klear360';
import type { TransformFunctionReturnType } from '../types/TransformFunction';
// eslint-disable-next-line import/no-cycle
import {
  generateKlear360ComponentInstanceCode,
  generateKlear360FrameCode,
  generateTextNodeCode,
  generateGroupNodeCode,
} from './components';
import { mergeImports } from './utils/imports';

export const generateKlear360Code = ({
  klear360Nodes,
}: {
  klear360Nodes: Klear360Node[];
}): TransformFunctionReturnType => {
  let componentCode = '';
  let allImports = {};

  klear360Nodes.forEach((klear360Node) => {
    switch (klear360Node.type) {
      case 'INSTANCE': {
        const { component, imports } = generateKlear360ComponentInstanceCode(
          klear360Node as Klear360ComponentInstanceNode,
        );
        componentCode += component;
        allImports = mergeImports(allImports, imports ?? {});
        break;
      }
      case 'FRAME': {
        const { component, imports } = generateKlear360FrameCode(klear360Node as Klear360FrameNode);
        componentCode += component;
        allImports = mergeImports(allImports, imports ?? {});
        break;
      }
      case 'TEXT': {
        const { component, imports } = generateTextNodeCode(klear360Node as Klear360TextNode);
        componentCode += component;
        allImports = mergeImports(allImports, imports ?? {});
        break;
      }

      case 'GROUP': {
        const { component, imports } = generateGroupNodeCode(klear360Node as Klear360GroupNode);
        componentCode += component;
        allImports = mergeImports(allImports, imports ?? {});
        break;
      }

      default:
        break;
    }
  });

  return { component: componentCode, imports: allImports };
};
