export type VersionState = Record<string, string>;

const safeKey = /^[a-zA-Z0-9_-]+$/;

export function parseVersionState(value: string | null): VersionState {
	if (!value) return {};
	const state: VersionState = {};
	for (const entry of value.split(',')) {
		const parts = entry.split(':');
		if (parts.length !== 2 || !safeKey.test(parts[0]) || !safeKey.test(parts[1])) continue;
		state[parts[0]] = parts[1];
	}
	return state;
}

export function serializeVersionState(state: VersionState): string {
	return Object.entries(state)
		.filter(([group, version]) => safeKey.test(group) && safeKey.test(version))
		.map(([group, version]) => `${group}:${version}`)
		.join(',');
}

export function resolveVersion(requested: string | undefined, versions: readonly string[]): string {
	return requested && versions.includes(requested) ? requested : 'original';
}

export function resolveInitialVersion(showToolbar: boolean, requested: string | undefined, versions: readonly string[], remembered?: string, hasUrlState = requested !== undefined): string {
	if (!showToolbar) return 'original';
	return hasUrlState ? resolveVersion(requested, versions) : resolveVersion(remembered, versions);
}

export function selectVersion(state: VersionState, group: string, version: string): VersionState {
	return { ...state, [group]: version };
}

export function moveOptionIndex(current: number, key: string, count: number): number {
	if (count < 1) return -1;
	if (key === 'Home') return 0;
	if (key === 'End') return count - 1;
	if (key === 'ArrowDown') return Math.min(Math.max(current, -1) + 1, count - 1);
	if (key === 'ArrowUp') return Math.max(current < 0 ? count - 1 : current - 1, 0);
	return current;
}

type VersionNode = HTMLElement & { dataset: DOMStringMap };
type VersionGroup = {
	element: HTMLElement;
	name: string;
	label: string;
	versions: VersionNode[];
};

function collectGroups(doc: Document): VersionGroup[] {
	const elements = Array.from(doc.querySelectorAll<HTMLElement>('[data-version-group]'));
	const counts = new Map<string, number>();
	for (const element of elements) {
		const name = element.dataset.versionGroup || '';
		counts.set(name, (counts.get(name) || 0) + 1);
	}
	const result: VersionGroup[] = [];
	for (const element of elements) {
		const name = element.dataset.versionGroup || '';
		if (!safeKey.test(name) || counts.get(name) !== 1) continue;
		const versions = Array.from(element.querySelectorAll<VersionNode>('[data-version]'))
			.filter((version) => version.closest('[data-version-group]') === element);
		for (const version of versions) {
			if (version.style.display === 'none') version.style.removeProperty('display');
		}
		const ids = versions.map((version) => version.dataset.version || '');
		if (versions.length < 2 || ids[0] !== 'original' || ids.some((id) => !safeKey.test(id)) || new Set(ids).size !== ids.length) continue;
		result.push({ element, name, label: element.dataset.versionGroupLabel || name, versions });
	}
	return result;
}

function applyVersion(group: VersionGroup, id: string): void {
	for (const version of group.versions) version.hidden = version.dataset.version !== id;
}

function parsePresets(raw: string | undefined): Array<{ label: string; props?: Record<string, string> }> {
	if (!raw) return [];
	try {
		const value: unknown = JSON.parse(raw);
		if (!Array.isArray(value)) return [];
		return value.filter((preset): preset is { label: string; props?: Record<string, string> } =>
			typeof preset?.label === 'string' &&
				(!preset.props || (typeof preset.props === 'object' && !Array.isArray(preset.props))));
	} catch {
		return [];
	}
}

function appendCssToggle(doc: Document, container: HTMLElement, element: HTMLElement, signal: AbortSignal): boolean {
	const presets = parsePresets(element.dataset.cssTogglePresets);
	if (presets.length < 2) return false;
	const select = doc.createElement('select');
	select.className = 'vt-presets';
	select.setAttribute('aria-label', element.dataset.cssToggleGroup || 'Ustawienia stylu');
	presets.forEach((preset, index) => {
		const option = doc.createElement('option');
		option.textContent = preset.label;
		option.value = String(index);
		select.append(option);
	});
	select.addEventListener('change', () => {
		const preset = presets[Number(select.value)];
		if (preset) {
			for (const [property, value] of Object.entries(preset.props || {})) element.style.setProperty(property, value);
		}
	}, { signal });
	container.append(select);
	return true;
}

type DropdownOption = { value: string; label: string };
type Dropdown = { root: HTMLElement; value: string; setOptions: (options: DropdownOption[], selected: string) => void };
type OpenDropdown = { menu: HTMLElement; trigger: HTMLButtonElement };

