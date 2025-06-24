import { Rule } from "../steps/Rule";
import { FlattenGroupingRule } from "./FlattenGroupingRule";
import { ExpandPowerOfSumRule } from "./ExpandPowerOfSumRule";
import { FlattenMultiplicationRule } from "./FlattenMultiplicationRule";
import { SimplifyMultiplicationConstantsRule } from "./SimplifyMultiplicationConstantsRule";
import { NormalizeMultiplicationOrderRule } from "./NormalizeMultiplicationOrderRule";
import { FlattenAdditionRule } from "./FlattenAdditionRule";
import { ExpandMultiplicationRule } from "./ExpandMultiplicationRule";
import { EvaluateArithmeticRule } from "./EvaluateArithmeticRule";
import { EvaluateAdditionRule } from "./EvaluateAdditionRule";
import { CombineLikeTermsAndConstantsRule } from "./CombineLikeTermsAndConstantsRule";
import { DistributeDivisionOverAdditionRule } from "./DistributeDivisionOverAdditionRule";
import { DistributeNegativeSignRule } from "./DistributeNegativeSignRule";
import { RemoveZeroRule } from "./RemoveZeroRule";
import { IdentityRule } from "./IdentityRule";
import { FractionReductionRule } from "./FractionReductionRule";
import { PowerSimplifyRule } from "./PowerSimplifyRule";
import { PrettyPolynomialRule } from "./PrettyPolynomialRule";
import { PolynomialBeautifyRule } from "./PolynomialBeautifyRule";
import { OrderAndGroupRule } from "./OrderAndGroupRule";
import { TranspositionRule } from "./TranspositionRule";
// (otros imports opcionales…)

export const allRules: Rule[] = [
  // 1️⃣ Limpieza de agrupaciones
  new FlattenGroupingRule(),

  // 2️⃣ Expande (a + b)^2 → a^2 + 2ab + b^2
  new ExpandPowerOfSumRule(),

  // 3️⃣ Simplifica el interior de las multiplicaciones recién creadas
  new FlattenMultiplicationRule(),
  new SimplifyMultiplicationConstantsRule(),
  new NormalizeMultiplicationOrderRule(),

  // 4️⃣ Aplana sumas anidadas internas
  new FlattenAdditionRule(),

  // 5️⃣ Distribuye productos sobre sumas (2·(…+…+…))
  new ExpandMultiplicationRule(),

  // 6️⃣ Limpia de nuevo multiplicaciones
  new FlattenMultiplicationRule(),
  new SimplifyMultiplicationConstantsRule(),

  // 7️⃣ Evalúa operaciones puramente numéricas
  new EvaluateArithmeticRule(),
  new EvaluateAdditionRule(),

  // 8️⃣ Combina términos semejantes y constantes
  new CombineLikeTermsAndConstantsRule(),

  // 9️⃣ Reglas especiales de división y signos
  new DistributeDivisionOverAdditionRule(),
  new DistributeNegativeSignRule(),

  // 🔟 Limpieza final de ceros, identidades y fracciones
  new RemoveZeroRule(),
  new IdentityRule(),
  new FractionReductionRule(),

  // 1️⃣1️⃣ Embellecimiento y orden
  new PowerSimplifyRule(),
  new PrettyPolynomialRule(),
  new PolynomialBeautifyRule(),
  new OrderAndGroupRule(),
  new TranspositionRule(),
];
