import type { CandlePoint, ChartScenario } from '../types/academy';

type OhlcvTuple = readonly [
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
];

function buildCandles(
  startUnixSeconds: number,
  intervalSeconds: number,
  rows: readonly OhlcvTuple[],
): CandlePoint[] {
  return rows.map(([open, high, low, close, volume], index) => {
    const safeHigh = Math.max(high, open, close);
    const safeLow = Math.min(low, open, close);
    return {
      time: startUnixSeconds + index * intervalSeconds,
      open,
      high: safeHigh,
      low: safeLow,
      close,
      volume,
    };
  });
}

// 1. Market Structure Basics (EUR/USD 15m — HH/HL & Bullish BOS)
const msBullishBosStart = 1715587200; // 2024-05-13 08:00:00 UTC
const msBullishBosInterval = 900; // 15m
const msBullishBosCandles = buildCandles(msBullishBosStart, msBullishBosInterval, [
  [1.0802, 1.0810, 1.0798, 1.0808, 1120],
  [1.0808, 1.0816, 1.0805, 1.0814, 1250],
  [1.0814, 1.0823, 1.0811, 1.0821, 1340],
  [1.0821, 1.0831, 1.0818, 1.0829, 1480],
  [1.0829, 1.0838, 1.0826, 1.0836, 1520],
  [1.0836, 1.0844, 1.0833, 1.0842, 1690], // 5: Swing High 1 (1.0844)
  [1.0842, 1.0843, 1.0832, 1.0834, 1210],
  [1.0834, 1.0836, 1.0826, 1.0828, 1140],
  [1.0828, 1.0831, 1.0821, 1.0823, 1080],
  [1.0823, 1.0825, 1.0816, 1.0819, 1190], // 9: Higher Low 1 (1.0816)
  [1.0819, 1.0827, 1.0817, 1.0825, 1310],
  [1.0825, 1.0833, 1.0822, 1.0831, 1420],
  [1.0831, 1.0839, 1.0829, 1.0838, 1550],
  [1.0838, 1.0849, 1.0836, 1.0847, 2180], // 13: Bullish BOS #1 body close above 1.0844
  [1.0847, 1.0860, 1.0845, 1.0858, 2410],
  [1.0858, 1.0869, 1.0855, 1.0867, 2290],
  [1.0867, 1.0878, 1.0864, 1.0875, 2050], // 16: Higher High 1 (1.0878)
  [1.0875, 1.0876, 1.0866, 1.0868, 1460],
  [1.0868, 1.0870, 1.0860, 1.0862, 1320],
  [1.0862, 1.0864, 1.0854, 1.0856, 1280],
  [1.0856, 1.0858, 1.0849, 1.0852, 1370], // 20: Higher Low 2 (1.0849)
  [1.0852, 1.0860, 1.0850, 1.0859, 1540],
  [1.0859, 1.0867, 1.0857, 1.0865, 1660],
  [1.0865, 1.0874, 1.0863, 1.0872, 1790],
  [1.0872, 1.0884, 1.0870, 1.0882, 2480], // 24: Bullish BOS #2 body close above 1.0878
  [1.0882, 1.0892, 1.0880, 1.0890, 2320],
  [1.0890, 1.0899, 1.0887, 1.0897, 2110],
  [1.0897, 1.0906, 1.0894, 1.0903, 1980], // 27: Higher High 2 (1.0906)
  [1.0903, 1.0904, 1.0895, 1.0897, 1420],
  [1.0897, 1.0899, 1.0890, 1.0892, 1290],
  [1.0892, 1.0895, 1.0886, 1.0889, 1240],
  [1.0889, 1.0896, 1.0887, 1.0894, 1410],
  [1.0894, 1.0902, 1.0892, 1.0900, 1590],
  [1.0900, 1.0910, 1.0898, 1.0908, 1880],
  [1.0908, 1.0915, 1.0904, 1.0912, 1750],
]);

// 2. Market Liquidity (XAU/USD 1H — Buy-Side & Sell-Side Liquidity Pools)
const liqRangeStart = 1715644800; // 2024-05-14 00:00:00 UTC
const liqRangeInterval = 3600; // 1H
const liqRangeCandles = buildCandles(liqRangeStart, liqRangeInterval, [
  [2332.0, 2338.4, 2330.2, 2336.8, 3100],
  [2336.8, 2343.5, 2335.4, 2342.1, 3420],
  [2342.1, 2348.4, 2340.8, 2346.2, 3890], // 2: BSL ceiling established ~2348.5
  [2346.2, 2347.1, 2339.5, 2340.6, 3210],
  [2340.6, 2342.0, 2333.2, 2334.8, 2980],
  [2334.8, 2336.4, 2327.0, 2328.9, 3150],
  [2328.9, 2330.5, 2324.1, 2326.4, 3640], // 6: SSL floor established ~2324.0
  [2326.4, 2333.0, 2325.2, 2331.8, 3050],
  [2331.8, 2339.4, 2330.6, 2338.2, 3290],
  [2338.2, 2345.0, 2337.0, 2343.6, 3510],
  [2343.6, 2348.2, 2341.4, 2344.0, 3760], // 10: Second touch near BSL
  [2344.0, 2344.8, 2336.5, 2337.9, 3120],
  [2337.9, 2339.0, 2330.8, 2332.1, 2940],
  [2332.1, 2333.4, 2324.3, 2326.8, 3590], // 13: Second touch near SSL
  [2326.8, 2334.6, 2325.9, 2333.5, 3180],
  [2333.5, 2340.2, 2332.1, 2339.0, 3340],
  [2339.0, 2344.5, 2337.8, 2342.8, 3480],
  [2342.8, 2348.0, 2341.2, 2345.9, 3810], // 17: Third touch builds crowded BSL above 2348.5
  [2345.9, 2346.8, 2339.2, 2341.0, 3190],
  [2341.0, 2344.2, 2338.4, 2343.2, 3270],
  [2343.2, 2347.9, 2342.0, 2346.8, 3920],
  [2346.8, 2354.6, 2343.4, 2344.5, 5840], // 21: BSL Sweep wick above 2348.5 to 2354.6, closes back below!
  [2344.5, 2345.8, 2335.0, 2336.2, 5120],
  [2336.2, 2337.4, 2328.8, 2330.4, 4680],
  [2330.4, 2333.2, 2327.2, 2331.8, 3490],
  [2331.8, 2334.0, 2325.5, 2326.9, 4120],
  [2326.9, 2328.0, 2319.4, 2321.2, 5390], // 26: Draws cleanly into opposing SSL below 2324.0
  [2321.2, 2323.5, 2316.8, 2318.6, 4820],
  [2318.6, 2322.4, 2317.2, 2321.0, 3760],
  [2321.0, 2325.8, 2319.9, 2324.4, 3540],
  [2324.4, 2329.0, 2323.1, 2327.8, 3390],
  [2327.8, 2332.2, 2326.5, 2330.9, 3210],
  [2330.9, 2334.8, 2329.4, 2333.2, 3080],
  [2333.2, 2336.5, 2331.6, 2335.0, 2990],
]);