function createDropdown(
	doc: Document,
	label: string,
	id: string,
	options: DropdownOption[],
	selected: string,
	win: Window,
	signal: AbortSignal,
	getOpen: () => OpenDropdown | null,
	setOpen: (open: OpenDropdown | null) => void,
	onSelect: (value: string) => void,
): Dropdown {
	const root = doc.createElement('div');
	root.className = 'vt-dropdown';
	const trigger = doc.createElement('button');
	trigger.type = 'button';
	trigger.className = 'vt-combobox';
	trigger.setAttribute('role', 'combobox');
	trigger.setAttribute('aria-label', label);
	trigger.setAttribute('aria-haspopup', 'listbox');
	trigger.setAttribute('aria-expanded', 'false');
	trigger.setAttribute('aria-controls', `${id}-listbox`);
	const currentLabel = doc.createElement('span');
	currentLabel.className = 'vt-current-label';
	trigger.append(currentLabel);
	const menu = doc.createElement('div');
	menu.id = `${id}-listbox`;
	menu.className = 'vt-menu';
	menu.setAttribute('role', 'listbox');
	menu.hidden = true;
	root.append(trigger, menu);
	let value = selected;

	const closeMenu = (restoreFocus = false) => {
		menu.hidden = true;
		trigger.setAttribute('aria-expanded', 'false');
		if (getOpen()?.menu === menu) setOpen(null);
		if (restoreFocus) trigger.focus();
	};
	const openMenu = (focusIndex?: number) => {
		const open = getOpen();
		if (open && open.menu !== menu) {
			open.menu.hidden = true;
			open.trigger.setAttribute('aria-expanded', 'false');
		}
		if (open?.menu === menu && !menu.hidden) {
			closeMenu();
			return;
		}
		menu.hidden = false;
		trigger.setAttribute('aria-expanded', 'true');
		const rect = trigger.getBoundingClientRect();
		menu.style.right = `${Math.max(12, win.innerWidth - rect.right)}px`;
		menu.style.bottom = `${Math.max(12, win.innerHeight - rect.top + 8)}px`;
		menu.style.minWidth = `${rect.width}px`;
		menu.style.maxWidth = `${Math.max(48, Math.min(win.innerWidth - 24, rect.right - 12))}px`;
		setOpen({ menu, trigger });
		const optionButtons = Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="option"]'));
		const selectedIndex = optionButtons.findIndex((option) => option.dataset.value === value);
		optionButtons[focusIndex ?? Math.max(selectedIndex, 0)]?.focus();
	};

	const setOptions = (nextOptions: DropdownOption[], nextSelected: string) => {
		options = nextOptions;
		value = options.some((option) => option.value === nextSelected) ? nextSelected : options[0]?.value || '';
		currentLabel.textContent = options.find((option) => option.value === value)?.label || '';
		menu.replaceChildren();
		for (const option of options) {
			const item = doc.createElement('button');
			item.type = 'button';
			item.setAttribute('role', 'option');
			item.setAttribute('aria-selected', String(option.value === value));
			item.dataset.value = option.value;
			item.className = 'vt-option';
			const text = doc.createElement('span');
			text.textContent = option.label;
			const mark = doc.createElement('span');
			mark.className = 'vt-option-mark';
			mark.setAttribute('aria-hidden', 'true');
			mark.textContent = option.value === value ? '✓' : '';
			item.append(text, mark);
			menu.append(item);
		}
	};

	trigger.addEventListener('click', () => openMenu(), { signal });
	trigger.addEventListener('keydown', (event) => {
		if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
			event.preventDefault();
			const optionsNow = Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="option"]'));
			const focusIndex = event.key === 'End' ? optionsNow.length - 1 : event.key === 'Home' ? 0 : undefined;
			openMenu(focusIndex);
		}
	}, { signal });
	menu.addEventListener('click', (event) => {
		const target = event.target instanceof HTMLElement ? event.target.closest<HTMLButtonElement>('[role="option"]') : null;
		if (!target || !menu.contains(target)) return;
		value = target.dataset.value || value;
		setOptions(options, value);
		closeMenu(true);
		onSelect(value);
	}, { signal });
	menu.addEventListener('keydown', (event) => {
		const optionButtons = Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="option"]'));
		const focusedIndex = optionButtons.indexOf(doc.activeElement as HTMLButtonElement);
		const nextIndex = moveOptionIndex(focusedIndex, event.key, optionButtons.length);
		if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
			event.preventDefault();
			optionButtons[nextIndex]?.focus();
			return;
		}
		if ((event.key === 'Enter' || event.key === ' ') && focusedIndex >= 0) {
			event.preventDefault();
			optionButtons[focusedIndex]?.click();
		}
	}, { signal });
	setOptions(options, selected);
	return { root, get value() { return value; }, setOptions };
}

