import React, { useState } from 'react';
import styled from 'styled-components';

const Root = styled.div`
    display: inline-block;
`;

const StyledInput = styled.input`
    display: inline-block;
    width: 300px;
    border: none;
    font-weight: normal;
`;

export default function ChangeableText(props) {

    const { value, handleChange } = props;
    const [isEditable, setIsEditable] = useState(true);    
    const [textValue, setTextValue] = useState(value);    

    return (
        <Root onDoubleClick={() => setIsEditable(true)}>
            {isEditable ?
                (
                    <StyledInput 
                        maxLength={20}
                        type="text" 
                        value={textValue} 
                        onChange={e => setTextValue(e.target.value)} 
                        onBlur={e => {
                            setIsEditable(true); handleChange(e.target.value);
                        }}
                    />
                ) : (
                    <div>{value}</div>
                )            
            }
        </Root>
        
    )
}