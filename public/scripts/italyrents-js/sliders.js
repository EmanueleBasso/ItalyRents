function loadSliders()
{
    var bathroomsSlider = document.getElementById('bathroomsSlider');
/*    var leftInput = document.getElementById('leftValue');
    var rightInput = document.getElementById('rightValue');
    var inputs = [leftInput, rightInput]; */

    noUiSlider.create(bathroomsSlider, {
        start: [1, 5],
        step: 1,
        connect: true,
        tooltips: true,
        format: wNumb({decimals: 0}),
        range: {
            'min': 1,
            'max': 5
        }
    });

    //How to retrieval left and right value of the slider
    console.log(bathroomsSlider.noUiSlider.get());

}