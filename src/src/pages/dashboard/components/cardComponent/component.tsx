import * as s from './style'

interface props {
    title: string,
    data: string,
    description: string,
    onClick?: () => void
}

export const CardComponent: React.FC<props> = ({ data, description, title, onClick }) => {
    return (
        <s.cardContainer onClick={onClick} clicable={onClick !== undefined}>
            <s.cardTitle>{title}</s.cardTitle>
            <s.cardData>{data}</s.cardData>
            <s.cardDescription>{description}</s.cardDescription>
        </s.cardContainer>
    )
}