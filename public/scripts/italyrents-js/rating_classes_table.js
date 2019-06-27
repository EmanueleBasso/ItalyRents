function fixSecondCol()
{
    var size = [];
    var regex = /[^0-9.]/g;
    var width = 0;
    size.push($('.first-col').width());
    size.push($('.first-col').css('padding-left'));
    size.push($('.first-col').css('padding-right'));
    for (var e of size)
    {
        var str = String(e).replace(regex, '');
        width += parseFloat(str);
    }
    $('.second-col').css('left', width);
}