// 3. Equal Highs & Equal Lows (NAS100 5m — Equal Highs Pool & Reversal)
const eqhStart = 1715778000; // 2024-05-15 13:00:00 UTC
const eqhInterval = 300; // 5m
const eqhCandles = buildCandles(eqhStart, eqhInterval, [
  [18462.0, 18474.0, 18458.0, 18471.0, 1420],
  [18471.0, 18486.0, 18468.0, 18483.0, 1580],
  [18483.0, 18502.0, 18480.0, 18499.0, 1760],
  [18499.0, 18514.0, 18495.0, 18511.0, 1890],
  [18511.0, 18520.0, 18506.0, 18512.0, 2140], // 4: High #1 at 18520.0
  [18512.0, 18514.0, 18496.0, 18499.0, 1640],
  [18499.0, 18503.0, 18487.0, 18490.0, 1510],
  [18490.0, 18495.0, 18482.0, 18486.0, 1460],
  [18486.0, 18498.0, 18484.0, 18495.0, 1590],
  [18495.0, 18509.0, 18493.0, 18506.0, 1740],
  [18506.0, 18519.5, 18503.0, 18513.0, 2230], // 10: High #2 at 18519.5 (Equal Highs!)
  [18513.0, 18515.0, 18498.0, 18501.0, 1680],
  [18501.0, 18505.0, 18491.0, 18494.0, 1520],
  [18494.0, 18500.0, 18488.0, 18492.0, 1440],
  [18492.0, 18506.0, 18490.0, 18503.0, 1690],
  [18503.0, 18518.5, 18500.0, 18514.0, 2310], // 15: High #3 at 18518.5 (Triple EQH magnet)
  [18514.0, 18516.0, 18501.0, 18504.0, 1710],
  [18504.0, 18510.0, 18497.0, 18507.0, 1620],
  [18507.0, 18516.0, 18504.0, 18514.0, 1850],
  [18514.0, 18546.0, 18508.0, 18511.0, 3980], // 19: EQH Sweep wick to 18546.0, closes back below 18520!
  [18511.0, 18514.0, 18484.0, 18487.0, 3420], // 20: Strong bearish displacement
  [18487.0, 18491.0, 18468.0, 18471.0, 3190], // 21: Structure shift below 18482
  [18471.0, 18482.0, 18466.0, 18479.0, 2110],
  [18479.0, 18490.0, 18476.0, 18487.0, 1980], // 23: Controlled pullback retest
  [18487.0, 18489.0, 18468.0, 18470.0, 2640],
  [18470.0, 18473.0, 18455.0, 18458.0, 2890],
  [18458.0, 18462.0, 18446.0, 18449.0, 2740],
  [18449.0, 18454.0, 18438.0, 18442.0, 2520],
  [18442.0, 18448.0, 18434.0, 18438.0, 2310],
  [18438.0, 18445.0, 18431.0, 18435.0, 2190],
  [18435.0, 18441.0, 18426.0, 18429.0, 2080],
  [18429.0, 18436.0, 18424.0, 18433.0, 1840],
  [18433.0, 18440.0, 18428.0, 18431.0, 1720],
  [18431.0, 18435.0, 18421.0, 18424.0, 1890],
]);

// 4. Flagship Liquidity Sweep (EUR/USD 5m — BSL Sweep + Bearish Displacement)
const sweepBslStart = 1715860800; // 2024-05-16 12:00:00 UTC
const sweepBslInterval = 300; // 5m
const sweepBslCandles = buildCandles(sweepBslStart, sweepBslInterval, [
  [1.0836, 1.0842, 1.0833, 1.0840, 980],
  [1.0840, 1.0848, 1.0838, 1.0846, 1050],
  [1.0846, 1.0854, 1.0844, 1.0852, 1180],
  [1.0852, 1.0861, 1.0850, 1.0859, 1320],
  [1.0859, 1.0865, 1.0856, 1.0861, 1540], // 4: Swing High 1 (1.0865)
  [1.0861, 1.0862, 1.0854, 1.0856, 1120],
  [1.0856, 1.0858, 1.0849, 1.0851, 1080],
  [1.0851, 1.0853, 1.0846, 1.0849, 1160], // 7: Internal Higher Low (1.0846)
  [1.0849, 1.0856, 1.0848, 1.0854, 1210],
  [1.0854, 1.0861, 1.0852, 1.0859, 1340],
  [1.0859, 1.0865, 1.0857, 1.0862, 1620], // 10: Equal High #2 (1.0865)
  [1.0862, 1.0863, 1.0855, 1.0857, 1240],
  [1.0857, 1.0859, 1.0851, 1.0853, 1150],
  [1.0853, 1.0856, 1.0848, 1.0850, 1090],
  [1.0850, 1.0857, 1.0849, 1.0855, 1230],
  [1.0855, 1.0862, 1.0853, 1.0860, 1390],
  [1.0860, 1.0864, 1.0858, 1.0863, 1480], // 16: Compressing directly beneath BSL 1.0865
  [1.0863, 1.0864, 1.0859, 1.0861, 1360],
  [1.0861, 1.0865, 1.0859, 1.0863, 1510],
  [1.0863, 1.0882, 1.0857, 1.0859, 3420], // 19: SWEEP WICK to 1.0882, closes back below 1.0865 at 1.0859!
  [1.0859, 1.0861, 1.0845, 1.0847, 3180], // 20: Immediate bearish displacement
  [1.0847, 1.0849, 1.0836, 1.0838, 2940], // 21: Bearish BOS below 1.0846
  [1.0838, 1.0844, 1.0835, 1.0842, 1790],
  [1.0842, 1.0849, 1.0840, 1.0847, 1650], // 23: Pullback into mitigation zone
  [1.0847, 1.0848, 1.0837, 1.0839, 2380],
  [1.0839, 1.0841, 1.0829, 1.0831, 2590],
  [1.0831, 1.0833, 1.0822, 1.0824, 2440],
  [1.0824, 1.0827, 1.0818, 1.0820, 2180],
  [1.0820, 1.0824, 1.0814, 1.0816, 1960],
  [1.0816, 1.0820, 1.0811, 1.0813, 1840],
  [1.0813, 1.0818, 1.0810, 1.0815, 1620],
  [1.0815, 1.0819, 1.0812, 1.0814, 1510],
  [1.0814, 1.0817, 1.0808, 1.0810, 1690],
  [1.0810, 1.0815, 1.0806, 1.0812, 1580],
]);

