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
    if (res.length == 1)
    {
        var links = document.getElementById('sidebar-menu').getElementsByTagName('a');
        Object.values(links).forEach(link => {
            var tmp = link.href.split('/');
            var resource = tmp[tmp.length - 1];
            link.href = 'ItalyRents/' + resource;
        });
    }
}