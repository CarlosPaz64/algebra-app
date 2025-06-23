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
import { OrderAndGroupRule } from "./OrderAndGroupRule";
import { SimplifyMultiplicationConstantsRule } from "./SimplifyMultiplicationConstantsRule";
import { FlattenMultiplicationRule } from "./FlattenMultiplicationRule";
import { FlattenAdditionRule } from "./FlattenAdditionRule";
import { PrettyPolynomialRule } from "./PrettyPolynomialRule";
import { PolynomialBeautifyRule } from "./PolynomialBeautifyRule";

export const allRules: Rule[] = [
  // 🔹 1. Limpiar agrupaciones y simplificar estructura
  new FlattenGroupingRule(),

  // 🔹 2. Expandir potencias como (a + b)^n
  new ExpandPowerOfSumRule(),

  // 🔹 3. Expandir multiplicaciones tipo a(b + c)
  new ExpandMultiplicationRule(),

  // 🔹 4. Reestructurar multiplicaciones y combinar constantes
  new FlattenMultiplicationRule(),
  new SimplifyMultiplicationConstantsRule(),

  // 🔹 5. Evaluar operaciones entre literales
  new EvaluateArithmeticRule(),

    new FlattenAdditionRule(),
  new PrettyPolynomialRule(),
  new PolynomialBeautifyRule(),

  // 🔹 6. Distribuciones adicionales y signos negativos
  new DistributeNegativeSignRule(),
  new DistributiveRule(),

  // 🔹 7. Agrupaciones algebraicas
  new CombineLikeTermsRule(),
  new SimplifyLikeTermsRule(),

  // 🔹 8. Reglas de limpieza
  new RemoveZeroRule(),
  new IdentityRule(),
  new FractionReductionRule(),

  // 🔹 9. Reglas estructurales y de forma
  new TranspositionRule(),
  new OrderAndGroupRule()

  // 🔸 Opcional: si necesitas que x² vuelva a x·x (desactivada para evitar ciclos)
  // new PowerToProductRule(),
];
