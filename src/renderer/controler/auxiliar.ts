import type { NumberFilterType } from "@renderer/shered/viewTypes";

export const nextNumberFilterType = (current: NumberFilterType): NumberFilterType => {
    switch (current) {
        case null: return 'Biggest';
        case 'Biggest': return 'Lowest';
        case 'Lowest': return null;
    }
};