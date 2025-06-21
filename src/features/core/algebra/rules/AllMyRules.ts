import { Rule } from "../steps/Rule";
import { DistributiveRule } from "./DistributiveRule";
import { TranspositionRule } from "./TranspositionRule";
import { SimplifyLikeTermsRule } from "./SimplifyLikeTermsRule";
import { FractionReductionRule } from "./FractionReductionRule";
import { RemoveZeroRule } from "./RemoveZeroRule";
import { IdentityRule } from "./IdentityRule";
import { PowerToProductRule } from "./PowerToProductRule";
import { FlattenGroupingRule } from "./FlattenGroupingRule";
import { ExpandPowerOfSumRule } from "./ExpandPowerOfSumRule";
import { ExpandMultiplicationRule } from "./ExpandMultiplicationRule";
import { DistributeNegativeSignRule } from "./DistributeNegativeSignRule";
import { CombineLikeTermsRule } from "./CombineLikeTermsRule";
import { EvaluateArithmeticRule } from "./EvaluateArithmeticRule";
import { EvaluateNestedMultiplicationRule } from "./EvaluateNestedMultiplicationRule";
import { OrderAndGroupRule } from "./OrderAndGroupRule";

export const allRules: Rule[] = [
  new FlattenGroupingRule(),
  new ExpandMultiplicationRule(),
  new EvaluateNestedMultiplicationRule(),
  new CombineLikeTermsRule(),
  new DistributeNegativeSignRule(),
  new ExpandPowerOfSumRule(),
  new DistributiveRule(),
  new TranspositionRule(),
  new SimplifyLikeTermsRule(),
  new FractionReductionRule(),
  new RemoveZeroRule(),
  new IdentityRule(),
  new PowerToProductRule(),
 new EvaluateArithmeticRule(),
 new OrderAndGroupRule()
];