// 5. Flagship True Breakout (BTC/USD 15m — Decisive Body Close + Retest Continuation)
const trueBreakoutStart = 1715947200; // 2024-05-17 12:00:00 UTC
const trueBreakoutInterval = 900; // 15m
const trueBreakoutCandles = buildCandles(trueBreakoutStart, trueBreakoutInterval, [
  [64620, 64790, 64560, 64740, 410],
  [64740, 64940, 64700, 64900, 455],
  [64900, 65160, 64860, 65120, 490],
  [65120, 65380, 65080, 65320, 540],
  [65320, 65400, 65210, 65260, 610], // 4: Resistance touch 1 at 65400
  [65260, 65300, 65060, 65110, 470],
  [65110, 65160, 64940, 64990, 440],
  [64990, 65080, 64910, 65050, 425],
  [65050, 65210, 65010, 65180, 460],
  [65180, 65360, 65140, 65330, 530],
  [65330, 65395, 65220, 65270, 595], // 10: Resistance touch 2 at 65395
  [65270, 65310, 65120, 65160, 465],
  [65160, 65220, 65080, 65140, 430],
  [65140, 65250, 65100, 65220, 475],
  [65220, 65340, 65190, 65310, 520],
  [65310, 65385, 65260, 65350, 560], // 15: Tight higher-low buildup under resistance
  [65350, 65395, 65290, 65375, 590],
  [65375, 65400, 65310, 65380, 615],
  [65380, 65860, 65360, 65820, 1280], // 18: TRUE BREAKOUT — full bullish body close at 65820!
  [65820, 66040, 65780, 65990, 1140], // 19: Follow-through acceptance above 65400
  [65990, 66050, 65760, 65810, 740],
  [65810, 65840, 65580, 65620, 660],
  [65620, 65660, 65425, 65510, 690], // 22: Clean retest holds above 65400 as new support
  [65510, 65780, 65490, 65740, 890],
  [65740, 66080, 65710, 66040, 1040],
  [66040, 66320, 66000, 66280, 1120],
  [66280, 66510, 66220, 66460, 990],
  [66460, 66540, 66340, 66390, 720],
  [66390, 66580, 66350, 66540, 840],
  [66540, 66790, 66500, 66740, 960],
  [66740, 66920, 66690, 66880, 910],
  [66880, 67010, 66810, 66950, 860],
  [66950, 67040, 66860, 66910, 730],
  [66910, 67090, 66880, 67050, 820],
]);

// 6. Practice Sell-Side Liquidity Sweep (GBP/USD 5m — SSL Sweep + Bullish Shift)
const sweepSslStart = 1716199200; // 2024-05-20 10:00:00 UTC
const sweepSslInterval = 300; // 5m
const sweepSslCandles = buildCandles(sweepSslStart, sweepSslInterval, [
  [1.2682, 1.2686, 1.2674, 1.2676, 1020],
  [1.2676, 1.2679, 1.2666, 1.2668, 1140],
  [1.2668, 1.2670, 1.2655, 1.2658, 1290],
  [1.2658, 1.2661, 1.2646, 1.2649, 1410],
  [1.2649, 1.2653, 1.2640, 1.2646, 1650], // 4: Equal Low #1 at 1.2640
  [1.2646, 1.2656, 1.2644, 1.2654, 1280],
  [1.2654, 1.2664, 1.2652, 1.2662, 1320],
  [1.2662, 1.2668, 1.2658, 1.2661, 1260], // 7: Internal Lower High (1.2668)
  [1.2661, 1.2662, 1.2651, 1.2653, 1180],
  [1.2653, 1.2655, 1.2645, 1.2648, 1240],
  [1.2648, 1.2651, 1.2640, 1.2645, 1720], // 10: Equal Low #2 at 1.2640 (SSL Pool)
  [1.2645, 1.2654, 1.2643, 1.2652, 1340],
  [1.2652, 1.2659, 1.2649, 1.2656, 1290],
  [1.2656, 1.2658, 1.2648, 1.2650, 1220],
  [1.2650, 1.2652, 1.2644, 1.2646, 1310],
  [1.2646, 1.2649, 1.2641, 1.2644, 1460],
  [1.2644, 1.2647, 1.2641, 1.2643, 1520],
  [1.2643, 1.2649, 1.2621, 1.2647, 3560], // 17: SSL SWEEP WICK to 1.2621, closes back above 1.2640!
  [1.2647, 1.2662, 1.2645, 1.2660, 3190], // 18: Strong bullish displacement
  [1.2660, 1.2674, 1.2658, 1.2672, 2980], // 19: Bullish BOS above 1.2668
  [1.2672, 1.2675, 1.2663, 1.2665, 1740],
  [1.2665, 1.2667, 1.2658, 1.2661, 1590], // 21: Clean retracement
  [1.2661, 1.2673, 1.2660, 1.2671, 2240],
  [1.2671, 1.2683, 1.2669, 1.2681, 2480],
  [1.2681, 1.2692, 1.2678, 1.2690, 2360],
  [1.2690, 1.2699, 1.2687, 1.2696, 2190],
  [1.2696, 1.2704, 1.2692, 1.2701, 2040],
  [1.2701, 1.2708, 1.2698, 1.2705, 1910],
  [1.2705, 1.2707, 1.2697, 1.2700, 1580],
  [1.2700, 1.2706, 1.2698, 1.2704, 1620],
  [1.2704, 1.2712, 1.2701, 1.2710, 1840],
  [1.2710, 1.2716, 1.2707, 1.2714, 1790],
  [1.2714, 1.2718, 1.2709, 1.2712, 1510],
  [1.2712, 1.2720, 1.2710, 1.2718, 1680],
]);

