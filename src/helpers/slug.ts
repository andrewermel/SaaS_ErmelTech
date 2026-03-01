/**
 * Gera um slug URL-friendly a partir de um nome.
 * Ex: "Black Lanches!" → "black-lanches"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
