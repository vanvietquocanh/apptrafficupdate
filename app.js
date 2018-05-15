var express = require('express');
var path = require('path');
var passport = require("passport")
var bodyParser = require('body-parser');
var FacebookStrategy = require('passport-facebook');
var session = require("express-session");
var LocalStrategy = require("passport-local")
var infoAPI = require("./routes/apiInfo.js");
var schedule = require('node-schedule');
var multer = require("multer")
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/my-uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })


var home = require('./routes/home');
var redirectAdmin = require('./routes/redirectAdmin');
var demote = require('./routes/demote');
var dismissal = require('./routes/dismissal');
var promote = require('./routes/promote');
var index = require('./routes/index');
var signin = require('./routes/signin');
var saveData = require('./routes/saveData');
var apiAwaitingApproval = require('./routes/apiAwaitingApproval');
var apiMember = require('./routes/apiMember');
var Download = require('./routes/Download');
var profile = require('./routes/profile');
var myOffers = require('./routes/myOffers');
var offers = require('./routes/offers');
var trackinglink = require('./routes/trackinglink');
var postback = require('./routes/postBack');
var getListMaster = require('./routes/getMasterList');
var autoRequestLink = require('./routes/autoRequestLink');
var conversion = require('./routes/conversion');
var checkParameter = require('./routes/checkParameter');
var getReportClick = require('./routes/getReportClick');
var apiprofileUser = require('./routes/apiprofileUser');
var addUser = require('./routes/addUser');
var apiGetDataReportClick = require('./routes/apiGetDataReportClick');
var listNetwork = require('./routes/listNetwork');
var filter = require('./routes/filter');
var updateNetwork = require('./routes/updateNetwork');
var conversionlist = require('./routes/apiConversionData');
var addNetwork = require('./routes/addNetwork');
var search = require('./routes/search');
var postback = require('./routes/postBack');
var routeShowRequest = require('./routes/routeShowRequest');
var requestTestLink = require('./routes/requestTestLink');
var getCountry = require('./routes/get.country');
var apiRequestOfUser = require('./routes/apiRequestOfUser');
var requestList = require('./routes/requestList');
var responOfAdmin = require('./routes/responOfAdmin');
var updatePay = require('./routes/updatePay');
var delRequest = require('./routes/delRequest');
var updateuserlist = require('./routes/updateUserList');
var deleteLiveOffer = require('./routes/deleteLiveOffer');
var dataOfMyOffer = require('./routes/dataOfMyOffer');
var getSmartLink = require('./routes/smartLink');
var getDataUserList = require('./routes/getDataUserList');
var delNetwork = require('./routes/delNetwork');
var example = require('./routes/example');
var requesticonhandle = require('./routes/requesticonhandle');
// var equals = require('./routes/equals');
var device = require('./routes/device');
var clickAuto = require('./routes/clickAuto');
var checkApplication = require('./routes/checkapplication');
var cvr = require('./routes/cvr');
var addOffer = require('./routes/addOffer');
var postRequestSttUser = require('./routes/post.request.sttUser');
var listConversionIp = require('./routes/listConversionIp');
var getListCustomOffer = require('./routes/getListCustomOffer');
var getIconApp = require('./routes/getIconApp');
var getNetworkName = require('./routes/getNetworkName');
var delUser = require('./routes/delUser');
var getprofileUser = require('./routes/getprofileUser');
var publicuser = require('./routes/post.request.user');
var editUserAdd = require('./routes/edit.useradd');
var addNewOffer = require('./routes/addNewOffer');
var logout = require('./routes/logout');
var advertiser = require('./routes/advertiser');
var Monetization = require('./routes/monetization');
var viaSdk = require('./routes/viaSdk');
var statisticalConversion = require('./routes/statisticalConversion');
var getport = require('./routes/getport');
var clickMaster = require('./routes/clickMaster');
var dataPostCvrTotal = require('./routes/data.post.cvrTotal');
var getDataLead = require("./routes/getDataLead")
var apiGetAllOffer = require("./routes/api.getAllOffer");
var deviceVersionNew = require("./routes/deviceVersionNew");
var detailsCvrUser = require("./routes/detailsCvrUser");
var renderPostTest = require("./routes/render.testPost");
// var transactionid2 = require("./routes/transaction_id2");
var totalcvr = require("./routes/totalcvr")
var viewsLiveOffer = require("./routes/viewsLiveOffer")
var postImage = require("./routes/postImage")
var insertLiveLink = require("./routes/insertLiveLink");
var postDataIconHandle = require("./routes/post.dataIconHandle");
var viewIconHandle = require("./routes/view.iconHandle");
var apiGetIpConversion = require("./routes/api.get.ipConversion");
var getSSH = require("./routes/getSSH");
var requestSSH = require("./autoRequestSSH");
var autoEnableLink = require("./autoEnableLink");

