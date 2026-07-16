import { HttpCallNode } from "./http-call-node";
import { DelayNode } from "./delay-node";
import { DataTransformNode } from "./data-transform-node";
import { ConditionalBranchNode } from "./conditional-branch-node";

export const nodeTypes = {
  HTTP_CALL: HttpCallNode,
  DELAY: DelayNode,
  DATA_TRANSFORM: DataTransformNode,
  CONDITIONAL_BRANCH: ConditionalBranchNode,
};
