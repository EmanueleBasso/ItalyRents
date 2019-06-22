function loadSliders()
{
    var bathroomsSlider = document.getElementById('bathroomsSlider');
    var bedroomsSlider = document.getElementById('bedroomsSlider');
    var bedsSlider = document.getElementById('bedsSlider');
    var squareMetersSlider = document.getElementById('squareMetersSlider');

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

    noUiSlider.create(bedroomsSlider, {
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

    noUiSlider.create(bedsSlider, {
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

    noUiSlider.create(squareMetersSlider, {
        start: [30, 200],
        step: 10,
        connect: true,
        tooltips: true,
        format: wNumb({
            decimals: 0,
            postfix: ' mq'
        }),
        range: {
            'min': 30,
            'max': 200
        }
    });

    //How to retrieval left and right value of the slider
    console.log(bathroomsSlider.noUiSlider.get());

}