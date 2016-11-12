var http = require('http');
var fs = require('fs');
var mime = require('mime');

var server = http.createServer(handle).listen(3000);
// 绑定服务器
var io = require("socket.io")(server);

function handle(req, res) {
	var filepath = '';
	if (req.url == '/') {
		filepath = './public/html/index.html';
	} else {
		filepath = './public' + req.url;
	}
	serverStatic(res, filepath);
};

function serverStatic(res, filepath) {
	fs.exists(filepath, function(exists) {
		if (exists) {
			fs.readFile(filepath, function(err, data) {
				if (err) {
					send404(res);
				}
				// mime.lookup 自动解析成相应模式
				res.writeHead(200, {
					"Content-Type": mime.lookup(filepath)
				});
				res.end(data);
			})
		} else {
			send404(res);
		}
	})
}

function send404(res) {
	res.writeHead(404, {
		"Content-Type": "text/plain"
	})
	res.end('404!sorry,Not found');
}
var num = 0;
var username = '';
var arr = [];
// emit(事件名，{发射主体})
// on(事件名，接收回调)
// 服务端和客户端要11对应
// io.on('connection', function(socket) {
// 	// console.log(socket);
// 	console.log(num);
// 	num++;
// 	socket.on('msg', function(data) {

// 		var msg = data.info;
// 		arr.push(msg);
// 		socket['id'] = username + num;
// 		io.sockets.emit('test', {
// 			name: arr,
// 			num: num - 3,
// 			say: socket['id'] + '已经加入聊天室'
// 		});

// 	})
// })
io.on('connection', function(socket) {
	// console.log(socket);
	console.log(num);
	num++;
	socket.on('msg', function(data) {
		var msg = data.info;
		socket['id'] = username + num;
		io.sockets.emit('test', {
			name: msg,
			num: num - 3,
			say: socket['id'] + '已经加入聊天室'
		});

	})
})