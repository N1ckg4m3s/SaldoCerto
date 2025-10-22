import * as s from './style';

interface props {
    titulo: string,
}

const PageTitle: React.FC<props> = ({ titulo }) => {
    return (
        <s.TitleContainer>
            <s.TitleH1>{titulo}</s.TitleH1>
        </s.TitleContainer>
    );
};

export default PageTitle;