// 7. Practice True Bearish Breakdown (XAU/USD 15m — Acceptance Below Support)
const trueBreakdownStart = 1716285600; // 2024-05-21 10:00:00 UTC
const trueBreakdownInterval = 900; // 15m
const trueBreakdownCandles = buildCandles(
  trueBreakdownStart,
  trueBreakdownInterval,
  [
    [2346.0, 2348.5, 2342.4, 2343.2, 2240],
    [2343.2, 2344.6, 2338.8, 2339.6, 2380],
    [2339.6, 2341.0, 2334.5, 2335.8, 2510],
    [2335.8, 2337.2, 2332.1, 2334.0, 2790], // 3: Support touch 1 at 2332.0
    [2334.0, 2338.4, 2333.2, 2337.6, 2190],
    [2337.6, 2341.2, 2336.8, 2340.1, 2110],
    [2340.1, 2341.8, 2337.5, 2338.2, 2060],
    [2338.2, 2339.0, 2334.2, 2335.0, 2280],
    [2335.0, 2336.1, 2332.0, 2333.6, 2860], // 8: Support touch 2 at 2332.0
    [2333.6, 2337.0, 2332.8, 2336.2, 2140],
    [2336.2, 2338.4, 2335.1, 2337.1, 2020],
    [2337.1, 2337.8, 2334.0, 2334.6, 2210],
    [2334.6, 2335.5, 2332.4, 2333.2, 2490],
    [2333.2, 2334.8, 2332.2, 2332.9, 2610], // 13: Lower highs pressing onto support
    [2332.9, 2334.0, 2332.1, 2332.6, 2740],
    [2332.6, 2333.2, 2325.4, 2326.2, 5420], // 15: TRUE BREAKDOWN — full-body close at 2326.2!
    [2326.2, 2327.4, 2321.8, 2322.6, 4890], // 16: Immediate bearish follow-through
    [2322.6, 2326.8, 2322.0, 2326.0, 3120],
    [2326.0, 2331.4, 2325.4, 2329.8, 2980], // 18: Retest fails below 2332.0 (support flipped to resistance)
    [2329.8, 2330.6, 2324.0, 2324.8, 3840],
    [2324.8, 2325.9, 2319.2, 2320.1, 4210],
    [2320.1, 2321.5, 2315.6, 2316.8, 4050],
    [2316.8, 2318.4, 2313.0, 2314.2, 3690],
    [2314.2, 2316.9, 2313.4, 2316.0, 2780],
    [2316.0, 2317.2, 2311.5, 2312.4, 3420],
    [2312.4, 2313.8, 2308.6, 2309.5, 3580],
    [2309.5, 2311.0, 2306.5, 2307.8, 3310],
    [2307.8, 2310.2, 2306.8, 2309.1, 2640],
    [2309.1, 2310.8, 2305.4, 2306.4, 3190],
    [2306.4, 2308.0, 2303.8, 2304.9, 2970],
    [2304.9, 2307.4, 2304.0, 2306.2, 2480],
    [2306.2, 2307.9, 2303.2, 2304.1, 2720],
    [2304.1, 2306.0, 2302.5, 2303.6, 2590],
    [2303.6, 2305.8, 2302.8, 2304.8, 2340],
  ],
);

// 8. Fair Value Gap (EUR/USD 15m — 3-Candle Bullish FVG & 50% Mitigation)
const fvgStart = 1716364800; // 2024-05-22 08:00:00 UTC
const fvgInterval = 900; // 15m
const fvgCandles = buildCandles(fvgStart, fvgInterval, [
  [1.0828, 1.0833, 1.0824, 1.0826, 1080],
  [1.0826, 1.0830, 1.0821, 1.0823, 1120],
  [1.0823, 1.0827, 1.0819, 1.0822, 1060],
  [1.0822, 1.0828, 1.0818, 1.0825, 1140],
  [1.0825, 1.0829, 1.0820, 1.0822, 1090],
  [1.0822, 1.0825, 1.0816, 1.0819, 1190],
  [1.0819, 1.0824, 1.0817, 1.0822, 1150],
  [1.0822, 1.0826, 1.0818, 1.0821, 1110],
  [1.0821, 1.0824, 1.0811, 1.0820, 1980], // 8: Local sell-side liquidity grab
  [1.0820, 1.0830, 1.0818, 1.0828, 1620], // 9: FVG Candle 1 (High = 1.0830)
  [1.0828, 1.0854, 1.0827, 1.0852, 3480], // 10: FVG Candle 2 (Displacement impulse!)
  [1.0852, 1.0864, 1.0846, 1.0861, 2740], // 11: FVG Candle 3 (Low = 1.0846 => Gap: 1.0830 - 1.0846)
  [1.0861, 1.0869, 1.0858, 1.0866, 2110],
  [1.0866, 1.0872, 1.0862, 1.0868, 1890],
  [1.0868, 1.0870, 1.0859, 1.0861, 1520],
  [1.0861, 1.0863, 1.0853, 1.0855, 1410],
  [1.0855, 1.0857, 1.0848, 1.0850, 1380],
  [1.0850, 1.0852, 1.0842, 1.0844, 1490], // 17: Enters top of Bullish FVG
  [1.0844, 1.0847, 1.0837, 1.0845, 2260], // 18: Mitigates 50% FVG equilibrium (~1.0838) and rejects up!
  [1.0845, 1.0858, 1.0844, 1.0856, 2590],
  [1.0856, 1.0868, 1.0854, 1.0866, 2740],
  [1.0866, 1.0877, 1.0864, 1.0875, 2890], // 21: Breaks prior high (1.0872) — continuation BOS
  [1.0875, 1.0884, 1.0872, 1.0882, 2610],
  [1.0882, 1.0890, 1.0879, 1.0887, 2380],
  [1.0887, 1.0894, 1.0883, 1.0891, 2190],
  [1.0891, 1.0895, 1.0885, 1.0888, 1740],
  [1.0888, 1.0891, 1.0881, 1.0884, 1560],
  [1.0884, 1.0892, 1.0882, 1.0890, 1680],
  [1.0890, 1.0898, 1.0888, 1.0896, 1940],
  [1.0896, 1.0904, 1.0894, 1.0902, 2080],
  [1.0902, 1.0908, 1.0899, 1.0905, 1890],
  [1.0905, 1.0907, 1.0898, 1.0901, 1620],
  [1.0901, 1.0909, 1.0899, 1.0907, 1740],
  [1.0907, 1.0914, 1.0904, 1.0911, 1820],
]);

