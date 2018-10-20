
const regexFWord = /fuck/gi;
const regexSWord = /shit/gi;

const fwordAlts = [
	'bleep',
	'frak',
	'boop-a-doop',
	'fook',
	'flap',
	'#$@&',
];

const swordAlts = [
	'salami',
	'shizzle',
	'shiznit',
	'sheeit',
	'sugar',
];

const randAltWord = (arr) => {
	const rand = Math.floor(Math.random() * arr.length);
	return arr[rand];
}

// a funny profanity sanitizer
const sanitize = input => {
	if (input) {
		return input.replace(regexFWord, () => randAltWord(fwordAlts)).replace(regexSWord, () => randAltWord(swordAlts));
	}
}

export default sanitize;