import { CARD_HEIGHT } from './constants';

// calc Y offset based on card height (which is margin + height)
export const applyOffsetY = (arr = []) => {
	return arr.map( (e, i) => (
		{
			...e,
			offsetY: i * CARD_HEIGHT,
		}
	))
};

// todo: implement - is the card (offset by x & y) overlapping another card?

export const isItemOverlap = (x, y, col, index) => {

	// return index of card
	return -1;
}