// 9. Risk Management & 1:3 R-Multiple Execution (GBP/USD 15m)
const riskSetupStart = 1716451200; // 2024-05-23 08:00:00 UTC
const riskSetupInterval = 900; // 15m
const riskSetupCandles = buildCandles(riskSetupStart, riskSetupInterval, [
  [1.2636, 1.2644, 1.2632, 1.2642, 1120],
  [1.2642, 1.2652, 1.2640, 1.2650, 1240],
  [1.2650, 1.2662, 1.2648, 1.2660, 1380],
  [1.2660, 1.2671, 1.2657, 1.2669, 1510],
  [1.2669, 1.2676, 1.2665, 1.2672, 1460],
  [1.2672, 1.2674, 1.2660, 1.2662, 1320],
  [1.2662, 1.2665, 1.2651, 1.2654, 1290],
  [1.2654, 1.2657, 1.2644, 1.2647, 1440], // 7: Structural Higher Low at 1.2644 (SL placed safely at 1.2640)
  [1.2647, 1.2659, 1.2646, 1.2657, 1680],
  [1.2657, 1.2672, 1.2655, 1.2670, 1940],
  [1.2670, 1.2684, 1.2668, 1.2682, 2260], // 10: Bullish BOS above 1.2676
  [1.2682, 1.2688, 1.2678, 1.2684, 1980],
  [1.2684, 1.2686, 1.2674, 1.2676, 1520],
  [1.2676, 1.2678, 1.2666, 1.2668, 1460],
  [1.2668, 1.2670, 1.2658, 1.2661, 1620], // 14: Planned Limit Entry fills cleanly at 1.2660 (1R = 20 pips to 1.2640)
  [1.2661, 1.2664, 1.2651, 1.2655, 1540], // 15: Normal drawdown stays well above 1.2640 invalidation
  [1.2655, 1.2666, 1.2653, 1.2664, 1790],
  [1.2664, 1.2676, 1.2662, 1.2674, 2040],
  [1.2674, 1.2685, 1.2671, 1.2683, 2180], // 18: +1R reached (1.2680)
  [1.2683, 1.2692, 1.2680, 1.2690, 2290],
  [1.2690, 1.2695, 1.2682, 1.2685, 1740], // 20: Minor pause — patience required!
  [1.2685, 1.2694, 1.2683, 1.2692, 1890],
  [1.2692, 1.2703, 1.2690, 1.2701, 2340], // 22: +2R reached (1.2700)
  [1.2701, 1.2710, 1.2698, 1.2708, 2410],
  [1.2708, 1.2715, 1.2704, 1.2713, 2260],
  [1.2713, 1.2722, 1.2710, 1.2720, 2680], // 25: +3R Target Hit at 1.2720!
  [1.2720, 1.2725, 1.2714, 1.2717, 2120],
  [1.2717, 1.2721, 1.2709, 1.2712, 1860],
  [1.2712, 1.2716, 1.2706, 1.2709, 1710],
  [1.2709, 1.2715, 1.2705, 1.2713, 1640],
  [1.2713, 1.2720, 1.2710, 1.2718, 1780],
  [1.2718, 1.2724, 1.2714, 1.2721, 1820],
  [1.2721, 1.2726, 1.2716, 1.2719, 1690],
  [1.2719, 1.2723, 1.2715, 1.2720, 1580],
]);

