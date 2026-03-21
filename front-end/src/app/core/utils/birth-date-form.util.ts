// ISO (data de nascimento persistida) → exibição DD/MM/AAAA no input 
export function isoDateToBirthDisplay(iso: string): string {
  if (!iso) return '';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '';

  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = parsed.getFullYear();
  return `${day}/${month}/${year}`;
}

// Valor do input (DD/MM/AAAA ou dígitos) → ISO YYYY-MM-DD para persistir 
export function birthDisplayToIso(value: string): string {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return '';
  const ddmmaa = trimmed.replace(/\D/g, '');
  if (ddmmaa.length === 8) {
    const d = ddmmaa.slice(0, 2);
    const m = ddmmaa.slice(2, 4);
    const a = ddmmaa.slice(4, 8);
    return `${a}-${m}-${d}`;
  }
  return trimmed;
}

// Aplica máscara visual enquanto o usuário digita (apenas dígitos) 
export function maskBirthDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length > 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }
  if (digits.length > 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}
