import type { ReactNode } from 'react'
import * as s from './style'

interface props {
    title: string
    children?: ReactNode
}

export const ListComponent: React.FC<props> = ({ title, children }) => {
    return (
        <s.painelContainer>
            <header>
                <s.painelTitle>
                    {title}
                </s.painelTitle>
            </header>
            <s.paineItensList>
                {children}
            </s.paineItensList>
        </s.painelContainer>
    )
}