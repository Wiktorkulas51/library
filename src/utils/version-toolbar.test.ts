import { describe, expect, it } from 'vitest';
import { moveOptionIndex, parseVersionState, serializeVersionState, resolveInitialVersion, resolveVersion, selectVersion } from './version-toolbar';

describe('version toolbar URL state', () => {
	it('parses group names and versions without accepting malformed entries', () => {
		expect(parseVersionState('hero:v2,cta:banner,broken,extra:value:part')).toEqual({
			hero: 'v2',
			cta: 'banner',
		});
	});

	it('uses the baseline when a saved version is no longer available', () => {
		expect(resolveVersion('gone', ['original', 'v1', 'v2'])).toBe('original');
		expect(resolveVersion('v1', ['original', 'v1', 'v2'])).toBe('v1');
		expect(resolveInitialVersion(false, 'v2', ['original', 'v1', 'v2'])).toBe('original');
	});

	it('prefers an explicit URL selection, then restores the session selection', () => {
		expect(resolveInitialVersion(true, 'v1', ['original', 'v1', 'v2'], 'v2')).toBe('v1');
		expect(resolveInitialVersion(true, undefined, ['original', 'v1', 'v2'], 'v2')).toBe('v2');
		expect(resolveInitialVersion(true, 'gone', ['original', 'v1', 'v2'], 'v2')).toBe('original');
		expect(resolveInitialVersion(true, undefined, ['original', 'v1', 'v2'], 'gone')).toBe('original');
	});

	it('switches one group while preserving the other group selection', () => {
		const selected = selectVersion({ hero: 'v2', process: 'v1' }, 'hero', 'v4');
		expect(selected).toEqual({ hero: 'v4', process: 'v1' });
	});

	it('moves listbox focus with arrow keys and Home or End', () => {
		expect(moveOptionIndex(-1, 'ArrowDown', 4)).toBe(0);
		expect(moveOptionIndex(1, 'ArrowDown', 4)).toBe(2);
		expect(moveOptionIndex(0, 'ArrowUp', 4)).toBe(0);
		expect(moveOptionIndex(2, 'Home', 4)).toBe(0);
		expect(moveOptionIndex(1, 'End', 4)).toBe(3);
		expect(moveOptionIndex(0, 'ArrowDown', 0)).toBe(-1);
	});

	it('serializes valid state while retaining unrelated URL parameters', () => {
		const url = new URL('https://example.test/page/?vt=1&sv=hero:v1&campaign=spring');
		url.searchParams.set('sv', serializeVersionState({ hero: 'v2', cta: 'v4' }));
		expect(url.searchParams.get('vt')).toBe('1');
		expect(url.searchParams.get('campaign')).toBe('spring');
		expect(url.searchParams.get('sv')).toBe('hero:v2,cta:v4');
	});
});
