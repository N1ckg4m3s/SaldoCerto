import type { NumberFilterType } from "@renderer/shered/viewTypes";

const formatNumeroComZero = (numero: number): string => numero <= 9 ? `0${numero}` : `${numero}`


export const nextNumberFilterType = (current: NumberFilterType): NumberFilterType => {
    switch (current) {
        case null: return 'Biggest';
        case 'Biggest': return 'Lowest';
        case 'Lowest': return null;
    }
};

export const formatarDateParaTexto = (data: Date | string): string => {
    const DateASerFormatada: Date = typeof data == 'string' ? new Date(data) : data

    const diaNaData = DateASerFormatada.getDate() + 1
    const mesNaData = DateASerFormatada.getMonth() + 1
    const anoNaData = DateASerFormatada.getFullYear()

    const diaFixed = formatNumeroComZero(diaNaData);
    const mesFixed = formatNumeroComZero(mesNaData);
    const anoFixed = formatNumeroComZero(anoNaData);

    return `${diaFixed}/${mesFixed}/${anoFixed}`;
}

export const formatarValorParaTexto = (valor?: number | string): string => {
    if (valor == null) return '-';

    const numero = typeof valor === 'number' ? valor : Number(valor);
    return isNaN(numero) ? '-' : numero.toFixed(2) + '$';
}
