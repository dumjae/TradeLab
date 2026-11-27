export const TRADING_ACRONYMS: Record<string, string> = {
  BOS: 'Break of Structure',
  CHoCH: 'Change of Character',
  FVG: 'Fair Value Gap',
  OB: 'Order Block',
  SMC: 'Smart Money Concepts',
  SL: 'Stop Loss',
  TP: 'Take Profit',
  RR: 'Risk-to-Reward Ratio',
  HTF: 'Higher Timeframe',
  LTF: 'Lower Timeframe',
  OHLC: 'Open, High, Low, Close',
  OHLCV: 'Open, High, Low, Close, Volume',
  'P&L': 'Profit & Loss',
  BE: 'Breakeven',
  FOMO: 'Fear of Missing Out',
  VWAP: 'Volume Weighted Average Price',
  ATR: 'Average True Range',
  EMA: 'Exponential Moving Average',
  RSI: 'Relative Strength Index',
  ORB: 'Opening Range Breakout',
  OI: 'Open Interest',
  PF: 'Profit Factor',
  MDD: 'Max Drawdown',
  EQH: 'Equal Highs',
  EQL: 'Equal Lows',
  HH: 'Higher High',
  HL: 'Higher Low',
  LH: 'Lower High',
  LL: 'Lower Low',
  'S/R': 'Support & Resistance',
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const SORTED_ACRONYM_PATTERN = Object.keys(TRADING_ACRONYMS)
  .sort((a, b) => b.length - a.length)
  .map(escapeRegExp)
  .join('|');

const ACRONYM_MATCHER = new RegExp(
  `https?:\\/\\/\\S+|(?<![A-Za-z0-9_])(?:${SORTED_ACRONYM_PATTERN})(?![A-Za-z0-9_])`,
  'g',
);

export function formatAcronym(code: string): string {
  if (Object.prototype.hasOwnProperty.call(TRADING_ACRONYMS, code)) {
    return `${code} (${TRADING_ACRONYMS[code]})`;
  }
  return code;
}

export function expandAcronyms(text: string): string {
  if (!text) return text;

  const seen = new Set<string>();

  return text.replace(ACRONYM_MATCHER, (match, offset: number, fullString: string) => {
    if (match.startsWith('http://') || match.startsWith('https://')) {
      return match;
    }

    if (!Object.prototype.hasOwnProperty.call(TRADING_ACRONYMS, match)) {
      return match;
    }

    const expansion = TRADING_ACRONYMS[match];
    const after = fullString.slice(offset + match.length);
    if (/^\s*\(/.test(after)) {
      seen.add(match);
      return match;
    }

    const beforeTrimmed = fullString.slice(0, offset).trimEnd();
    if (
      beforeTrimmed.endsWith('(') &&
      beforeTrimmed.slice(0, -1).trimEnd().toLowerCase().endsWith(expansion.toLowerCase())
    ) {
      seen.add(match);
      return match;
    }

    if (seen.has(match)) {
      return match;
    }

    seen.add(match);
    return `${match} (${expansion})`;
  });
}
