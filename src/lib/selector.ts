import * as DomQueries from '@testing-library/dom';
import {
  ByRoleMatcher,
  ByRoleOptions,
  Matcher,
  MatcherOptions,
  screen,
  SelectorMatcherOptions,
  waitForOptions,
} from '@testing-library/dom';

type BoundAttribute =
  | 'LabelText'
  | 'AltText'
  | 'DisplayValue'
  | 'TestId'
  | 'PlaceholderText'
  | 'Title';

type ByRoleSelection = {
  readonly query: 'ByRole';
  readonly matcher: ByRoleMatcher;
  readonly options?: ByRoleOptions;
};

type ByTextSelection = {
  readonly query: 'ByText' | 'ByLabelText';
  readonly matcher: Matcher;
  readonly options?: SelectorMatcherOptions;
};

type ByBoundAttributeSelection = {
  readonly query: 'ByBoundAttribute';
  readonly attribute: BoundAttribute;
  readonly matcher: Matcher;
  readonly options?: MatcherOptions;
};

type Selection = ByRoleSelection | ByTextSelection | ByBoundAttributeSelection;

type RTLSelector<ElType extends HTMLElement = HTMLElement> = {
  readonly get: (container?: HTMLElement) => ElType;
  readonly getAll: (container?: HTMLElement) => readonly ElType[];
  readonly find: (
    container?: HTMLElement,
    waitForOptions?: waitForOptions,
  ) => Promise<ElType>;
  readonly findAll: (
    container?: HTMLElement,
    waitForOptions?: waitForOptions,
  ) => Promise<readonly ElType[]>;
  readonly query: (container?: HTMLElement) => ElType | null;
  readonly queryAll: (container?: HTMLElement) => readonly ElType[];
};

function makeRTLSelector<ElType extends HTMLElement = HTMLElement>(
  selection: Selection,
): RTLSelector<ElType> {
  // too lazy to list out all combinations... macros would come in handy here!
  const exec = (
    type: 'get' | 'getAll' | 'find' | 'findAll' | 'query' | 'queryAll',
    waitForOptions?: waitForOptions,
    container?: HTMLElement,
  ):
    | ElType
    | readonly ElType[]
    | null
    | Promise<ElType>
    | Promise<readonly ElType[]> => {
    const methodName = `${type}${
      selection.query === 'ByBoundAttribute'
        ? `By${selection.attribute}`
        : selection.query
    }`;
    const args: readonly unknown[] = [
      selection.matcher,
      selection.options,
      ...(waitForOptions ? [waitForOptions] : []),
    ];
    if (container) {
      // @ts-ignore
      return DomQueries[methodName](container, ...args);
    }
    // @ts-ignore
    return screen[methodName](...args);
  };

  return {
    get: (container) => exec('get', undefined, container) as ElType,
    getAll: (container) =>
      exec('getAll', undefined, container) as readonly ElType[],
    find: (container, waitForOptions) =>
      exec('find', waitForOptions, container) as Promise<ElType>,
    findAll: (container, waitForOptions) =>
      exec('findAll', waitForOptions, container) as Promise<readonly ElType[]>,
    query: (container) => exec('query', undefined, container) as ElType | null,
    queryAll: (container) =>
      exec('queryAll', undefined, container) as readonly ElType[],
  };
}

export function byRole<ElType extends HTMLElement = HTMLElement>(
  role: ByRoleMatcher,
  options?: ByRoleOptions,
): RTLSelector<ElType> {
  return makeRTLSelector({ query: 'ByRole', matcher: role, options });
}

export function byText<ElType extends HTMLElement = HTMLElement>(
  id: Matcher,
  options?: SelectorMatcherOptions,
): RTLSelector<ElType> {
  return makeRTLSelector({ query: 'ByText', matcher: id, options });
}

export function byBoundAttribute<ElType extends HTMLElement = HTMLElement>(
  attribute: BoundAttribute,
  id: Matcher,
  options?: MatcherOptions,
): RTLSelector<ElType> {
  return makeRTLSelector({
    query: 'ByBoundAttribute',
    attribute,
    matcher: id,
    options,
  });
}

export function byLabelText<ElType extends HTMLElement = HTMLElement>(
  id: Matcher,
  options?: SelectorMatcherOptions,
): RTLSelector<ElType> {
  return makeRTLSelector({ query: 'ByLabelText', matcher: id, options });
}

export function byAltText<ElType extends HTMLElement = HTMLElement>(
  id: Matcher,
  options?: MatcherOptions,
): RTLSelector<ElType> {
  return byBoundAttribute<ElType>('AltText', id, options);
}

export function byDisplayValue<ElType extends HTMLElement = HTMLElement>(
  id: Matcher,
  options?: MatcherOptions,
): RTLSelector<ElType> {
  return byBoundAttribute<ElType>('DisplayValue', id, options);
}

export function byTestId<ElType extends HTMLElement = HTMLElement>(
  id: Matcher,
  options?: MatcherOptions,
): RTLSelector<ElType> {
  return byBoundAttribute<ElType>('TestId', id, options);
}

export function byPlaceholderText<ElType extends HTMLElement = HTMLElement>(
  id: Matcher,
  options?: MatcherOptions,
): RTLSelector<ElType> {
  return byBoundAttribute<ElType>('PlaceholderText', id, options);
}

export function byTitle<ElType extends HTMLElement = HTMLElement>(
  id: Matcher,
  options?: MatcherOptions,
): RTLSelector<ElType> {
  return byBoundAttribute<ElType>('Title', id, options);
}
