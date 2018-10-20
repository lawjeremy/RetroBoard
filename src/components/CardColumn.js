import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    width: 500px;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 100vh;
    padding: 10px;
    background-color: ${({ bkgColor }) => bkgColor};
    border: 2px solid ${({ highlight }) => highlight ? 'black' : 'transparent'};
`;

const CardColumn = ({children, id, label, bkgColor, highlight}) => {
    return (
        <Wrapper id={id} bkgColor={bkgColor} highlight={highlight}>
            <h2>{label}</h2>
            {children}
        </Wrapper>
    )
};

export default CardColumn;