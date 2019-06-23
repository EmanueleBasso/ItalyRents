function startLoader(){
    var blurPage = `<div id="blurPage"></div>`

    var loader = `<div class="boxes">
    <div class="box">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div class="box">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div class="box">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div class="box">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    </div>`

    $('#body').append(blurPage)
    $('#body').append(loader)
    $('#body').css('overflow','hidden')
}

function stopLoader(){
    $('#blurPage').remove()
    $('.boxes').remove()
    $('#body').css('overflow','auto')
}