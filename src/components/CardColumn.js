import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    width: 500px;
    flex-direction: column;
    justify-content: flex-start;
    background-color: grey;
    min-height: 100vh;
    padding: 10px;
`;

const CardColumn = ({children, id, label}) => {
    return (
        <Wrapper id={id}>
            <h2>{label}</h2>
            {children}
        </Wrapper>
    )
};

export default CardColumn;