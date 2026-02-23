import { describe, expect, it } from 'vitest';
import { formatCurrency } from './format-currency';

describe('formatCurrency Utility', () => {
  it('should format positive values to BRL text correctly', () => {
    const formatted = formatCurrency(1500.5);

    expect(formatted.replace(/\u00A0/g, ' ')).toBe('R$ 1.500,50');
  });

  it('should format zero correctly', () => {
    const formatted = formatCurrency(0);
    expect(formatted.replace(/\u00A0/g, ' ')).toBe('R$ 0,00');
  });

  it('should format negative values correctly', () => {
    const formatted = formatCurrency(-50.25);
    expect(formatted).toContain('50,25');
    expect(formatted).toContain('R$');
    expect(formatted).toContain('-');
  });
});
