function fixLinks()
{
    var path = window.location.pathname;
    var splitted = path.split('/');
    var res = [];
    splitted.forEach(element => {
        if (element != '')
        {
            res.push(element);
        }
    });
    // console.log(res);
    if (res.length == 1)
    {
        var links = document.getElementById('sidebar-menu').getElementsByTagName('a');
        Object.values(links).forEach(link => {
            var tmp = link.href.split('/');
            var resource = tmp[tmp.length - 1];
            // console.log(link.href);
            link.href = 'ItalyRents/' + resource;
        });
    }
}