var app = express();
var socket_io = require('socket.io');
var io = socket_io();
app.io = io;
io.on("connection", socket=>{
    socket.emit("offerlive","hello")
});
var server = 

app.enable('trust proxy')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.single("files"));
app.use('/checkparameter', checkParameter);
app.use('/clickauto', clickAuto);
app.use('/click', clickMaster);
app.use('/tracking', postback);
app.use('/publicuser', publicuser);
app.use('/request', cvr);
app.use('/checkapplication', checkApplication);
app.use('/checkstt', postRequestSttUser);
app.use('/form-file', postImage);
app.use('/insert', insertLiveLink);
app.use('/information', deviceVersionNew);
app.use('/testrequest', requestTestLink);
app.use('/infoapp', getIconApp);
app.use('/offerlist', apiGetAllOffer);
app.use('/getssh', getSSH);
app.use('/list', listConversionIp);
app.use('/netname', getNetworkName);
app.use('/ipcvr', apiGetIpConversion);
app.use("/getoffer", getDataLead);
app.use('/get', getport);
app.use('/advertiser', advertiser);
app.use('/monetization', Monetization);
app.use('/sdk-via', viaSdk);
app.use('/example', example);
app.use('/test-post', renderPostTest);
// app.use('/transaction', transactionid2);
app.use('/getcountry', getCountry);
app.use('/smartlink', getSmartLink);
app.use(session(
                { secret: 'coppycat',
                  resave: false,
                  saveUninitialized: false,
                  cookie:{
                    expires: new Date(253402300000000)
                  }
                }
              ));
// setTimeout(()=>{
    // requestSSH.requestDownload("Yoohoo", "Q0T4C1B7L0O7");
// },3000);
var j = schedule.scheduleJob("*/30 * * * *", function(){
    requestSSH.requestDownload("Yoohoo", "Q0T4C1B7L0O7");
});
var k = schedule.scheduleJob('00 00 12 * * 1-7', function(){
   autoEnableLink();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new FacebookStrategy(infoAPI, function(accessToken, refreshToken, profile, done) {
      done(null, profile);
    })|| new LocalStrategy(function(username, password, done) {
   
    })
    )
passport.serializeUser((user, done)=>{
  done(null, user)
})
passport.deserializeUser((id, done)=>{
  done(null, id)
})
app.route("/facebook").get(passport.authenticate("facebook"));
// app.use((req, res, next)=>{
//   req.io = io;
//   next();
// })
app.use('/', home);
app.use('/signin', signin);
app.use('/admin', redirectAdmin);
app.use('/dashboard', index);
app.use('/download', Download);
app.use('/savedata', saveData);
app.use('/delete', deleteLiveOffer);
app.use('/getprofileuser', getprofileUser);
app.use('/apiAwaitingApproval', apiAwaitingApproval);
app.use('/datatotalcvr', dataPostCvrTotal);
app.use('/requesticonhandle', requesticonhandle);
app.use('/member', apiMember);
app.use('/profile', profile);
app.use('/myoffers', myOffers);
app.use('/liveoffer', viewsLiveOffer);
app.use('/offers', offers);
app.use('/detailscvruser', detailsCvrUser);
app.use('/reportclick', getReportClick);
app.use('/trackinglink', trackinglink);
app.use('/demote', demote);
app.use('/totalcvr', totalcvr);
app.use('/dismissal', dismissal);
app.use('/deletenetwork', delNetwork);
app.use('/promote', promote);
app.use('/postback', postback);
app.use('/iconhandle', viewIconHandle);
app.use('/getmasterlist', getListMaster);
app.use('/profiledata', apiprofileUser);
app.use('/addnetwork', addNetwork);
app.use('/autorequestlink', autoRequestLink);
app.use('/conversion', conversion);
app.use('/reportclickgetdata', apiGetDataReportClick);
app.use('/filter', filter);
app.use('/listnetwork', listNetwork);
app.use('/search', search);
app.use('/updatenetwork', updateNetwork);
app.use('/conversionlist', conversionlist);
app.use('/userrequest', routeShowRequest);
app.use('/userpost', apiRequestOfUser);
app.use('/statistical', statisticalConversion);
app.use('/listrequest', requestList);
app.use('/respon', responOfAdmin);
app.use('/delrequest', delRequest);
app.use('/adduser', addUser);
app.use('/adminupdateuser', updateuserlist);
app.use('/device', device);
app.use('/datamyoffer', dataOfMyOffer);
app.use('/deluser', delUser);
app.use('/getdatauserlist', getDataUserList);
app.use('/updatepay', updatePay);
app.use('/addnewoffer', addOffer);
app.use('/addoffer', addNewOffer);
app.use('/edituseradd', editUserAdd);
app.use('/admincutomsoffer', getListCustomOffer);
app.use('/geticonhandle', postDataIconHandle);
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;