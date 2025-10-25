import type { DashboardTableRowView } from '@renderer/shered/viewTypes'
import * as s from './style'

interface props {
    type: 'Prox.Cobran' | 'Val.Recent',
    data: DashboardTableRowView[],
}

export const RowItemList: React.FC<props> = ({ type, data }) => {
    let RowInformations: DashboardTableRowView = {
        Title: "1. João",
        FloatInfo: '2d',
        AdicionalInformation: 'R$ 280 - 12/04',
    }

    return (
        <s.rowItemList>
            <div>
                <strong>{RowInformations.Title}</strong>
                <s.rowAditionalInfo>{RowInformations.AdicionalInformation}</s.rowAditionalInfo>
            </div>
            <s.rowPill
                good={false}
                bad={false}
                ok={true}
            >{RowInformations.FloatInfo}</s.rowPill>
        </s.rowItemList>
    )
}