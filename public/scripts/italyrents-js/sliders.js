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
        start: [1, 8],
        step: 1,
        connect: true,
        tooltips: true,
        format: wNumb({decimals: 0}),
        range: {
            'min': 1,
            'max': 8
        }
    });

    noUiSlider.create(bedsSlider, {
        start: [1, 12],
        step: 1,
        connect: true,
        tooltips: true,
        format: wNumb({decimals: 0}),
        range: {
            'min': 1,
            'max': 12
        }
    });

    noUiSlider.create(squareMetresSlider, {
        start: [30, 280],
        step: 10,
        connect: true,
        tooltips: true,
        format: wNumb({
            decimals: 0,
            postfix: ' mq'
        }),
        range: {
            'min': 30,
            'max': 280
        }
    });

    //How to retrieval left and right value of the slider
    //console.log(bathroomsSlider.noUiSlider.get());

}