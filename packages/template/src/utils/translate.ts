const hasOwn = Object.prototype.hasOwnProperty;

export const translate = (
  translations: Record<string, string> = {},
  key: string,
  params: Record<string, any> = {},
) => {
  return (hasOwn.call(translations, key) ? translations[key] : key).replace(
    /\{(.+?)\}/g,
    (_, name) => (hasOwn.call(params, name) ? params[name] : _),
  );
};
