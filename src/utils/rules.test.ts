import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateEmail,
  formatPKR,
  formatVolume,
  calculateStockMetrics,
  sortTopMovers,
  aggregateSectors,
  evaluateWeeklyPicks
} from './rules.ts';
import { StockQuote } from '../types/index.ts';

test('validateEmail validates valid and invalid emails properly', () => {
  assert.equal(validateEmail('subscriber@karachi.com'), true);
  assert.equal(validateEmail('trader.ali@psx.org.pk'), true);
  assert.equal(validateEmail('invalid-email'), false);
  assert.equal(validateEmail('user@'), false);
  assert.equal(validateEmail(''), false);
});

test('formatPKR formats positive, negative and zero amounts', () => {
  assert.equal(formatPKR(154.25), 'PKR 154.25');
  assert.equal(formatPKR(25.5, { showSign: true }), '+PKR 25.50');
  assert.equal(formatPKR(-12.4, { showSign: true }), '-PKR 12.40');
});

test('formatVolume formats thousands, millions and billions', () => {
  assert.equal(formatVolume(500), '500');
  assert.equal(formatVolume(45000), '45.0k');
  assert.equal(formatVolume(14250000), '14.25M');
  assert.equal(formatVolume(2500000000), '2.50B');
});

test('calculateStockMetrics correctly calculates net change and percentage', () => {
  const res = calculateStockMetrics(100, 105, 100, 106, 99, 100000);
  assert.equal(res.netChange, 5);
  assert.equal(res.changePercent, 5);
  assert.equal(res.validHighLow, true);

  const drop = calculateStockMetrics(200, 190, 200, 202, 189, 50000);
  assert.equal(drop.netChange, -10);
  assert.equal(drop.changePercent, -5);
});

test('sortTopMovers correctly splits gainers, losers and volume', () => {
  const dummyStocks: StockQuote[] = [
    { symbol: 'A', name: 'Alpha', sector: 'Banks', open: 10, high: 12, low: 9, close: 11, previousClose: 10, netChange: 1, changePercent: 10, volume: 50000 },
    { symbol: 'B', name: 'Beta', sector: 'Tech', open: 20, high: 22, low: 18, close: 18, previousClose: 20, netChange: -2, changePercent: -10, volume: 200000 },
    { symbol: 'C', name: 'Gamma', sector: 'Cement', open: 50, high: 52, low: 49, close: 51, previousClose: 50, netChange: 1, changePercent: 2, volume: 100000 },
  ];

  const sorted = sortTopMovers(dummyStocks);
  assert.equal(sorted.topGainers[0].symbol, 'A');
  assert.equal(sorted.topLosers[0].symbol, 'B');
  assert.equal(sorted.topVolume[0].symbol, 'B');
});

test('evaluateWeeklyPicks derives 24 Buy and 20 Avoid picks', () => {
  const mockStocks: StockQuote[] = [];
  for (let i = 0; i < 40; i++) {
    mockStocks.push({
      symbol: `STK${i}`,
      name: `Stock ${i}`,
      sector: i % 2 === 0 ? 'Commercial Banks' : 'Technology & Communication',
      open: 100 + i,
      high: 110 + i,
      low: 95 + i,
      close: 105 + i * (i % 2 === 0 ? 1 : -1),
      previousClose: 100 + i,
      netChange: 5,
      changePercent: (i % 2 === 0 ? 3 : -3) + (i * 0.1),
      volume: 1000000 + i * 50000
    });
  }

  const result = evaluateWeeklyPicks(mockStocks, []);
  assert.equal(result.top24Buy.length, 24);
  assert.equal(result.top20Avoid.length, 20);
  assert.ok(result.sectorHeatmap.length > 0);
});
