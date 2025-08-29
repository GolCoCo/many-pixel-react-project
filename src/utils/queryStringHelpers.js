import queryString from 'query-string';

export const updateURLWithQueryString = (location, values, fullUrl = true) => {
  const parsed = queryString.parse(location.search);
  const query = {
    ...parsed,
    ...values,
  };
  if (fullUrl) {
    return queryString.stringifyUrl({ url: location.pathname, query });
  }
  return queryString.stringify(query);
};

export const getValueFromQueryString = (location, value, returnType, defaultValue) => {
  const parsed = queryString.parse(location.search);
  if (!parsed) {
    return null;
  }
  if (returnType === Array) {
    if (parsed[value]) {
      return Array.isArray(parsed[value]) ? parsed[value] : [parsed[value]];
    }
    return defaultValue || [];
  }
  if (returnType === String) {
    return parsed[value] ? parsed[value].toString() : defaultValue || undefined;
  }
  if (returnType === Number) {
    if (parsed[value]) {
      const test = parseFloat(parsed[value], 10);
      return !Number.isNaN(test) ? test : defaultValue || 0;
    }
    return defaultValue || 0;
  }
  return parsed ? parsed[value] : null;
};
