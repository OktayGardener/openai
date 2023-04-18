const givenHex = ['#EAFDFC', '#BFEAF5', '#91D8E4', '#82AAE3', '#B9D5E9'];

const palettes = [['#FFF8E1', '#FFE5F1', '#C0DEFF', '#ADA2FF', '#E1C8FF'],
['#2B3467', '#BAD7E9', '#FCFFE7', '#EB455F', '#3B9CBB'],
['#EEEEEE', '#F9B5D0', '#FF8E9E', '#FF597B', '#D7C5CB'],
['#E6E2C3', '#88A47C', '#227C70', '#1C315E', '#B4B2B1'],
['#F1F6F5', '#82C3EC', '#4B56D2', '#472183', '#C5A5EC'],
['#A555EC', '#D09CFA', '#F3CCFF', '#FFFFD0', '#BAA6F9'],
['#460C68', '#7F167F', '#CB1C8D', '#F56EB3', '#832288'],
['#C58940', '#E5BA73', '#FAEAB1', '#FAF8F1', '#C7C2A8'],
['#CBEDD5', '#97DECE', '#62B6B7', '#439A97', '#A2C7B0'],
['#F0E9D2', '#E6DDC4', '#678983', '#181D31', '#D3CDC2']
];

function getClosestPalette(givenHex, palettes) {
    let closestPalette = [];
    let smallestDifference = Number.MAX_SAFE_INTEGER;

    palettes.forEach(palette => {
        let difference = 0;
        for (let i = 0; i < givenHex.length; i++) {
            const givenColor = hexToRgb(givenHex[i]);
            const paletteColor = hexToRgb(palette[i]);
            difference += Math.abs(givenColor.r - paletteColor.r) + Math.abs(givenColor.g - paletteColor.g) + Math.abs(givenColor.b - paletteColor.b);
        }
        if (difference < smallestDifference) {
            smallestDifference = difference;
            closestPalette = palette;
        }
    });

    return closestPalette;
}

function hexToRgb(hex) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return { r, g, b };
}

const closestPalette = getClosestPalette(givenHex, palettes);

console.log(closestPalette); // prints the closest palette
