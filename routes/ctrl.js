module.exports = function (app, routes) {
    //网络爬虫
    app.get('/spider',routes.spider);
    
    //查询Service
    app.post('/service/:sql',routes.servicedo);
};