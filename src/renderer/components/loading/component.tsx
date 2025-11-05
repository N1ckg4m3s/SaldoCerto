import * as s from './style';

const LoadingComponent = () => {
    return (
        <s.LoadingContainer>
            <s.MoisaicContainer>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                    <s.MoisaicBlock key={index} delay={(index % 3 + Math.floor(index / 3)) * 0.1} />
                ))}
            </s.MoisaicContainer>
        </s.LoadingContainer>
    );
};

export default LoadingComponent;
