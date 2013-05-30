/*生产环境上监控并把修改或删除的文件信息存入内存*/

var fs = require('fs');
var path = require('path');
var watcherUtil = require('./util');
var Watcher = require('./watcher').Watcher;

var Node = require('./node');

/*支持运行多个监控，只要指定不同的配置文件*/
(function(){
	var args = process.argv;
	if(args.length >= 2){
		var configPath = args[2] && (args[2].replace(/^\s+|\s+$/,''));
		(function(){
			var config = require('./config/index');
			if(configPath){
				config = util.extend(config,require(configPath));
			}
			watcherUtil.mkdirSync(path.dirname(config.copyToPath));
			
			var tree = new Node(config.watchPath,config.port);
			new Watcher()
			.on(Watcher.CREATE_FILE,function(d){
				tree.addPath(d.fullname,true);
			})
			.on(Watcher.CREATE_DIR,function(d){
				tree.addPath(d.fullname);
			})
			.on(Watcher.MODIFY,function(d){
				tree.addPath(d.fullname,d.filetype == Watcher.TYPE_FILE);
			})
			.on(Watcher.DELETE,function(d){
				tree.deletePath(d.fullname);
			})
			/*要同步初始化的文件夹及文件，保证之前已经注册成功事件*/
			.addWatch(config.watchPath,{ignorePath:/^\..+/});
		})();
	}
})();