export const CHART_SCENARIOS: ChartScenario[] = [
  {
    id: 'ms-bullish-bos',
    lessonSlug: 'market-structure',
    title: 'Bullish Market Structure (HH/HL & Break of Structure)',
    symbol: 'EUR/USD',
    timeframe: '15m',
    category: 'market_structure',
    description:
      'Sequential Higher Highs (HH) and Higher Lows (HL) confirmed by full candle-body closes above prior swing highs (BOS).',
    isPracticeEligible: true,
    correctClassification: 'bullish_bos',
    candles: msBullishBosCandles,
    priceLines: [
      {
        id: 'ms-bos-1',
        price: 1.0844,
        title: 'Swing High 1 / BOS #1',
        color: '#10b981',
        lineStyle: 'dashed',
        role: 'bos',
      },
      {
        id: 'ms-bos-2',
        price: 1.0878,
        title: 'Higher High 1 / BOS #2',
        color: '#10b981',
        lineStyle: 'dashed',
        role: 'bos',
      },
      {
        id: 'ms-hl-1',
        price: 1.0816,
        title: 'Protected Higher Low 1',
        color: '#38bdf8',
        lineStyle: 'dotted',
        role: 'support_resistance',
      },
    ],
    markers: [
      {
        id: 'ms-m1',
        time: msBullishBosCandles[5].time,
        position: 'aboveBar',
        color: '#38bdf8',
        shape: 'circle',
        text: 'SH1',
        stage: 'before',
      },
      {
        id: 'ms-m2',
        time: msBullishBosCandles[9].time,
        position: 'belowBar',
        color: '#10b981',
        shape: 'arrowUp',
        text: 'HL1',
        stage: 'before',
      },
      {
        id: 'ms-m3',
        time: msBullishBosCandles[13].time,
        position: 'aboveBar',
        color: '#10b981',
        shape: 'arrowUp',
        text: 'BOS #1',
        stage: 'trigger',
      },
      {
        id: 'ms-m4',
        time: msBullishBosCandles[20].time,
        position: 'belowBar',
        color: '#10b981',
        shape: 'arrowUp',
        text: 'HL2',
        stage: 'after',
      },
      {
        id: 'ms-m5',
        time: msBullishBosCandles[24].time,
        position: 'aboveBar',
        color: '#10b981',
        shape: 'arrowUp',
        text: 'BOS #2',
        stage: 'after',
      },
    ],
    replay: {
      beforeEndIndex: 11,
      triggerEndIndex: 16,
      afterEndIndex: msBullishBosCandles.length - 1,
      beforeSummary:
        'Before: Price prints an initial Swing High (1.0844) and pulls back to form a Higher Low (1.0816) without breaking prior demand.',
      triggerSummary:
        'Trigger: A decisive bullish candle closes above 1.0844, confirming a valid Break of Structure (BOS #1) and establishing bullish order flow.',
      afterSummary:
        'After: Price repeats the cycle—forming Higher Low 2 (1.0849) and breaking above 1.0878 (BOS #2) to sustain the uptrend.',
    },
    teachingTakeaways: [
      'A valid BOS requires a candle body close beyond the prior structural swing, not merely a thin wick poke.',
      'Each new Higher Low becomes the structural invalidation point for the bullish trend.',
    ],
  },
  {
    id: 'liq-bsl-ssl-range',
    lessonSlug: 'market-liquidity',
    title: 'Buy-Side & Sell-Side Liquidity Pools in a Range',
    symbol: 'XAU/USD',
    timeframe: '1H',
    category: 'liquidity_pool',
    description:
      'Gold builds obvious Buy-Side Liquidity (BSL) above 2348.5 and Sell-Side Liquidity (SSL) below 2324.0 before sweeping BSL and rotating into opposing SSL.',
    isPracticeEligible: false,
    correctClassification: 'liquidity_sweep',
    candles: liqRangeCandles,
    priceLines: [
      {
        id: 'liq-bsl',
        price: 2348.5,
        title: 'Buy-Side Liquidity (BSL)',
        color: '#f59e0b',
        lineStyle: 'dashed',
        role: 'buy_side_liquidity',
      },
      {
        id: 'liq-ssl',
        price: 2324.0,
        title: 'Sell-Side Liquidity (SSL)',
        color: '#38bdf8',
        lineStyle: 'dashed',
        role: 'sell_side_liquidity',
      },
    ],
    markers: [
      {
        id: 'liq-m1',
        time: liqRangeCandles[10].time,
        position: 'aboveBar',
        color: '#f59e0b',
        shape: 'circle',
        text: 'BSL Builds',
        stage: 'before',
      },
      {
        id: 'liq-m2',
        time: liqRangeCandles[13].time,
        position: 'belowBar',
        color: '#38bdf8',
        shape: 'circle',
        text: 'SSL Builds',
        stage: 'before',
      },
      {
        id: 'liq-m3',
        time: liqRangeCandles[21].time,
        position: 'aboveBar',
        color: '#ef4444',
        shape: 'arrowDown',
        text: 'BSL Swept',
        stage: 'trigger',
      },
      {
        id: 'liq-m4',
        time: liqRangeCandles[26].time,
        position: 'belowBar',
        color: '#10b981',
        shape: 'arrowDown',
        text: 'SSL Reached',
        stage: 'after',
      },
    ],
    replay: {
      beforeEndIndex: 18,
      triggerEndIndex: 22,
      afterEndIndex: liqRangeCandles.length - 1,
      beforeSummary:
        'Before: Repeated bounces between 2348.5 and 2324.0 concentrate short stop-losses above the range high (BSL) and long stop-losses below the range low (SSL).',
      triggerSummary:
        'Trigger: Price spikes briefly to 2354.6 to absorb resting buy-stop orders above 2348.5, then closes back inside the range.',
      afterSummary:
        'After: With buy-side liquidity filled, institutional supply drives price efficiently across the entire range to target opposing sell-side liquidity below 2324.0.',
    },
    teachingTakeaways: [
      'Price frequently moves from one liquidity pool (BSL) to the opposing liquidity pool (SSL).',
      'Obvious multi-touch range boundaries act as order magnets rather than impenetrable walls.',
    ],
  },
  {
    id: 'eqh-sweep-reversal',
    lessonSlug: 'equal-highs-lows',
    title: 'Equal Highs (EQH) Liquidity Magnet & Reversal',
    symbol: 'NAS100',
    timeframe: '5m',
    category: 'equal_highs_lows',
    description:
      'Three closely aligned highs around 18520.0 create a textbook Equal Highs liquidity pool that gets raided prior to bearish displacement.',
    isPracticeEligible: true,
    isSweep: true,
    correctClassification: 'liquidity_sweep',
    candles: eqhCandles,
    priceLines: [
      {
        id: 'eqh-level',
        price: 18520.0,
        title: 'Equal Highs (EQH / BSL)',
        color: '#f59e0b',
        lineStyle: 'dashed',
        role: 'buy_side_liquidity',
      },
      {
        id: 'eqh-bos',
        price: 18482.0,
        title: 'Structure Shift Level',
        color: '#ef4444',
        lineStyle: 'dotted',
        role: 'bos',
      },
    ],
    markers: [
      {
        id: 'eqh-m1',
        time: eqhCandles[4].time,
        position: 'aboveBar',
        color: '#f59e0b',
        shape: 'circle',
        text: 'High 1',
        stage: 'before',
      },
      {
        id: 'eqh-m2',
        time: eqhCandles[10].time,
        position: 'aboveBar',
        color: '#f59e0b',
        shape: 'circle',
        text: 'EQH 2',
        stage: 'before',
      },
      {
        id: 'eqh-m3',
        time: eqhCandles[15].time,
        position: 'aboveBar',
        color: '#f59e0b',
        shape: 'circle',
        text: 'EQH 3',
        stage: 'before',
      },
      {
        id: 'eqh-m4',
        time: eqhCandles[19].time,
        position: 'aboveBar',
        color: '#ef4444',
        shape: 'arrowDown',
        text: 'EQH Sweep',
        stage: 'trigger',
      },
      {
        id: 'eqh-m5',
        time: eqhCandles[21].time,
        position: 'belowBar',
        color: '#ef4444',
        shape: 'arrowDown',
        text: 'Bearish BOS',
        stage: 'after',
      },
    ],
    replay: {
      beforeEndIndex: 17,
      triggerEndIndex: 20,
      afterEndIndex: eqhCandles.length - 1,
      beforeSummary:
        'Before: Three separate peaks stall near 18520.0, creating clean "triple top" Equal Highs with tight stops stacked directly above.',
      triggerSummary:
        'Trigger: A fast 5-minute candle shoots to 18546.0—triggering breakout buyers and short stops—before snapping closed below 18520.0.',
      afterSummary:
        'After: Aggressive bearish displacement breaks 18482.0, trapping late buyers and driving continuation toward 18424.0.',
    },
    teachingTakeaways: [
      'Retail traders view Equal Highs as strong resistance; smart money views the resting orders above them as high-density liquidity.',
      'Avoid placing stops immediately above clean Equal Highs or buying the very first spike above them without body-close confirmation.',
    ],
  },
  {
    id: 'sweep-bsl-displacement',
    lessonSlug: 'liquidity-sweeps',
    title: 'Buy-Side Liquidity Sweep + Bearish Displacement',
    symbol: 'EUR/USD',
    timeframe: '5m',
    category: 'liquidity_sweep',
    description:
      'Flagship Liquidity Sweep example: price wicks decisively above Equal Highs at 1.0865, closes back inside the range, and displaces downward through internal structure.',
    isPracticeEligible: true,
    isSweep: true,
    correctClassification: 'liquidity_sweep',
    candles: sweepBslCandles,
    priceLines: [
      {
        id: 'sw-bsl',
        price: 1.0865,
        title: 'Buy-Side Liquidity (Equal Highs)',
        color: '#f59e0b',
        lineStyle: 'dashed',
        role: 'buy_side_liquidity',
      },
      {
        id: 'sw-bos',
        price: 1.0846,
        title: 'Internal Structure Shift (BOS)',
        color: '#ef4444',
        lineStyle: 'dotted',
        role: 'bos',
      },
    ],
    markers: [
      {
        id: 'sw-m1',
        time: sweepBslCandles[4].time,
        position: 'aboveBar',
        color: '#f59e0b',
        shape: 'circle',
        text: 'High 1',
        stage: 'before',
      },
      {
        id: 'sw-m2',
        time: sweepBslCandles[10].time,
        position: 'aboveBar',
        color: '#f59e0b',
        shape: 'circle',
        text: 'Equal High',
        stage: 'before',
      },
      {
        id: 'sw-m3',
        time: sweepBslCandles[19].time,
        position: 'aboveBar',
        color: '#ef4444',
        shape: 'arrowDown',
        text: 'Sweep Wick',
        stage: 'trigger',
      },
      {
        id: 'sw-m4',
        time: sweepBslCandles[21].time,
        position: 'belowBar',
        color: '#ef4444',
        shape: 'arrowDown',
        text: 'Displacement BOS',
        stage: 'after',
      },
    ],
    replay: {
      beforeEndIndex: 17,
      triggerEndIndex: 20,
      afterEndIndex: sweepBslCandles.length - 1,
      beforeSummary:
        'Before: EUR/USD forms clean Equal Highs at 1.0865 while compressing underneath, building resting buy-stop orders above the level.',
      triggerSummary:
        'Trigger: Candle 20 spikes 17 pips above resistance to 1.0882 on high volume, then rejects sharply and closes back below 1.0865 at 1.0859.',
      afterSummary:
        'After: Back-to-back bearish displacement candles slice through the 1.0846 higher low, confirming the liquidity raid and shifting structure bearish.',
    },
    teachingTakeaways: [
      'Three signatures of a valid sweep: (1) resting liquidity above equal highs, (2) spike + close back inside the level, and (3) immediate opposite displacement.',
      'Waiting for the candle close prevents buying the exact top of the sweep wick.',
    ],
  },
  {
    id: 'true-breakout-retest',
    lessonSlug: 'liquidity-sweeps',
    title: 'True Breakout with Body Acceptance & Support Retest',
    symbol: 'BTC/USD',
    timeframe: '15m',
    category: 'true_breakout',
    description:
      'Contrast example against a sweep: BTC/USD closes decisively above 65,400 with full-bodied momentum, holds acceptance on the retest, and continues higher.',
    isPracticeEligible: true,
    isSweep: false,
    correctClassification: 'true_breakout',
    candles: trueBreakoutCandles,
    priceLines: [
      {
        id: 'tb-res',
        price: 65400,
        title: 'Resistance / Breakout Level',
        color: '#10b981',
        lineStyle: 'dashed',
        role: 'support_resistance',
      },
    ],
    markers: [
      {
        id: 'tb-m1',
        time: trueBreakoutCandles[10].time,
        position: 'aboveBar',
        color: '#f59e0b',
        shape: 'circle',
        text: 'Resistance',
        stage: 'before',
      },
      {
        id: 'tb-m2',
        time: trueBreakoutCandles[18].time,
        position: 'aboveBar',
        color: '#10b981',
        shape: 'arrowUp',
        text: 'Full-Body Breakout',
        stage: 'trigger',
      },
      {
        id: 'tb-m3',
        time: trueBreakoutCandles[22].time,
        position: 'belowBar',
        color: '#10b981',
        shape: 'arrowUp',
        text: 'Support Retest',
        stage: 'after',
      },
    ],
    replay: {
      beforeEndIndex: 17,
      triggerEndIndex: 20,
      afterEndIndex: trueBreakoutCandles.length - 1,
      beforeSummary:
        'Before: Higher lows coil tightly beneath the 65,400 resistance ceiling, signaling steady buyer absorption rather than exhaustion.',
      triggerSummary:
        'Trigger: A strong expansion candle closes cleanly at 65,820 with minimal upper wick and immediate follow-through to 65,990—confirming price acceptance.',
      afterSummary:
        'After: The pullback respects 65,400 from above (65,425 low) without closing back inside the range, launching continuation toward 67,050.',
    },
    teachingTakeaways: [
      'A True Breakout shows strong candle body closes above the level, immediate follow-through, and acceptance on retests.',
      'Fading every move above resistance without waiting for rejection is just as dangerous as chasing every spike.',
    ],
  },
  {
    id: 'sweep-ssl-bullish-shift',
    lessonSlug: 'liquidity-sweeps',
    title: 'Sell-Side Liquidity Sweep into Bullish Reversal',
    symbol: 'GBP/USD',
    timeframe: '5m',
    category: 'liquidity_sweep',
    description:
      'Practice scenario: price wicks sharply under Equal Lows at 1.2640, reclaims the range before candle close, and shifts structure bullish above 1.2668.',
    isPracticeEligible: true,
    isSweep: true,
    correctClassification: 'liquidity_sweep',
    candles: sweepSslCandles,
    priceLines: [
      {
        id: 'ssl-level',
        price: 1.264,
        title: 'Sell-Side Liquidity (Equal Lows)',
        color: '#38bdf8',
        lineStyle: 'dashed',
        role: 'sell_side_liquidity',
      },
      {
        id: 'ssl-bos',
        price: 1.2668,
        title: 'Bullish Structure Shift (BOS)',
        color: '#10b981',
        lineStyle: 'dotted',
        role: 'bos',
      },
    ],
    markers: [
      {
        id: 'ssl-m1',
        time: sweepSslCandles[10].time,
        position: 'belowBar',
        color: '#38bdf8',
        shape: 'circle',
        text: 'Equal Lows',
        stage: 'before',
      },
      {
        id: 'ssl-m2',
        time: sweepSslCandles[17].time,
        position: 'belowBar',
        color: '#10b981',
        shape: 'arrowUp',
        text: 'SSL Sweep Wick',
        stage: 'trigger',
      },
      {
        id: 'ssl-m3',
        time: sweepSslCandles[19].time,
        position: 'aboveBar',
        color: '#10b981',
        shape: 'arrowUp',
        text: 'Bullish BOS',
        stage: 'after',
      },
    ],
    replay: {
      beforeEndIndex: 16,
      triggerEndIndex: 18,
      afterEndIndex: sweepSslCandles.length - 1,
      beforeSummary:
        'Before: GBP/USD prints Equal Lows at 1.2640, encouraging retail traders to place long stops and breakdown sell orders directly beneath.',
      triggerSummary:
        'Trigger: A rapid wick dips to 1.2621 to trigger sell-side liquidity, then snaps closed back above 1.2640 at 1.2647.',
      afterSummary:
        'After: Immediate bullish displacement breaks 1.2668, confirming buyers absorbed the stop run and initiating a steady rally to 1.2718.',
    },
    teachingTakeaways: [
      'Liquidity sweeps work symmetrically on both sides of the market—below Equal Lows (SSL) as well as above Equal Highs (BSL).',
      'Look for the long lower rejection wick combined with a fast reclaim and opposite BOS.',
    ],
  },
  {
    id: 'true-breakdown-momentum',
    lessonSlug: 'liquidity-sweeps',
    title: 'True Bearish Breakdown Below Support',
    symbol: 'XAU/USD',
    timeframe: '15m',
    category: 'true_breakout',
    description:
      'Practice scenario: Gold breaks support at 2332.0 with a decisive full-bodied bearish close, fails to reclaim on the retest, and trends steadily lower.',
    isPracticeEligible: true,
    isSweep: false,
    correctClassification: 'true_breakout',
    candles: trueBreakdownCandles,
    priceLines: [
      {
        id: 'tbd-sup',
        price: 2332.0,
        title: 'Support Breakdown Level',
        color: '#ef4444',
        lineStyle: 'dashed',
        role: 'support_resistance',
      },
    ],
    markers: [
      {
        id: 'tbd-m1',
        time: trueBreakdownCandles[8].time,
        position: 'belowBar',
        color: '#38bdf8',
        shape: 'circle',
        text: 'Support',
        stage: 'before',
      },
      {
        id: 'tbd-m2',
        time: trueBreakdownCandles[15].time,
        position: 'belowBar',
        color: '#ef4444',
        shape: 'arrowDown',
        text: 'Body Close Breakdown',
        stage: 'trigger',
      },
      {
        id: 'tbd-m3',
        time: trueBreakdownCandles[18].time,
        position: 'aboveBar',
        color: '#ef4444',
        shape: 'arrowDown',
        text: 'Failed Reclaim',
        stage: 'after',
      },
    ],
    replay: {
      beforeEndIndex: 14,
      triggerEndIndex: 17,
      afterEndIndex: trueBreakdownCandles.length - 1,
      beforeSummary:
        'Before: Lower highs compress against 2332.0 support as bounces grow progressively weaker.',
      triggerSummary:
        'Trigger: A heavy bearish expansion candle closes near its low at 2326.2 on high volume, followed by immediate continuation to 2322.6.',
      afterSummary:
        'After: The retest stalls at 2331.4 without reclaiming 2332.0, confirming a genuine breakdown rather than a sell-side liquidity sweep.',
    },
    teachingTakeaways: [
      'When price closes decisively outside the level and fails to reclaim on the retest, treat it as acceptance—never blindly fade it as a sweep.',
    ],
  },
  {
    id: 'fvg-bullish-mitigation',
    lessonSlug: 'fair-value-gaps',
    title: 'Bullish Fair Value Gap (FVG) & 50% Equilibrium Mitigation',
    symbol: 'EUR/USD',
    timeframe: '15m',
    category: 'fair_value_gap',
    description:
      'A 3-candle institutional displacement leaves a clear 16-pip Fair Value Gap (1.0830–1.0846) that price revisits before expanding to new highs.',
    isPracticeEligible: true,
    correctClassification: 'bullish_fvg',
    candles: fvgCandles,
    priceLines: [
      {
        id: 'fvg-top',
        price: 1.0846,
        title: 'Bullish FVG High (Candle 3 Low)',
        color: '#10b981',
        lineStyle: 'dashed',
        role: 'fvg_high',
      },
      {
        id: 'fvg-bottom',
        price: 1.083,
        title: 'Bullish FVG Low (Candle 1 High)',
        color: '#10b981',
        lineStyle: 'dashed',
        role: 'fvg_low',
      },
    ],
    markers: [
      {
        id: 'fvg-m1',
        time: fvgCandles[8].time,
        position: 'belowBar',
        color: '#38bdf8',
        shape: 'circle',
        text: 'SSL Grab',
        stage: 'before',
      },
      {
        id: 'fvg-m2',
        time: fvgCandles[10].time,
        position: 'aboveBar',
        color: '#10b981',
        shape: 'arrowUp',
        text: 'FVG Impulse',
        stage: 'trigger',
      },
      {
        id: 'fvg-m3',
        time: fvgCandles[18].time,
        position: 'belowBar',
        color: '#f59e0b',
        shape: 'arrowUp',
        text: '50% Mitigation',
        stage: 'after',
      },
      {
        id: 'fvg-m4',
        time: fvgCandles[21].time,
        position: 'aboveBar',
        color: '#10b981',
        shape: 'arrowUp',
        text: 'Expansion BOS',
        stage: 'after',
      },
    ],
    replay: {
      beforeEndIndex: 9,
      triggerEndIndex: 13,
      afterEndIndex: fvgCandles.length - 1,
      beforeSummary:
        'Before: Price consolidates quietly and dips briefly to collect local sell-side liquidity at 1.0811.',
      triggerSummary:
        'Trigger: A strong 3-candle displacement leaves an unfilled gap between Candle 1 high (1.0830) and Candle 3 low (1.0846)—forming a Bullish FVG.',
      afterSummary:
        'After: Price retraces orderly into the 50% midpoint of the FVG (1.0838), finds aggressive buying response, and breaks structure higher.',
    },
    teachingTakeaways: [
      'A Bullish FVG exists strictly between Candle 1 High and Candle 3 Low when Candle 2 creates strong directional displacement.',
      'FVGs formed immediately after a liquidity grab carry significantly higher reliability than random gaps in mid-range chop.',
    ],
  },
  {
    id: 'risk-1to3-execution',
    lessonSlug: 'risk-psychology',
    title: 'Structured 1:3 Risk-to-Reward Trade Plan',
    symbol: 'GBP/USD',
    timeframe: '15m',
    category: 'risk_setup',
    description:
      'Visualizing pre-defined structural invalidation (1R = 20 pips), disciplined holding through minor noise, and taking profit at +3R (60 pips).',
    isPracticeEligible: true,
    correctClassification: 'valid_rr_setup',
    candles: riskSetupCandles,
    priceLines: [
      {
        id: 'rr-tp',
        price: 1.272,
        title: 'Take Profit (+3R | +60 pips)',
        color: '#10b981',
        lineStyle: 'solid',
        role: 'take_profit',
      },
      {
        id: 'rr-entry',
        price: 1.266,
        title: 'Planned Entry (1.2660)',
        color: '#38bdf8',
        lineStyle: 'dashed',
        role: 'entry',
      },
      {
        id: 'rr-sl',
        price: 1.264,
        title: 'Structural Stop Loss (-1R | -20 pips)',
        color: '#ef4444',
        lineStyle: 'solid',
        role: 'stop_loss',
      },
    ],
    markers: [
      {
        id: 'rr-m1',
        time: riskSetupCandles[10].time,
        position: 'aboveBar',
        color: '#10b981',
        shape: 'arrowUp',
        text: 'BOS Confirms',
        stage: 'before',
      },
      {
        id: 'rr-m2',
        time: riskSetupCandles[14].time,
        position: 'belowBar',
        color: '#38bdf8',
        shape: 'arrowUp',
        text: 'Entry (1R Risk)',
        stage: 'trigger',
      },
      {
        id: 'rr-m3',
        time: riskSetupCandles[25].time,
        position: 'aboveBar',
        color: '#10b981',
        shape: 'arrowUp',
        text: '+3R Target Hit',
        stage: 'after',
      },
    ],
    replay: {
      beforeEndIndex: 12,
      triggerEndIndex: 17,
      afterEndIndex: riskSetupCandles.length - 1,
      beforeSummary:
        'Before: Bullish BOS establishes trend direction and defines the protected swing low at 1.2644, allowing a logical stop-loss at 1.2640.',
      triggerSummary:
        'Trigger: Price retraces to the planned 1.2660 entry (20-pip stop = 1R). Normal 9-pip drawdown never violates structural invalidation.',
      afterSummary:
        'After: Holding patiently through a minor pause around +1R allows the setup to reach the full +3R structural target at 1.2720.',
    },
    teachingTakeaways: [
      'Position size is calculated from Stop Distance: Position Size = (Account × Risk %) ÷ Stop Loss Distance.',
      'At 1:3 Risk-to-Reward, even a 40% win rate generates strong positive expectancy (+0.6R per trade average).',
    ],
  },
];

export const CHART_SCENARIOS_BY_ID: Record<string, ChartScenario> =
  Object.fromEntries(CHART_SCENARIOS.map((scenario) => [scenario.id, scenario]));

export function getChartScenarioById(id: string): ChartScenario | undefined {
  return CHART_SCENARIOS_BY_ID[id];
}

export function getChartScenariosByLessonSlug(
  lessonSlug: string,
): ChartScenario[] {
  return CHART_SCENARIOS.filter((scenario) => scenario.lessonSlug === lessonSlug);
}
