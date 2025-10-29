import type { NumberFilterType } from "@renderer/shered/viewTypes";

export const nextNumberFilterType = (current: NumberFilterType): NumberFilterType => {
    switch (current) {
        case null: return 'Biggest';
        case 'Biggest': return 'Lowest';
        case 'Lowest': return null;
    }
};

export const formatarDateParaTexto = (data: Date | string): string => {
    const d = typeof data === 'string' ? new Date(data) : data;

    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

export const formatarValorParaTexto = (valor?: number | string): string => {
    if (valor == null) return '-';

    const numero = typeof valor === 'number' ? valor : Number(valor);
    return isNaN(numero) ? '-' : numero.toFixed(2) + '$';
}
