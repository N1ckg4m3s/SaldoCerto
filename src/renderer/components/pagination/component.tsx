import * as s from './style'

interface PaginacaoProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Paginacao = ({ currentPage, totalPages, onPageChange }: PaginacaoProps) => {
    const MenosDe5Paginas = <>
        {Array.from({ length: totalPages }, (_, index) => (
            <s.PageButton
                key={index}
                active={index === currentPage}
                onClick={() => onPageChange(index)}
            >
                {index + 1}
            </s.PageButton>
        ))}
    </>

    const AcimaDe5Paginas = <>
        <s.PageButton
            active={currentPage === 0}
            onClick={() => onPageChange(0)} > 1 </s.PageButton>

        {currentPage > 2 && <span>...</span>}

        {currentPage > 1 && (
            <s.PageButton
                onClick={() => onPageChange(currentPage - 1)}
            > {currentPage}</s.PageButton>
        )}

        {currentPage !== 0 && currentPage !== totalPages - 1 && (
            <s.PageButton active> {currentPage + 1} </s.PageButton>
        )}

        {currentPage < totalPages - 2 && (
            <s.PageButton
                onClick={() => onPageChange(currentPage + 1)}
            > {currentPage + 2} </s.PageButton>
        )}

        {currentPage < totalPages - 3 && <span>...</span>}

        <s.PageButton
            active={currentPage === totalPages - 1}
            onClick={() => onPageChange(totalPages - 1)}
        > {totalPages} </s.PageButton>
    </>

    if (totalPages == 1) return <></>;

    return (
        <s.Container>
            {totalPages <= 5 ? MenosDe5Paginas : AcimaDe5Paginas}
        </s.Container>
    );
}