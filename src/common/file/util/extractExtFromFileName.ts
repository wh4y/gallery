export const extractExtFromFileName = (name: string): string =>
  name.replace(/^.+\.(.+)$/, '$1');
