export const LEVELS = {
  infinitesimals: {
    id: 'infinitesimals',
    title: 'Equivalent Infinitesimals',
    titleZh: '等价无穷小',
    themeColor: '#22d3ee',
    description: 'Pair formulas that behave the same as x approaches 0.',
    descriptionZh: '配对在 x 趋近于 0 时行为相同的公式。',
    groups: {
      x: {
        id: 'x',
        label: 'x 族',
        labelEn: 'x family',
        color: 'var(--family-x)',
        explanation: '当 x -> 0 时，这些函数与 x 的比值极限为 1。',
        explanationEn: 'These functions have limit 1 when divided by x as x -> 0.',
        expressions: [
          'x',
          '\\sin x',
          '\\tan x',
          '\\arcsin x',
          '\\arctan x',
          'e^x - 1',
          '\\ln(1+x)'
        ]
      },
      two_x: {
        id: 'two_x',
        label: '2x 族',
        labelEn: '2x family',
        color: 'var(--family-2x)',
        explanation: '把 x 替换为 2x，等价关系仍然成立。',
        explanationEn: 'Substituting 2x for x preserves the equivalence.',
        expressions: [
          '2x',
          '\\sin(2x)',
          '\\tan(2x)',
          'e^{2x} - 1',
          '\\ln(1+2x)'
        ]
      },
      half_x2: {
        id: 'half_x2',
        label: 'x²/2 族',
        labelEn: 'x²/2 family',
        color: 'var(--family-half-x2)',
        explanation: '1 - cos x 是 x²/2 的等价无穷小。',
        explanationEn: '1 - cos x is equivalent to x²/2 as x -> 0.',
        expressions: [
          '\\frac{1}{2}x^2',
          '1 - \\cos x'
        ]
      },
      x2: {
        id: 'x2',
        label: 'x² 族',
        labelEn: 'x² family',
        color: 'var(--family-x2)',
        explanation: '当 x -> 0 时，这些函数与 x² 等价。',
        explanationEn: 'These functions are equivalent to x² as x -> 0.',
        expressions: [
          'x^2',
          '2(1 - \\cos x)',
          '\\sin^2 x'
        ]
      }
    }
  },

  derivatives: {
    id: 'derivatives',
    title: 'Essence of Derivatives',
    titleZh: '导数本质',
    themeColor: '#34d399',
    description: 'Connect a derivative with its limit definition.',
    descriptionZh: '把导数与其极限定义式相连。',
    groups: {
      derivative_sin: {
        id: 'derivative_sin',
        label: 'sin x 的导数',
        labelEn: 'Derivative of sin x',
        color: 'var(--family-deriv)',
        explanation: '(sin x)\' 与极限式表示同一个概念。',
        explanationEn: 'Both notations represent the derivative of sin x.',
        expressions: [
          "(\\sin x)'",
          '\\lim_{h \\to 0} \\frac{\\sin(x+h)-\\sin x}{h}',
          '\\cos x'
        ]
      },
      derivative_cos: {
        id: 'derivative_cos',
        label: 'cos x 的导数',
        labelEn: 'Derivative of cos x',
        color: 'var(--family-deriv)',
        explanation: '(cos x)\' 的极限定义等于 -sin x。',
        explanationEn: 'The limit definition of (cos x)\' equals -sin x.',
        expressions: [
          "(\\cos x)'",
          '\\lim_{h \\to 0} \\frac{\\cos(x+h)-\\cos x}{h}',
          '-\\sin x'
        ]
      },
      derivative_exp: {
        id: 'derivative_exp',
        label: 'e^x 的导数',
        labelEn: 'Derivative of e^x',
        color: 'var(--family-deriv)',
        explanation: 'e^x 的导数还是它自己。',
        explanationEn: 'The derivative of e^x is itself.',
        expressions: [
          "(e^x)'",
          '\\lim_{h \\to 0} \\frac{e^{x+h}-e^x}{h}',
          'e^x'
        ]
      },
      derivative_ln: {
        id: 'derivative_ln',
        label: 'ln x 的导数',
        labelEn: 'Derivative of ln x',
        color: 'var(--family-deriv)',
        explanation: 'ln x 的导数是 1/x。',
        explanationEn: 'The derivative of ln x is 1/x.',
        expressions: [
          "(\\ln x)'",
          '\\lim_{h \\to 0} \\frac{\\ln(x+h)-\\ln x}{h}',
          '\\frac{1}{x}'
        ]
      }
    }
  },

  integrals: {
    id: 'integrals',
    title: 'Integral Duality',
    titleZh: '积分对偶',
    themeColor: '#34d399',
    description: 'Match functions with their antiderivatives.',
    descriptionZh: '把函数与其反导数配对。',
    groups: {
      integral_x: {
        id: 'integral_x',
        label: 'x 的积分',
        labelEn: 'Integral of x',
        color: 'var(--family-deriv)',
        explanation: 'x 的一个原函数是 x²/2。',
        explanationEn: 'An antiderivative of x is x²/2.',
        expressions: ['x', '\\frac{x^2}{2}']
      },
      integral_sin: {
        id: 'integral_sin',
        label: 'sin x 的积分',
        labelEn: 'Integral of sin x',
        color: 'var(--family-deriv)',
        explanation: 'sin x 的一个原函数是 -cos x。',
        explanationEn: 'An antiderivative of sin x is -cos x.',
        expressions: ['\\sin x', '-\\cos x']
      },
      integral_cos: {
        id: 'integral_cos',
        label: 'cos x 的积分',
        labelEn: 'Integral of cos x',
        color: 'var(--family-deriv)',
        explanation: 'cos x 的一个原函数是 sin x。',
        explanationEn: 'An antiderivative of cos x is sin x.',
        expressions: ['\\cos x', '\\sin x']
      },
      integral_exp: {
        id: 'integral_exp',
        label: 'e^x 的积分',
        labelEn: 'Integral of e^x',
        color: 'var(--family-deriv)',
        explanation: 'e^x 是它自己的原函数。',
        explanationEn: 'e^x is its own antiderivative.',
        expressions: ['e^x', 'e^x']
      },
      integral_one_over_x: {
        id: 'integral_one_over_x',
        label: '1/x 的积分',
        labelEn: 'Integral of 1/x',
        color: 'var(--family-deriv)',
        explanation: '1/x 的一个原函数是 ln|x|。',
        explanationEn: 'An antiderivative of 1/x is ln|x|.',
        expressions: ['\\frac{1}{x}', '\\ln|x|']
      }
    }
  },

  taylor: {
    id: 'taylor',
    title: 'Taylor Expansions',
    titleZh: '泰勒展开',
    themeColor: '#f87171',
    description: 'Connect functions with their low-order Taylor approximations.',
    descriptionZh: '把函数与其低阶泰勒近似相连。',
    groups: {
      taylor_exp: {
        id: 'taylor_exp',
        label: 'e^x 在 0 处展开',
        labelEn: 'Taylor series of e^x at 0',
        color: 'var(--family-taylor)',
        explanation: 'e^x ≈ 1 + x + x²/2 是在 x=0 附近的二阶近似。',
        explanationEn: 'This is the second-order Taylor approximation of e^x near 0.',
        expressions: [
          'e^x',
          '1 + x + \\frac{x^2}{2}'
        ]
      },
      taylor_sin: {
        id: 'taylor_sin',
        label: 'sin x 在 0 处展开',
        labelEn: 'Taylor series of sin x at 0',
        color: 'var(--family-taylor)',
        explanation: 'sin x ≈ x - x³/6 是在 x=0 附近的三阶近似。',
        explanationEn: 'This is the third-order Taylor approximation of sin x near 0.',
        expressions: [
          '\\sin x',
          'x - \\frac{x^3}{6}'
        ]
      },
      taylor_cos: {
        id: 'taylor_cos',
        label: 'cos x 在 0 处展开',
        labelEn: 'Taylor series of cos x at 0',
        color: 'var(--family-taylor)',
        explanation: 'cos x ≈ 1 - x²/2 是在 x=0 附近的二阶近似。',
        explanationEn: 'This is the second-order Taylor approximation of cos x near 0.',
        expressions: [
          '\\cos x',
          '1 - \\frac{x^2}{2}'
        ]
      },
      taylor_ln: {
        id: 'taylor_ln',
        label: 'ln(1+x) 在 0 处展开',
        labelEn: 'Taylor series of ln(1+x) at 0',
        color: 'var(--family-taylor)',
        explanation: 'ln(1+x) ≈ x - x²/2 是在 x=0 附近的二阶近似。',
        explanationEn: 'This is the second-order Taylor approximation of ln(1+x) near 0.',
        expressions: [
          '\\ln(1+x)',
          'x - \\frac{x^2}{2}'
        ]
      }
    }
  },

  trig: {
    id: 'trig',
    title: 'Trig Identities',
    titleZh: '三角恒等',
    themeColor: '#a3e635',
    description: 'Match equivalent trigonometric formulas.',
    descriptionZh: '配对等价的三角公式。',
    groups: {
      trig_pythagorean: {
        id: 'trig_pythagorean',
        label: '毕达哥拉斯恒等式',
        labelEn: 'Pythagorean identity',
        color: 'var(--family-trig)',
        explanation: 'sin²x + cos²x 恒等于 1。',
        explanationEn: 'sin²x + cos²x is identically equal to 1.',
        expressions: [
          '\\sin^2 x + \\cos^2 x',
          '1'
        ]
      },
      trig_sin_double: {
        id: 'trig_sin_double',
        label: '正弦二倍角',
        labelEn: 'Sine double angle',
        color: 'var(--family-trig)',
        explanation: 'sin(2x) = 2 sin x cos x。',
        explanationEn: 'sin(2x) equals 2 sin x cos x.',
        expressions: [
          '\\sin(2x)',
          '2\\sin x \\cos x'
        ]
      },
      trig_cos_double: {
        id: 'trig_cos_double',
        label: '余弦二倍角',
        labelEn: 'Cosine double angle',
        color: 'var(--family-trig)',
        explanation: 'cos(2x) 有多种等价写法。',
        explanationEn: 'cos(2x) has several equivalent forms.',
        expressions: [
          '\\cos(2x)',
          '1 - 2\\sin^2 x',
          '2\\cos^2 x - 1'
        ]
      },
      trig_one_minus_cos: {
        id: 'trig_one_minus_cos',
        label: '1 - cos²',
        labelEn: '1 - cos²',
        color: 'var(--family-trig)',
        explanation: '1 - cos²x = sin²x。',
        explanationEn: '1 - cos²x equals sin²x.',
        expressions: [
          '1 - \\cos^2 x',
          '\\sin^2 x'
        ]
      }
    }
  },

  inverse: {
    id: 'inverse',
    title: 'Inverse Pairs',
    titleZh: '反函数对',
    themeColor: '#818cf8',
    description: 'Connect inverse functions that undo each other.',
    descriptionZh: '配对相互抵消的反函数。',
    groups: {
      inverse_exp_ln: {
        id: 'inverse_exp_ln',
        label: '指数与对数',
        labelEn: 'Exponential and logarithm',
        color: 'var(--family-inverse)',
        explanation: '在 x > 0 时，e^{ln x} = x。',
        explanationEn: 'For x > 0, e^{ln x} equals x.',
        expressions: ['e^{\\ln x}', 'x']
      },
      inverse_ln_exp: {
        id: 'inverse_ln_exp',
        label: '对数与指数',
        labelEn: 'Logarithm and exponential',
        color: 'var(--family-inverse)',
        explanation: '对所有实数 x，ln(e^x) = x。',
        explanationEn: 'For all real x, ln(e^x) equals x.',
        expressions: ['\\ln(e^x)', 'x']
      },
      inverse_arcsin_sin: {
        id: 'inverse_arcsin_sin',
        label: 'arcsin 与 sin',
        labelEn: 'arcsin and sin',
        color: 'var(--family-inverse)',
        explanation: '在 [-π/2, π/2] 内，arcsin(sin x) = x。',
        explanationEn: 'On [-π/2, π/2], arcsin(sin x) equals x.',
        expressions: ['\\arcsin(\\sin x)', 'x']
      },
      inverse_arctan_tan: {
        id: 'inverse_arctan_tan',
        label: 'arctan 与 tan',
        labelEn: 'arctan and tan',
        color: 'var(--family-inverse)',
        explanation: '在 (-π/2, π/2) 内，arctan(tan x) = x。',
        explanationEn: 'On (-π/2, π/2), arctan(tan x) equals x.',
        expressions: ['\\arctan(\\tan x)', 'x']
      }
    }
  },

  limits: {
    id: 'limits',
    title: 'Famous Limits',
    titleZh: '重要极限',
    themeColor: '#fb923c',
    description: 'Match classic limits with their values.',
    descriptionZh: '把经典极限与其值配对。',
    groups: {
      limit_sin_over_x: {
        id: 'limit_sin_over_x',
        label: 'sin x / x',
        labelEn: 'Limit of sin x / x',
        color: 'var(--family-limits)',
        explanation: '这是微积分中最重要的极限之一。',
        explanationEn: 'One of the most important limits in calculus.',
        expressions: [
          '\\lim_{x \\to 0} \\frac{\\sin x}{x}',
          '1'
        ]
      },
      limit_one_plus_1_over_n: {
        id: 'limit_one_plus_1_over_n',
        label: '自然底数定义',
        labelEn: 'Definition of e',
        color: 'var(--family-limits)',
        explanation: '(1 + 1/n)^n 当 n→∞ 时趋近于 e。',
        explanationEn: '(1 + 1/n)^n approaches e as n goes to infinity.',
        expressions: [
          '\\lim_{n \\to \\infty} \\left(1+\\frac{1}{n}\\right)^n',
          'e'
        ]
      },
      limit_ln_one_plus_x: {
        id: 'limit_ln_one_plus_x',
        label: 'ln(1+x) / x',
        labelEn: 'Limit of ln(1+x) / x',
        color: 'var(--family-limits)',
        explanation: 'ln(1+x)/x 当 x→0 时极限为 1。',
        explanationEn: 'The limit of ln(1+x)/x as x->0 is 1.',
        expressions: [
          '\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x}',
          '1'
        ]
      },
      limit_e_power_minus_1: {
        id: 'limit_e_power_minus_1',
        label: '(e^x - 1) / x',
        labelEn: 'Limit of (e^x - 1) / x',
        color: 'var(--family-limits)',
        explanation: '(e^x - 1)/x 当 x→0 时极限为 1。',
        explanationEn: 'The limit of (e^x - 1)/x as x->0 is 1.',
        expressions: [
          '\\lim_{x \\to 0} \\frac{e^x - 1}{x}',
          '1'
        ]
      }
    }
  }
};

export const LEVEL_ORDER = [
  'infinitesimals',
  'derivatives',
  'integrals',
  'taylor',
  'trig',
  'inverse',
  'limits'
];

export function getLevel(levelId) {
  return LEVELS[levelId] || LEVELS.infinitesimals;
}

export function getNextLevelId(levelId) {
  const idx = LEVEL_ORDER.indexOf(levelId);
  return idx >= 0 && idx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[idx + 1] : null;
}
