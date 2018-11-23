import React, { useState } from 'react';
import styled from 'styled-components';

const Root = styled.div`
    display: inline-block;
`;

const StyledInput = styled.input`
    display: inline-block;
    width: 300px;
    border: none;
    outline: 1px solid;
    font-weight: normal;
    background-color: transparent;
    font-family: inherit;
    font-weight: 300;
    padding: 5px;
`;

export default function ChangeableText(props) {

    const { value, handleChange } = props;
    const [isEditable, setIsEditable] = useState(false);    
    const [isFocused, setIsFocused] = useState(false);
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
                            setIsFocused(false);
                            setIsEditable(false); 
                            handleChange(e.target.value);
                        }}
                        onFocus={e => setIsFocused(true)}
                        onKeyPress={e => {
                            if (isFocused === true && e.key === 'Enter') {
                                setIsEditable(false);
                                handleChange(e.target.value);
                            }     
                        }}
                    />
                ) : (
                    <div>{value}</div>
                )            
            }
        </Root>
        
    )
}