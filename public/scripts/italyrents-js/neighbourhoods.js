var bergamo = [];
var bologna = [];
var firenze = [];
var milano = [];
var napoli = [];
var roma = [];
var venezia = [];

function loadNeighbourhoods(citiesSelectBox)
{
    var value = citiesSelectBox.value;
    var neighbourhoodsSelectBox = (document.getElementsByName('neighbourhood'))[0];
    switch (value)
    {
        case 'Bergamo':
            neighbourhoodsSelectBox.disabled = false;
            break;
        case 'Bologna':
            break;
        case 'Firenze':
                break;
        case 'Milano':
            break;
        case 'Napoli':
            break;
        case 'Roma':
            break;
        case 'Venezia':
            break;
        default:
            neighbourhoodsSelectBox.disabled = true;
            neighbourhoodsSelectBox.
            break;
    }
}

function addNeighbourhoods(box, values)
{

}

function removeNeighbourhoods(box)
{
    
}