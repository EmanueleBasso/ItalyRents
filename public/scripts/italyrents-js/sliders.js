function loadSliders()
{
    if(document.getElementById('bathroomsSlider') != null){
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
    }

    if(document.getElementById('bedroomsSlider') != null){
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
    }

    if(document.getElementById('bedsSlider') != null){
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
    }

    if(document.getElementById('squareMetresSlider') != null){
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
    }

    if(document.getElementById('priceSlider') != null){
        noUiSlider.create(priceSlider, {
            start: [0, 12500],
            step: 500,
            connect: true,
            tooltips: true,
            format: wNumb({
                decimals: 0,
                postfix: ' €'
            }),
            range: {
                'min': 0,
                'max': 12500
            }
        });
    }
}