export function initVersionToolbar(doc: Document = document, win: Window = window): void {
	activeControllers.get(doc)?.abort();
	const bar = doc.getElementById('vt-bar');
	const container = doc.getElementById('vt-groups');
	const expandButton = doc.getElementById('vt-expand');
	if (!bar || !container || !expandButton) return;
	const controller = new AbortController();
	activeControllers.set(doc, controller);
	const { signal } = controller;
	const groups = collectGroups(doc);
	let initiallyCollapsed = false;
	try { initiallyCollapsed = win.sessionStorage.getItem('webscale-version-toolbar:collapsed') === 'true'; } catch { /* Storage may be unavailable. */ }
	bar.dataset.collapsed = String(initiallyCollapsed);
	const url = new URL(win.location.href);
	const storageKey = `webscale-version-toolbar:${url.pathname}`;
	const hasUrlState = url.searchParams.has('sv');
	let rememberedState: VersionState = {};
	try {
		rememberedState = parseVersionState(win.sessionStorage.getItem(storageKey));
	} catch {
		rememberedState = {};
	}
	const state = hasUrlState ? parseVersionState(url.searchParams.get('sv')) : rememberedState;
	for (const group of groups) {
		const ids = group.versions.map((version) => version.dataset.version || '');
		const selected = resolveInitialVersion(true, state[group.name], ids, rememberedState[group.name], hasUrlState);
		state[group.name] = selected;
		applyVersion(group, selected);
	}
	container.replaceChildren();
	bar.classList.toggle('is-collapsed', bar.dataset.collapsed === 'true');
	expandButton.hidden = bar.dataset.collapsed !== 'true';
	bar.hidden = false;
	if (groups.length === 0) {
		const emptyState = doc.createElement('span');
		emptyState.className = 'vt-empty-state';
		emptyState.textContent = 'Brak wariantów na tej stronie';
		const collapseButton = doc.createElement('button');
		collapseButton.type = 'button';
		collapseButton.className = 'vt-collapse';
		collapseButton.textContent = 'Zwiń';
		collapseButton.setAttribute('aria-label', 'Zwiń panel');
		collapseButton.setAttribute('aria-expanded', String(!initiallyCollapsed));
		container.append(emptyState, collapseButton);
		collapseButton.addEventListener('click', () => {
			bar.dataset.collapsed = 'true';
			bar.classList.add('is-collapsed');
			collapseButton.setAttribute('aria-expanded', 'false');
			expandButton.hidden = false;
			try { win.sessionStorage.setItem('webscale-version-toolbar:collapsed', 'true'); } catch { /* Storage may be unavailable. */ }
		}, { signal });
		expandButton.addEventListener('click', () => {
			bar.dataset.collapsed = 'false';
			bar.classList.remove('is-collapsed');
			expandButton.hidden = true;
			collapseButton.setAttribute('aria-expanded', 'true');
			try { win.sessionStorage.setItem('webscale-version-toolbar:collapsed', 'false'); } catch { /* Storage may be unavailable. */ }
		}, { signal });
		return;
	}
	try { win.sessionStorage.setItem(storageKey, serializeVersionState(state)); } catch { /* Storage may be unavailable. */ }

	const rememberedGroup = bar.dataset.selectedGroup;
	let selectedGroup = groups.find((group) => group.name === rememberedGroup) || groups[0];
	bar.dataset.selectedGroup = selectedGroup.name;
	let openDropdown: OpenDropdown | null = null;
	const getOpen = () => openDropdown;
	const setOpen = (open: OpenDropdown | null) => { openDropdown = open; };
	const sectionDropdown = createDropdown(doc, 'Sekcja', 'vt-section', groups.map((group) => ({
		value: group.name,
		label: group.label,
	})), selectedGroup.name, win, signal, getOpen, setOpen, (name) => {
		selectedGroup = groups.find((group) => group.name === name) || groups[0];
		bar.dataset.selectedGroup = selectedGroup.name;
		versionDropdown.setOptions(getVersions(selectedGroup), selectedVersion(selectedGroup));
	});
	const versionDropdown = createDropdown(doc, 'Wariant', 'vt-version', getVersions(selectedGroup), selectedVersion(selectedGroup), win, signal, getOpen, setOpen, (id) => {
		const group = selectedGroup;
		applyVersion(group, id);
		Object.assign(state, selectVersion(state, group.name, id));
		const url = new URL(win.location.href);
		const serialized = serializeVersionState(state);
		if (serialized) url.searchParams.set('sv', serialized);
		else url.searchParams.delete('sv');
		win.history.replaceState(win.history.state, '', url);
		try { win.sessionStorage.setItem(storageKey, serialized); } catch { /* Storage may be unavailable. */ }
		doc.dispatchEvent(new CustomEvent('vt-change', { detail: { group: group.name, version: id } }));
	});
	function getVersions(group: VersionGroup): DropdownOption[] {
		return group.versions.map((version) => ({
			value: version.dataset.version || 'original',
			label: version.dataset.versionLabel || version.dataset.version || 'original',
		}));
	}
	function selectedVersion(group: VersionGroup): string {
		return group.versions.find((version) => !version.hidden)?.dataset.version || 'original';
	}

	const collapseButton = doc.createElement('button');
	collapseButton.type = 'button';
	collapseButton.className = 'vt-collapse';
	collapseButton.textContent = 'Zwiń';
	collapseButton.setAttribute('aria-label', 'Zwiń panel');
	collapseButton.setAttribute('aria-expanded', String(bar.dataset.collapsed !== 'true'));
	collapseButton.addEventListener('click', () => {
		bar.dataset.collapsed = 'true';
		bar.classList.add('is-collapsed');
		collapseButton.setAttribute('aria-expanded', 'false');
		openDropdown?.menu.setAttribute('hidden', '');
		openDropdown?.trigger.setAttribute('aria-expanded', 'false');
		openDropdown = null;
		expandButton.hidden = false;
		try { win.sessionStorage.setItem('webscale-version-toolbar:collapsed', 'true'); } catch { /* Storage may be unavailable. */ }
	}, { signal });
	container.append(sectionDropdown.root, versionDropdown.root, collapseButton);
	for (const element of Array.from(doc.querySelectorAll<HTMLElement>('[data-css-toggle-group]'))) {
		appendCssToggle(doc, container, element, signal);
	}
	expandButton.addEventListener('click', () => {
		bar.dataset.collapsed = 'false';
		bar.classList.remove('is-collapsed');
		expandButton.hidden = true;
		collapseButton.setAttribute('aria-expanded', 'true');
		try { win.sessionStorage.setItem('webscale-version-toolbar:collapsed', 'false'); } catch { /* Storage may be unavailable. */ }
	}, { signal });
	try {
		const collapsed = win.sessionStorage.getItem('webscale-version-toolbar:collapsed') === 'true';
		bar.dataset.collapsed = String(collapsed);
		bar.classList.toggle('is-collapsed', collapsed);
		expandButton.hidden = !collapsed;
		collapseButton.setAttribute('aria-expanded', String(!collapsed));
	} catch { /* Storage may be unavailable. */ }
	doc.addEventListener('pointerdown', (event) => {
		if (openDropdown && !bar.contains(event.target as Node)) {
			openDropdown.menu.hidden = true;
			openDropdown.trigger.setAttribute('aria-expanded', 'false');
			openDropdown = null;
		}
	}, { signal });
	doc.addEventListener('keydown', (event) => {
		if (!openDropdown) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			const trigger = openDropdown.trigger;
			openDropdown.menu.hidden = true;
			trigger.setAttribute('aria-expanded', 'false');
			openDropdown = null;
			trigger.focus();
		} else if (event.key === 'Tab') {
			openDropdown.menu.hidden = true;
			openDropdown.trigger.setAttribute('aria-expanded', 'false');
			openDropdown = null;
		}
	}, { signal });
	bar.hidden = false;
}

const activeControllers = new WeakMap<Document, AbortController>();

export function startVersionToolbar(styles: string): void {
	const lifecycleKey = '__webscaleVersionToolbarLifecycle';
	const browserWindow = window as Window & { [lifecycleKey]?: boolean };
	const styleId = 'webscale-version-toolbar-styles';
	const initialize = () => {
		const style = document.getElementById(styleId);
		if (!document.getElementById('vt-bar')) {
			style?.remove();
			initVersionToolbar();
			return;
		}
		if (!style) {
			const nextStyle = document.createElement('style');
			nextStyle.id = styleId;
			nextStyle.textContent = styles;
			document.head.append(nextStyle);
		}
		initVersionToolbar();
	};
	if (!browserWindow[lifecycleKey]) {
		browserWindow[lifecycleKey] = true;
		document.addEventListener('astro:page-load', initialize);
	}
	initialize();
}

if (import.meta.hot) import.meta.hot.accept(() => initVersionToolbar());
