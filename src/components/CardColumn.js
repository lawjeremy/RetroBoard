import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    width: 500px;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 100vh;
    padding: 10px;
    border: 2px solid ${({ highlight }) => highlight ? 'black' : 'transparent'};
`;

const Ruler = styled.hr`
    width: 100%;
`;

const CardColumn = ({children, id, label, bkgColor, highlight}) => {
    return (
        <Wrapper id={id} highlight={highlight}>
            <h2 className="display-3">{label}</h2>
            <Ruler className="my-4" />
            {children}
        </Wrapper>
    )
};

export default CardColumn;