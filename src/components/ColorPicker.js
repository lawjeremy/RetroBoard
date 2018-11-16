import React, { useState } from 'react';
import styled from 'styled-components';
import { TwitterPicker } from 'react-color'

const Root = styled.div`
    display: inline-block;
    position: relative;
    margin: 5px;
`;

const ColorSwatch = styled.div`
    display: inline-block;
    height: 30px;
    width: 30px;
    border-radius: 5px;
    background-color: ${({ bkgColor }) => bkgColor};
    cursor: pointer;
`;

const PickerWrapper = styled.div`
    position: absolute;
    top: 75px;
    right: 0px;
    font-size: 16px;
`;

export default function ColorPicker(props) {

    const { bkgColor, handleChangeBkgColor } = props;
    const [showPicker, setShowPicker] = useState(false);    

    return (
        <Root>
            <ColorSwatch bkgColor={bkgColor} onClick={() => setShowPicker(!showPicker)} />
            {showPicker && (
                <PickerWrapper>
                    <TwitterPicker 
                        triangle='top-right'
                        onChange={handleChangeBkgColor} 
                        colors={['#111D13', '#744253', '#465775', '#6B5B95', '#9E1030', '#755139',
                            '#616247', '#343148', '#7F4145', '#006E6D']}
                    />
                </PickerWrapper>
            )}
        </Root>
        
    )
}