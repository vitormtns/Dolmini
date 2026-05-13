export type CepAddress = {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
};

type ViaCepResponse = {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

export function normalizeCep(cep: string) {
  return cep.replace(/\D/g, "").slice(0, 8);
}

export function formatCep(cep: string) {
  const normalizedCep = normalizeCep(cep);

  if (normalizedCep.length <= 5) return normalizedCep;

  return `${normalizedCep.slice(0, 5)}-${normalizedCep.slice(5)}`;
}

export function isValidCep(cep: string) {
  return normalizeCep(cep).length === 8;
}

export async function fetchAddressByCep(cep: string): Promise<CepAddress | null> {
  const normalizedCep = normalizeCep(cep);

  if (!isValidCep(normalizedCep)) {
    throw new Error("CEP inválido.");
  }

  const response = await fetch(`https://viacep.com.br/ws/${normalizedCep}/json/`);

  if (!response.ok) {
    throw new Error("Não foi possível consultar o CEP.");
  }

  const data = (await response.json()) as ViaCepResponse;

  if (data.erro) return null;

  return {
    street: data.logradouro?.trim() ?? "",
    neighborhood: data.bairro?.trim() ?? "",
    city: data.localidade?.trim() ?? "",
    state: data.uf?.trim() ?? ""
  };
}
