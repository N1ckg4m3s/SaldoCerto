import type { DashboardTableRowView } from '@renderer/shered/viewTypes'
import * as s from './style'

interface props {
    type: 'Prox.Cobran' | 'Val.Recent',
    data: DashboardTableRowView,
}

export const RowItemList: React.FC<props> = ({ type, data }) => {
    const value = Number(data.FloatInfo);
    const valueIsNumber = !isNaN(value);

    let good = false;
    let ok = false;
    let bad = false;
    let displayValue = data.FloatInfo;

    if (valueIsNumber) {
        if (value > 5) good = true;
        else if (value > 0) ok = true;
        else bad = true;

        displayValue = `${value}d`;
    } else {
        displayValue = data.FloatInfo == 'Pedido' ? '📦' : '💵'
    }

    return (
        <s.rowItemList>
            <div>
                <s.Title>{data.Title}</s.Title>
                <s.rowAditionalInfo>{data.AdicionalInformation}</s.rowAditionalInfo>
            </div>
            <s.rowPill good={good} ok={ok} bad={bad}>
                {displayValue}
            </s.rowPill>
        </s.rowItemList>
    );
};
