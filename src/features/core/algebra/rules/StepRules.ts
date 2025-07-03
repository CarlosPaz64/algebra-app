import { NormalizeSubtractionRule }      from "../rules/NormalizeSubtractionRule";
import { ExpandPowerRule }               from "../rules/ExpandPowerRule";
import { ClearDenominatorRule }          from "../rules/ClearDenominatorRule";
import { SimplifyConstantsRule }         from "../rules/SimplifyConstantsRule";
import { CombineLikeTermsRule }          from "../rules/CombineLikeTermsRule";
import { DistributiveInverseRule }       from "../rules/DistributiveInverseRule";
import { SimplifyInsideGroupingRule }    from "../rules/SimplifyInsideGroupingRule";
import { ExtractRootRule } from "./ExtractRootRule";
import { QuadraticFormulaRule }          from "../rules/QuadraticFormulaRule";
import { FactorAndSolvePolynomialRule }  from "../rules/FactorAndSolvePolynomialRule";
import { InverseFunctionRule }           from "../rules/InverseFunctionRule";
import { DivideCoefficientRule }         from "../rules/DivideCoefficientRule";
import { SolvePolynomialRule }           from "../rules/SolvePolynomialRule";
import { IsolateVariableOnLeftRule } from "./IsolateVariableOnLeftRule";
import { MultiplyByReciprocalRule } from "./MultiplyByReciprocalRule";
import { DivideBothSidesRule } from "./DivideBothSidesRule";
import { SimplifyDivisionOfFractionsRule } from "./SimplifyDivisionOfFractionsRule";
import { EvaluateFractionRule } from "./EvaluateFractionRule";
import { EvaluateGroupedConstantsRule } from "./EvaluateGroupedConstantsRule";
import { EvaluateBinaryNumericExpressionRule } from "./EvaluateBinaryNumericExpressionRule";
import { MultiplyBothSidesRule } from "./MultiplyBothSidesRule";
import { DistributeMultiplicationOverAdditionRule } from "./DistributeMultiplicationOverAdditionRule";

export const stepRules = [
  new IsolateVariableOnLeftRule(),
  new MultiplyByReciprocalRule(),
  new MultiplyBothSidesRule(),
  new DivideBothSidesRule(),
  new DistributeMultiplicationOverAdditionRule(),
  new SimplifyDivisionOfFractionsRule(),
  new EvaluateFractionRule(),
  new NormalizeSubtractionRule(),     // 1) Unificar restas
  new ExpandPowerRule(),              // 2) Expandir potencias
  new ClearDenominatorRule(),         // 3) Quitar fracciones
  new EvaluateGroupedConstantsRule(),
  new EvaluateBinaryNumericExpressionRule(),
  new SimplifyConstantsRule(),        // 5) Simplificar  números
  new CombineLikeTermsRule(),         // 6) Combinar semejantes
  new DistributiveInverseRule(),      // 7) Distributiva inversa
  new SimplifyInsideGroupingRule(),   // 8) Simplificar dentro de ()
  new ExtractRootRule(),              // 9) Extraer raíces
  new QuadraticFormulaRule(),         // 10) Fórmula cuadrática
  new FactorAndSolvePolynomialRule(), // 11) Polinomios ≥3
  new InverseFunctionRule(),          // 12) Funciones inversas
  new DivideCoefficientRule(),        // 13) Dividir coeficientes

  new SolvePolynomialRule(),          // respaldo
];
