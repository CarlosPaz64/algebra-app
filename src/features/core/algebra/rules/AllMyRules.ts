import { Rule } from "../steps/Rule";
import { DistributiveRule } from "./DistributiveRule";
import { TranspositionRule } from "./TranspositionRule";
import { SimplifyLikeTermsRule } from "./SimplifyLikeTermsRule";
import { FractionReductionRule } from "./FractionReductionRule";
import { RemoveZeroRule } from "./RemoveZeroRule";
import { IdentityRule } from "./IdentityRule";
import { PowerToProductRule } from "./PowerToProductRule";

export const allRules: Rule[] = [
  new DistributiveRule(),
  new TranspositionRule(),
  new SimplifyLikeTermsRule(),
  new FractionReductionRule(),
  new RemoveZeroRule(),
  new IdentityRule(),
  new PowerToProductRule()
];